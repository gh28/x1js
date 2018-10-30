"use strict";

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

    _G.dummy = function() {
        // dummy
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
 * bad but tasty Object extension
 */
(function() {

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
})();

/**
 *  what i call "struct-based design":
 *    - a function can be every object's "member method", as long as the object has corresponding member variables
 *    - class is kind of object rather than function
 *    - class is object's prototype
 *    - class' prototype is super class
 *    - class supervises constructor
 */
(function(_G) {

    _G.newClass = function(superClass, ctor) {
        if (isVoid(superClass)) {
            superClass = null;
        } else if (!isObject(superClass)) {
            throw "E: invalid argument: object expected";
        }
        if (isVoid(ctor)) {
            ctor = dummy;
        } else if (!isFunction(ctor)) {
            throw "E: invalid argument: function expected";
        }

        var Class = Object.create(superClass);

        Class.ctor = ctor;

        Class.create = function() {
            var o = Object.create(null);
            var stack = [ Class ];
            while (superClass != null) {
                stack.push(superClass);
                superClass = Object.getPrototypeOf(superClass);
            }
            var args = Array.prototype.slice.apply(arguments);
            while (stack.length > 0) {
                var C = stack.pop();
                if (isFunction(C.ctor)) {
                    C.ctor.apply(o, args);
                }
            }
            Object.setPrototypeOf(o, Class);
            return o;
        };

        return Class;
    };

    function isClass(C) {
        return isObject(C) && isFunction(C.create) && isFunction(C.ctor);
    }

    _G.instanceOf = function(o, C) {
        if (isClass(C)) {
            var myClass = Object.getPrototypeOf(o);
            while (myClass != null) {
                if (myClass === C) {
                    return true;
                }
                myClass = Object.getPrototypeOf(myClass);
            }
        }
        return false;
    };

    function isDottedIdentifier(id) {
        assert(isString(id));
        var identifierRegex = "[A-Za-z$_][A-Za-z0-9$_]*";
        var regex = "^(" + identifierRegex + "\.)*" + identifierRegex + "$";
        return !!id.match(regex);
    }

    function getNamespace(a, createIfNotExist) {
        var ns = _G;
        for (var i in a) {
            var ai = a[i];
            if (typeof ns[i] === "undefined") {
                if (createIfNotExist) {
                    ns[ai] = {};
                } else {
                    throw "E: name not exist";
                }
            } else if (!isObject(ns[ai])) {
                throw "E: name conflict";
            }
            ns = ns[ai];
        }
        return ns;
    }

    _G.importClass = function(id) {
        assert(isDottedIdentifier(id));
        var a = id.split(".");
        var name = a.pop();
        var ns = getNamespace(a);
        if (!isObject(ns)) {
            throw "E: no such namespace";
        }
        if (!isClass(ns[name])) {
            // would sleep and start loading (via filesystem or network) and awake when loading done
            // but there is no such mechanism in js
            throw "E: no such class";
        }
        return ns[name];
    };

    _G.exportClass = function(id, C) {
        assert(isDottedIdentifier(id));
        assert(isClass(C));
        var a = id.split(".");
        var name = a.pop();
        var ns = getNamespace(a, true);
        if (typeof ns[name] !== "undefined") {
            throw "E: export: name conflict";
        }
        ns[name] = C;
    };
})(_G);
