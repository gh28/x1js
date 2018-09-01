/**
 * P the dependency resolver and post-loader
 */

(function(_G, name) {
    if (typeof _G[name] !== "undefined") {
        throw "E: name conflict";
    }

    var P = _G[name] = {
        _name: name,
        _version: 872
    };

    // -----------------------------------------------------

    var configs = {
        // name: {
        //     uri: string
        //     onLoad: function(object)
        // }
    };

    var addConfig = function(name, uri, onLoad) {
        assert(isString(name), "E: invalid argument: string expected");
        assert(isString(uri), "E: invalid argument: string expected");
        assert(isVoid(onLoad) || isFunction(onLoad), "E: invalid argument: function expected");
        if (!isVoid(configs[name])) {
            throw "E: name conflict";
        }
        configs[name] = {
            uri: uri,
            onLoad: onLoad
        };
        return P;
    };
    P.addConfig = addConfig;

    var loadjs = function(src, onLoad) {
        assert(isString(src));
        assert(isVoid(onLoad) || isFunction(onLoad));
        if (_G._vm === "browser") {
            // add script tag
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
            if (isFunction(onLoad)) {
                newScript.addEventListener("load", function(event) {
                    event.target.removeEventListener(event.target, a);
                    onLoad(event);
                });
            }
            document.head.append(newScript);
        } else if (_G._vm === "node") {
            // no will to violate rules of server-side js, but be prepared for all contingencies
            var o = require(src);
            onLoad(o);
        }
    };
    P.loadjs = loadjs;

    // -----------------------------------------------------

    var dummy = function() {
    }

    var genName = (function() {
        var i = 0;
        return function() {
            return "noname-" + i++;
        }
    })();

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

    var accept = (function() {
        var readys = [];

        var blockers = {
            // blockerName: [name, name, ...]
        };

        var isWorking = false;

        function work() {
            logd("I: [" + Object.keys(blockers).length + "] blockers remaining")
            if (isWorking) {
                return;
            }
            isWorking = true;

            var o = readys.shift();
            var blockerResults = [];
            for (var i in o.blockerNames) {
                var blocker = store.get(o.blockerNames[i]);
                blockerResults[i] = blocker.result;
            }
            o.result = o.fn.apply(o, blockerResults) || {};

            var blockedNames = blockers[o.name] || [];
            for (var i in blockedNames) {
                var blocked = store.get(blockedNames[i]);
                blocked.p--;
                if (blocked.p === 0) {
                    markReady(blocked);
                }
            }
            delete blockers[o.name];

            if (readys.length == 0) {
                sleep();
            }
            isWorking = false;
        }

        var timerToken = -1;

        function awake() {
            if (readys.length > 0 && timerToken == -1) {
                timerToken = setInterval(work, 15);
            }
        }

        function sleep() {
            clearInterval(timerToken);
            timerToken = -1;
        }

        function markReady(o) {
            readys.push(o);
            awake();
        }

        return function(name) {
            var o = store.get(name);
            for (var i in o.blockerNames) {
                var blockerName = o.blockerNames[i];
                var blocker = store.get(blockerName);
                if (!blocker || !blocker.result) {
                    // being blocked
                    if (!blockers[blockerName]) {
                        blockers[blockerName] = [];
                    }
                    blockers[blockerName].push(o.name);
                    o.p++;

                    var config = configs[blockerName];
                    if (config) {
                        loadjs(config.uri, config.onLoad);
                    }
                }
            }
            if (o.p === 0) {
                markReady(o);
            }
        };
    })();

    var ask = function() {
        var a = Array.prototype.slice.call(arguments);
        return {
            answer: function(name, fn) {
                if (isVoid(name)) {
                    name = genName();
                } else if (!isString(name)) {
                    throw "E: invalid argument: String expected";
                } else if (store.contains(name)) {
                    throw "E: name conflict";
                }
                if (isVoid(fn)) {
                    fn = dummy;
                } else if (!isFunction(fn)) {
                    throw "E: invalid argument: Function expected";
                }
                store.put(name, {
                    blockerNames: a || [],
                    name: name,
                    fn: fn,
                    p: 0,
                    result: null
                });
                accept(name);
            }
        };
    };
    P.ask = ask;
})(_G, "P");
