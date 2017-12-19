(function(_G) {

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

    _G.isList = function(o) {
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
        // o.__proto__ = proto;
        return Object.setPrototypeOf(o, proto);
    };

    _G.createObject = function(proto) {
        return Object.create(proto);
    };

    _G.getProto = function(o) {
        // return o.__proto__;
        return Object.getPrototypeOf(o);
    };

    _G.forEach = function(o, callback) {
        for (var k in o) {
            callback(k, o[k]);
        }
    };
})(_G);

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

    O.hasOwn = function(key) {
        return Object.prototype.hasOwnProperty.call(this, key);
    };

    O.clear = function() {
        var caller = this;
        for (var i in O.ownKeys.call(caller)) {
            delete caller[i];
        }
    };

    O.copy = function(goesDeep) {
        var caller = this;
        var o = createObject(caller.getProto());
        for (var k in caller) {
            if (caller.hasOwnProperty(k)) {
                if (goesDeep && isObject(caller[k])) {
                    o[k] = arguments.callee.call(caller[k], goesDeep);
                } else {
                    o[k] = caller[k];
                }
            }
        }
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
                    if (!O.hasOwn.call(caller, k) && O.hasOwn.call(o, k) && !isNull(o[k])) {
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
            if (O.hasOwn.call(caller, i) && O.hasOwn.call(o, i)) {
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
            if (O.hasOwn.call(caller, i) && !O.hasOwn.call(o, i)) {
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
