/**
 * P the dependency resolver and post-loader
 */

(function(_G, name) {
    if (typeof _G[name] !== "undefined") {
        throw "E: name conflict";
    }

    var P = _G[name] = {
        _name: name,
        _version: 871
    };

    // -----------------------------------------------------

    var _configs = {
        // "aaa": {
        //     uri: "path/to/script"
        //     depends: ["bbb", "ccc"],
        //     onLoaded: function(event) {
        //     }
        // }
    };

    P.addConfig = function(name, config) {
        assert(isString(name), "E: invalid argument: string expected");
        assert(isObject(config), "E: invalid argument: object expected");
        _configs[name] = config;
        return P;
    };

    var loadJsByConfig = function(config) {
        assert(isString(config.uri));
        assert(isFunction(config.onLoaded));
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
            if (isFunction(config["onLoaded"])) {
                newScript.addEventListener("load", function(event) {
                    event.target.removeEventListener(event.target, a);
                    config["onLoaded"](event);
                });
            }
            document.head.append(newScript);
        } else if (_G._vm === "node") {
            // no will to violate rules of server-side js, but be prepared for all contingencies
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
            return "noname-" + i++;
        }
    })();

    var createWrapper = function(name, depNames, fn) {
        return {
            name: name,
            depNames: depNames || [],
            fn: fn,
            p: 0,
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

        var _readys = [
            // wrapper, wrapper, ...
        ];

        var blockers = {
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

        function addToReadys(wrapper) {
            _readys.push(wrapper);
            if (_readys.length > 0 && timerToken == -1) {
                // unnecessary for a distinct message queue
                timerToken = setInterval(execute, 15);
            }
        }

        function execute() {
            logd("I: [" + Object.keys(blockers).length + "] blockers remaining")
            if (isExecuting) {
                return;
            }

            isExecuting = true;
            var wrapper = _readys.shift();
            wrapper.result = wrapper.fn.apply(wrapper, getDepResults(wrapper)) || {};

            var blockedNames = blockers[wrapper.name] || [];
            for (var i in blockedNames) {
                var blockedWrapper = store.get(blockedNames[i]);
                blockedWrapper.p--;
                if (blockedWrapper.p === 0) {
                    addToReadys(blockedWrapper);
                }
            }
            delete blockers[wrapper.name];

            if (_readys.length == 0) {
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
                    if (!blockers[depName]) {
                        blockers[depName] = [];
                    }
                    blockers[depName].push(wrapper.name);
                    wrapper.p++;

                    var config = _configs[depName];
                    if (config) {
                        loadJsByConfig(config);
                    }
                }
            }
            if (wrapper.p === 0) {
                addToReadys(wrapper);
            }
        };
    })();

    var register = function(name, depNames, fn) {
        if (store.contains(name)) {
            throw "E: name conflict";
        }
        store.put(name, createWrapper(name, depNames, fn));
        schedule(name);
    }

    var ask = function() {
        var depNames = Array.prototype.slice.call(arguments);

        function answer(name, fn) {
            if (arguments.length == 0) {
                throw "E: invalid argument: nothing received";
            } else if (arguments.length == 1) {
                var arg0 = arguments[0];
                if (isString(arg0)) {
                    fn = null;
                } else if (isFunction(arg0)) {
                    fn = arg0;
                    name = null;
                } else {
                    throw "E: invalid argument [" + name + "]";
                }
            } else {
                // take name & fn
            }

            if (!name) {
                name = genName();
            }
            if (!fn) {
                fn = dummy;
            }

            register(name, depNames, fn);
        }

        return {
            answer: answer
        };
    }

    P.ask = ask;
})(_G, "P");
