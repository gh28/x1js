"use strict";

/**
 * _G the top object
 */
(function() {

    if (typeof _G === "object" && _G !== null && _G === _G._G) {
        // already there
        return;
    }

    var _G = null;
    if (typeof window !== "undefined" && typeof navigator !== "undefined" && window.document) {
        _G = window;
        _G._vm = "browser";
    } else if (typeof process !== "undefined" && process.versions && process.versions.node) {
        _G = global;
        _G._vm = "node"
    }

    if (_G) {
        Object.defineProperties(_G, {
            // prefix underscore suggests it is a preset/internal variable
            _G: {
                value: _G,
                configurable: false,
                enumerable: false,
                writable: false
            }
        });
    }
})();

