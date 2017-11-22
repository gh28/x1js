"use strict";

// the top object _G
(function(_G) {
    if (typeof window !== "undefined" && typeof navigator !== "undefined" && window.document) {
        // in browser
        _G.vm = "browser";
    } else if (typeof process !== "undefined" && process.versions && process.versions.node) {
        // in node
        _G = global;
        _G.vm = "node"
    }

    // prefix underscore suggests it is a preset/internal variable
    Object.defineProperties(_G, {
        _G: {
            value: _G,
            configurable: false,
            enumerable: false,
            writable: false
        }
    });
})(this); // astonishingly elegant

// the object as module loader
(function(name) {
    if (typeof(_G[name]) !== "undefined") {
        throw "E: name conflict";
    }

    var current = _G[name] = {
        _name: name,
        _version: 870
    };

    var dummy = function() {
    }

    var genName = (function() {
        var i = 0;
        return function() {
            "module-" + i++;
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
                    if (!blockTable[depName]) {
                        blockTable[depName] = [];
                    }
                    blockTable[depName].push(wrapper.name);
                    wrapper.distance++;
                }
            }
            if (wrapper.distance === 0) {
                addToReadyQueue(wrapper);
            }
        };
    })();

    function register(name, depNames, fn) {
        store.put(name, createWrapper(name, depNames, fn));
        schedule(name);
    }

    function ask() {
        var depNames = Array.prototype.slice.call(arguments);

        function answer(name, fn) {
            if (!fn) {
                if (!name) {
                    throw "E: invalid argument: nothing received";
                }
                if (typeof(name) === "string") {
                    // cannot be empty string
                    fn = null;
                } else if (typeof(name) === "function") {
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

    current.config = function() {
        // TODO
        return {
            ask: ask
        };
    };

    current.ask = ask;
})("P");
