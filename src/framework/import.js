"use strict";

/**
 *  what i call "struct-based design":
 *    - a function can be every object's "member method", as long as the object has corresponding member variables
 *    - isObject(Class) && !isFunction(Class);
 *    - Class.getProto() == SuperClass;
 *    - object = Class.create();
 *    - object.getProto() == Class;
 */
(function(_G) {

    function dummy() {
    }

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
            while (stack.length > 0) {
                var C = stack.pop();
                if (isFunction(C.ctor)) {
                    C.ctor.apply(o, Array.prototype.slice.apply(arguments));
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
