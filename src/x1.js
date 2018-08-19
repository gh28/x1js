/**
 *  what i call "struct-based design":
 *    - a function can be every object's "member method", as long as the object has corresponding fields
 *    - o and o.static has their own inheritance line, respectively
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
        return console.assert(value, message);
    };

    _G.logd = function(message) {
        return console.log(message);
    };

    _G.forEach = function(o, callback) {
        for (var k in o) {
            callback(k, o[k]);
        }
    };
})(_G);

(function() {

    var O = {};

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

    O.setProto = function(proto) {
        var o = this;
        // o.__proto__ = proto;
        return Object.setPrototypeOf(o, proto);
    };

    O.getProto = function() {
        var o = this;
        // return o.__proto__;
        return Object.getPrototypeOf(o);
    };

    // --------

    O.hasOwn = function(key) {
        return Object.prototype.hasOwnProperty.call(this, key);
    };

    O.copy = function() {
        var o = this;
        var o2 = Object.create(Object.getPrototypeOf(o));
        for (var k in o) {
            if (O.hasOwn.call(o, k)) {
                o2[k] = o[k];
            }
        }
        return o2;
    };

    O.deepCopy = function() {
        var o = this;
        var o2 = Object.create(Object.getPrototypeOf(o));
        for (var k in o) {
            if (O.hasOwn.call(o, k)) {
                if (isObject(o[k])) {
                    o2[k] = arguments.callee.call(o[k]);
                } else {
                    o2[k] = o[k];
                }
            }
        }
        return o2;
    };

    O.merge = function(o2) {
        var o = this;
        if (!!o2) {
            for (var k in o2) {
                if (!O.hasOwn.call(o, k) && O.hasOwn.call(o2, k)) {
                    o[k] = o2[k];
                }
            }
        }
        return o;
    };

    // --------

    O.static = {};

    O.static.fromOneLine = function(oneLine, majorSeparator, minorSeparator) {
        assert(isString(oneLine), "E: invalid argument [" + oneLine + "]");
        majorSeparator = majorSeparator || "&";
        minorSeparator = minorSeparator || "=";
        var o = {};
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
        majorSeparator = majorSeparator || "&";
        minorSeparator = minorSeparator || "=";
        var o = this;
        var a = [];
        for (var k in o) {
            if (O.hasOwn.call(o, k) && !isVoid(o[k])) {
                a.push(k + minorSeparator + o[k]);
            }
        }
        return a.join(majorSeparator);
    };

    for (var i in O) {
        O.setMember.call(Object.prototype, i, O[i]);
    }
})();

(function() {

    var S = {};

    S.setMember("static", {});

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
})();
