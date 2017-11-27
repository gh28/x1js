"use strict";

(function() {

    _G.isNull = function(o) {
        return o === undefined || o === null;
    };

    _G.isNumber = function(o) {
        return typeof(o) === "number";
    };

    _G.isFunction = function(o) {
        return typeof(o) === "function";
    };

    _G.isString = function(o) {
        return typeof(o) === "string";
    };

    _G.isVector = function(o) {
        return Object.prototype.toString.call(o) === "[object Array]";
    };

    _G.isObject = function(o) {
        return Object.prototype.toString.call(o) === "[object Object]";
    };

    _G.assert = function(value, message) {
        if (!value) {
            if (message) {
                throw "E: assert fails: " + message;
            } else {
                throw "E: assert fails";
            }
        }
    };

    _G.logd = function(message) {
        return console.log(message);
    };

    _G.setProto = function(o, proto) {
        // again, prefix underscore suggests preset/internal variable
        o._proto = o.__proto__ = proto;
    };
})();

/**
 *  what i call "static-based design":
 *    - a function can be every object's "member method", as long as the object has corresponding fields
 *    - class.static inherts super.static
 */

(function() {

    var O = {};

    Object.defineProperties(O, {
        static: {
            value: {},
            configurable: false,
            enumerable: false,
            writable: false
        }
    });

    O.static.create = function() {
        var o = {};
        setProto(o, O);
        o.constructor = arguments.callee;
        return o;
    };

    // make "instanceof" work
    O.static.create.prototype = O;

    O.allKeys = function() {
        return Object.keys.call(null, this);
    };

    O.ownKeys = function() {
        var caller = this;
        var ownKeys = [];
        var keys = O.allKeys.call(caller);
        for (var i in keys) {
            if (caller.hasOwnProperty(keys[i])) {
                ownKeys.push(keys[i]);
            }
        }
        return ownKeys;
    }

    O.clear = function() {
        var caller = this;
        for (var i in O.ownKeys.call(caller)) {
            delete caller[i];
        }
    };

    O.copy = function(goesDeep) {
        var caller = this;
        var o = {};
        for (var k in caller) {
            if (caller.hasOwnProperty(k)) {
                if (goesDeep && isObject(caller[k])) {
                    o[k] = arguments.callee.call(caller[k], goesDeep);
                } else {
                    o[k] = caller[k];
                }
            }
        }
        setProto(o, caller.prototype);
        o.constructor = caller.constructor;
        return o;
    };

    O.static.fromOneLine = function(oneLine, majorSeparator, minorSeparator) {
        var o = O.static.create();
        if (!isString(oneLine)) {
            throw "E: invalid argument [" + oneLine + "]";
        }
        majorSeparator = majorSeparator || "&";
        minorSeparator = minorSeparator || "=";
        var a = oneLine.split(majorSeparator);
        for (var i = 0; i < a.length; ++i) {
            var p = a[i].split(minorSeparator);
            if (p[0]) {
                o[p[0]] = (p[1] || "1");
            }
        }
        return o;
    };

    // FIXME encode values
    O.toOneLine = function(majorSeparator, minorSeparator) {
        var caller = this;
        majorSeparator = majorSeparator || "&";
        minorSeparator = minorSeparator || "=";
        var a = [];
        for (var k in caller.ownKeys()) {
            if (caller[k]) {
                a.push(k + minorSeparator + caller[k]);
            }
        }
        return a.join(majorSeparator);
    };

    // collection manipulation/operation

    O.merge = function() {
        var caller = this;
        for (var i in arguments) {
            var o = arguments[i];
            for (var k in o) {
                if (!caller.hasOwnProperty(k) && o.hasOwnProperty(k) && !isNull(o[k])) {
                    caller[k] = o[k];
                }
            }
        }
        return caller;
    };

    O.intersect = function(o) {
        var caller = this;
        var result = {};
        for (var i in caller) {
            if (caller.hasOwnProperty(i) && o.hasOwnProperty(i)) {
                result[i] = caller[i];
            }
        }
        return result;
    };

    // A \ B = A union B remove B
    O.complement = function(o) {
        var caller = this;
        var result = {};
        for (var i in caller) {
            if (caller.hasOwnProperty(i) && !o.hasOwnProperty(i)) {
                result[i] = caller[i];
            }
        }
        return result;
    };

    O.merge.call(Object.prototype, O);
})();

(function() {

    var S = {};

    Object.defineProperties(S, {
        static: {
            value: {},
            configurable: false,
            enumerable: false,
            writable: false
        }
    });

    setProto(S, String.prototype);

    S.codeAt = String.prototype.codePointAt;

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

    S.static.compare = function(caller, s) {
        if (!isString(caller) || !isString(s)) {
            throw "E: invalid argument: expecting String";
        }

        if (caller === s)  {
            return 0;
        }
        if (caller == null) {
            return -1;
        }
        if (s == null) {
            return 1;
        }
        return caller < s ? -1 : 1;
    };

    S.compare = function(s) {
        return S.static.compare.call(null, this, s);
    };

    String.prototype.merge(S);
})();
