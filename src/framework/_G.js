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

/**
 * facility
 */
(function(_G) {

    _G.isVoid = function(o) {
        return o === undefined || o === null;
    };

    _G.isNumber = function(o) {
        return typeof(o) === "number";
    };

    _G.isFunction = function(o) {
        return typeof(o) === "function";
    };
    _G.isCallable = isFunction;

    _G.isString = function(o) {
        return typeof(o) === "string";
    };

    _G.isList = function(o) {
        return Object.prototype.toString.call(o) === "[object Array]";
    };

    _G.isObject = function(o) {
        return Object.prototype.toString.call(o) === "[object Object]";
    };

    _G.forEach = function(o, callback) {
        for (var k in o) {
            callback(k, o[k]);
        }
    };

    _G.assert = function(value, message) {
        return console.assert(value, message);
    };

    _G.logd = function(message) {
        return console.log(message);
    };
})(_G);

/**
 * bad but tasty extension
 */
(function(isEnabled) {

    if (!isEnabled) {
        return;
    }

    // --------

    var O = Object.create(null);

    O.setMember = function(key, value, ro) {
        assert(isString(key));
        var o = this;
        Object.defineProperty(o, key, {
            value: value,
            enumerable: false,
            writable: !ro,
            configurable: false
        });
    };

    O.merge = function(o) {
        var p = this;
        Cmap.merge(p, o);
        return p;
    };

    for (var i in O) {
        O.setMember.call(Object.prototype, i, O[i]);
    }

    // --------

    var L = Object.create(null);

    L.add = Array.prototype.push;

    for (var i in L) {
        Array.prototype.setMember(i, L[i]);
    }

    // --------

    var S = Object.create(null);

    S.codeAt = String.prototype.codePointAt;

    S.toLower = String.prototype.toLowerCase;

    S.toUpper = String.prototype.toUpperCase;

    S.equals = function(s) {
        return this == s;
    };

    S.isEmpty = function() {
        return this.length === 0;
    };

    S.trim = function() {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    };

    S.startsWith = function(s) {
        return this.substring(0, s.length) === s;
    };

    S.endsWith = function(s) {
        return this.substring(this.length - s.length) === s;
    };

    S.compareTo = function(s) {
        var s0 = this;
        if (s0 === s)  {
            return 0;
        }
        if (isVoid(s)) {
            return 1;
        }
        return s0 < s ? -1 : 1;
    };

    for (var i in S) {
        String.prototype.setMember(i, S[i]);
    }
})(true);
