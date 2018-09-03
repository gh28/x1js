/**
 * P the dependency resolver and post-loader
 */
(function(_G) {
    var NAME = "P";
    var VERSION = 873;

    if (typeof _G[NAME] !== "undefined") {
        throw "E: name conflict";
    }

    var P = _G[NAME] = {
        _name: NAME,
        _version: VERSION
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

    var genName = (function() {
        var i = 0;
        return function() {
            return "noname-" + i++;
        }
    })();

    var store = Store.create();

    var accept = (function() {

        var readys = [];

        var blockers = {
            // blockerName: [name, name, ...]
        };

        var isWorking = false;

        function work() {
            if (isWorking) {
                return;
            }
            if (readys.length == 0) {
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

            isWorking = false;
        }

        var workTrigger = Timer.create()
            .schedule(work, 15, Infinity)
            .stop();

        var workThrottler = Timer.create()
            .schedule(function() {
                    workTrigger.stop();
                }, 50, 1)
            .stop();

        function markReady(o) {
            readys.push(o);
            if (!workThrottler.isRunning()) {
                workTrigger.reschedule();
                workThrottler.reschedule();
            } else {
                workThrottler.reschedule();
            }
        }

        function accept(name) {
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

        Timer.create().schedule(function() {
            var isLogging = false;
            Timer.create().schedule(function() {
                var size = Object.keys(blockers).length;
                if (size > 0 || isLogging) {
                    logd("I: [" + size + "] blockers remaining");
                }
                isLogging = size > 0;
            }, 1000, 12);
        }, 4000, 1);

        return accept;
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
                    throw "E: name conflict: [" + name + "] already exists";
                }
                if (isVoid(fn)) {
                    fn = dummy;
                } else if (!isFunction(fn)) {
                    throw "E: invalid argument: function expected";
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
})(_G);
