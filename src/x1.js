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
            throw !!message ? message : "E: assert fails";
        }
    };

    _G.logd = function(message) {
        return console.log(message);
    };

    _G.setProto = function(o, proto) {
        o.__proto__ = proto;
    };

    _G.getProto = function(o) {
        return o.__proto__;
    };
})();

/**
 *  what i call "static-based design":
 *    - a function can be every object's "member method", as long as the object has corresponding fields
 *    - class.static inherts super.static
 */

(function() {

    _G.createModule = function(proto, instInit) {
        var C = {};

        setProto(C, proto);

        Object.defineProperties(C, {
            static: {
                value: {},
                configurable: false,
                enumerable: false,
                writable: false
            }
        });

        if (isObject(proto) && isObject(proto.static)) {
            setProto(C.static, proto.static);
        }

        if (!!instInit) {
            C.static.create = function() {
                var o = instInit.apply(null, Array.prototype.slice.apply(arguments));
                setProto(o, C);
                o.constructor = arguments.callee;
                return o;
            };

            // make "instanceof" work
            C.static.create.prototype = C;
        }

        return C;
    };

    var O = createModule(null, null);

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
        setProto(o, caller.getProto());
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
        var args = Array.prototype.slice.apply(arguments);
        for (var i in args) {
            var o = args[i];
            if (!!o) {
                for (var k in o) {
                    if (!caller.hasOwnProperty(k) && o.hasOwnProperty(k) && !isNull(o[k])) {
                        caller[k] = o[k];
                    }
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

    var S = createModule(null, null);

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

    S.compare = function(s) {
        var caller = this;
        if (caller === s)  {
            return 0;
        }
        if (isNull(s)) {
            return 1;
        }
        return caller < s ? -1 : 1;
    };

    String.prototype.merge(S);
})();
