// async component loader
(function(_G) {
    if (typeof _G["P"] !== "undefined") {
        throw "E: name conflict";
    }

    var P = _G["P"] = {
        _name: "P",
        _version: 870
    };

    // -----------------------------------------------------

    var _config = {
        // "aaa": {
        //     uri: "path/to/script"
        //     depends: ["bbb", "ccc"],
        //     onLoaded: function(event) {
        //     }
        // }
    };

    P.config = function(config) {
        assert(isObject(config), "E: invalid argument: object expected");
        _config.merge(config);
        return P;
    };

    var loadjs = function(name) {
        assert(isString(name) && name.length > 0, "E: invalid argument [" + name + "]");

        var config = _config[name];
        if (!config) {
            return;
        }
        assert(isString(config["uri"]) && config["uri"].length > 0, "E: invalid config: [" + name + "]");

        if (_G._vm === "browser") {
            // add script tag
            var src = config["uri"];
            var a = document.getElementsByTagName("script");
            if (a) {
                a = Array.prototype.slice.call(a);
                for (var i in a) {
                    if (a[i].getAttribute("src") === src) {
                        return;
                    }
                }
            }
            var newScript = document.createElement("script");
            newScript.setAttribute("type", "text/javascript");
            newScript.setAttribute("src", src);
            if (config["onLoaded"]) {
                function a(event) {
                    event.target.removeEventListener(event.target, a);
                    config["onLoaded"](event);
                }
                newScript.addEventListener("load", a);
            }
            document.head.append(newScript);
        } else if (_G._vm === "node") {
            // no will to voilate rules of server-side js, but be prepared for all contingencies
            (function(name, src) {
                register(name, [], function() {
                    return require(src);
                });
            })(name, src);
        }
    };

    // -----------------------------------------------------

    var dummy = function() {
    }

    var genName = (function() {
        var i = 0;
        return function() {
            "noname-" + i++;
        }
    })();

    var createWrapper = function(name, depNames, fn) {
        return {
            name: name,
            depNames: depNames,
            fn: fn,
            distance: 0,
            result: null
        };
    };

    var store = (function() {
        var _store = {
            // "key": value
        };

        var get = function(key) {
            return _store[key] || null;
        };

        var put = function(key, value) {
            _store[key] = value;
        }

        var contains = function(key) {
            return !!get(key);
        }

        var remove = function(key) {
            delete _store[key];
        };

        return {
            contains: contains,
            get: get,
            put: put,
            remove: remove
        };
    })();

    var schedule = (function() {

        var readyQueue = [];

        // also to notify
        var blockTable = {
            // depName: [name, name, ...]
        };

        var timerToken = -1;

        var isExecuting = false;

        var getDepResults = function(wrapper) {
            var depResults = [];
            for (var i in wrapper.depNames) {
                depResults[i] = store.get(wrapper.depNames[i]).result;
            }
            return depResults;
        }

        function addToReadyQueue(wrapper) {
            readyQueue.push(wrapper);
            if (readyQueue.length > 0 && timerToken == -1) {
                // unnecessary for a distinct message queue
                timerToken = setInterval(execute, 20);
            }
        }

        function execute() {
            if (isExecuting) {
                return;
            }

            isExecuting = true;
            var wrapper = readyQueue.shift();
            wrapper.result = wrapper.fn.apply(wrapper, getDepResults(wrapper)) || {};

            var blockedNames = blockTable[wrapper.name];
            for (var i in blockedNames) {
                var blockedWrapper = store.get(blockedNames[i]);
                blockedWrapper.distance--;
                if (blockedWrapper.distance === 0) {
                    addToReadyQueue(blockedWrapper);
                }
            }
            delete blockTable[wrapper.name];

            if (readyQueue.length == 0) {
                clearInterval(timerToken);
                timerToken = -1;
            }
            isExecuting = false;
        }

        return function(name) {
            var wrapper = store.get(name);
            for (var i in wrapper.depNames) {
                var depName = wrapper.depNames[i];
                var dep = store.get(depName);
                if (!dep || !dep.result) {
                    // being blocked
                    if (!blockTable[depName]) {
                        blockTable[depName] = [];
                    }
                    blockTable[depName].push(wrapper.name);
                    wrapper.distance++;

                    loadjs(depName);
                }
            }
            if (wrapper.distance === 0) {
                addToReadyQueue(wrapper);
            }
        };
    })();

    var register = function(name, depNames, fn) {
        store.put(name, createWrapper(name, depNames, fn));
        schedule(name);
    }

    var ask = function() {
        var depNames = Array.prototype.slice.call(arguments);

        function answer(name, fn) {
            if (!fn) {
                if (!name) {
                    throw "E: invalid argument: nothing received";
                }
                if (isString(name)) {
                    // cannot be empty string
                    fn = null;
                } else if (isFunction(name)) {
                    fn = name;
                    name = null;
                } else {
                    throw "E: invalid argument [" + name + "]";
                }
            }
            if (!name) {
                name = genName();
            }
            if (!fn) {
                fn = dummy;
            }

            if (store.contains(name)) {
                throw "E: name conflict";
            }

            register(name, depNames, fn);
        }

        return {
            answer: answer
        };
    }

    P.ask = ask;
})(_G);
