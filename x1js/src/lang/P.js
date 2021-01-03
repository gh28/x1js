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

    var allConfigs = {
        // name: {
        //     uri: string
        //     onLoad: function(object)
        // }
    };

    var addConfig = function(name, uri, onLoad) {
        if (!!allConfigs[name]) {
            throw "E: name conflict";
        }
        allConfigs[name] = {
            uri: uri,
            onLoad: onLoad
        };
        return P;
    };
    P.addConfig = addConfig;

    var loadjs = function(uri, onLoad) {
        if (_G._vm === "browser") {
            // add script tag
            var a = document.getElementsByTagName("script");
            if (a) {
                a = Array.prototype.slice.call(a);
                for (var i in a) {
                    if (a[i].getAttribute("src") === uri) {
                        return;
                    }
                }
            }
            var newScript = document.createElement("script");
            newScript.setAttribute("type", "text/javascript");
            newScript.setAttribute("src", uri);
            if (typeof(onLoad) == "function") {
                newScript.addEventListener("load", function(event) {
                    event.target.removeEventListener(event.target, a);
                    onLoad(event);
                });
            }
            document.head.append(newScript);
        } else if (_G._vm === "node") {
            // no will to violate rules of server-side js, but be prepared for all contingencies
            var o = require(uri);
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

    var allItems = {
        // name = meta
    };

    var accept = (function() {

        var preparedItems = [];

        var blockingQueues = {
            // name: [name, name, ...]
        };

        var isWorking = false;

        function work() {
            if (isWorking) {
                return;
            }
            if (preparedItems.length == 0) {
                return;
            }
            isWorking = true;

            var o = preparedItems.shift();
            var blockerResults = [];
            for (var i in o.blockerNames) {
                var blocker = allItems[o.blockerNames[i]];
                blockerResults[i] = blocker.result;
            }
            o.result = o.fn.apply(o, blockerResults) || {};

            var blockedNames = blockingQueues[o.name] || [];
            for (var i in blockedNames) {
                var blocked = allItems[blockedNames[i]];
                blocked.p--;
                if (blocked.p === 0) {
                    markReady(blocked);
                }
            }
            delete blockingQueues[o.name];

            isWorking = false;
        }

        var workTrigger = null;

        function startWorking() {
            if (workTrigger === null) {
                workTrigger = setInterval(work, 15);
            }
        }

        function stopWorking() {
            if (workTrigger != null) {
                clearInterval(workTrigger);
                workTrigger = null;
            }
        }

        var workThrottler = null;

        function startWorkThrottler() {
            if (workThrottler === null) {
                workThrottler = setTimeout(function() {
                    stopWorking();
                }, 50);
            }
        }

        function markReady(o) {
            preparedItems.push(o);
            if (workThrottler === null) {
                startWorking();
                startWorkThrottler();
            } else {
                clearTimeout(workThrottler);
                startWorkThrottler();
            }
        }

        function accept(name) {
            var o = allItems[name];
            for (var i in o.blockerNames) {
                var blockerName = o.blockerNames[i];
                var blocker = allItems[blockerName];
                if (!blocker || !blocker.result) {
                    // being blocked
                    if (!blockingQueues[blockerName]) {
                        blockingQueues[blockerName] = [];
                    }
                    blockingQueues[blockerName].push(o.name);
                    o.p++;

                    var config = allConfigs[blockerName];
                    if (config) {
                        loadjs(config.uri, config.onLoad);
                    }
                }
            }
            if (o.p === 0) {
                markReady(o);
            }
        };

        setTimeout(function() {
            var isLogging = false;
            var n = 0;
            var p = setInterval(function() {
                if (n == 12) {
                    clearInterval(p);
                    return;
                }
                var blockerNames = Object.getOwnPropertyNames(blockingQueues);
                if (blockerNames.length > 0 || isLogging) {
                    console.log("W: [" + blockerNames.length + "] blockingQueues remaining: " + blockerNames.join(", "));
                }
                if (preparedItems.length > 0 || isLogging) {
                    console.log("W: [" + preparedItems.length + "] preparedItems remaining");
                }
                isLogging = blockerNames.length > 0 || preparedItems.length > 0;
            }, 1000);
        }, 4000);

        return accept;
    })();

    var ask = function() {
        var a = Array.prototype.slice.call(arguments);
        return {
            answer: function(name, fn) {
                if (name === null) {
                    name = genName();
                } else if (typeof(name) != "string") {
                    throw "E: invalid argument: String expected";
                } else if (!!allItems[name]) {
                    throw "E: name conflict: [" + name + "] already exists";
                }
                if (fn === null) {
                    fn = function() {
                        // dummy
                    };
                } else if (typeof(fn) != "function") {
                    throw "E: invalid argument: function expected";
                }
                allItems[name] = {
                    blockerNames: a || [],
                    name: name,
                    fn: fn,
                    p: 0,
                    result: null
                };
                accept(name);
            }
        };
    };
    P.ask = ask;
})(_G);
