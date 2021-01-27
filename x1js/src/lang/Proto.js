"use strict";

// proto is an object rather than a function and contains constructors
(function(_G) {

    function isProto(p) {
        return isObject(p) && isCallable(p._ctor) && isCallable(p.malloc);
    }
    _G.isProto = isProto;

    function getProto(o) {
        return Object.getPrototypeOf(o);
    }
    _G.getProto = getProto;

    function setProto(o, proto) {
        return Object.setPrototypeOf(o, proto);
    }
    _G.setProto = setProto;

    function newProto(superProto, ctor) {
        if (isVoid(superProto)) {
            superProto = null;
        } else if (!isObject(superProto)) {
            throw "E: invalid argument: object expected";
        }
        if (isVoid(ctor)) {
            ctor = dummy;
        } else if (!isCallable(ctor)) {
            throw "E: invalid argument: function expected";
        }

        var proto = Object.create(superProto);
        proto._ctor = ctor;

        proto.malloc = function() {
            var o = Object.create(proto);
            var stack = [];
            {
                var p = Object.getPrototypeOf(o);
                while (p != null) {
                    stack.push(p);
                    p = Object.getPrototypeOf(p);
                }
            }
            var args = Array.prototype.slice.apply(arguments);
            while (stack.length > 0) {
                var p = stack.pop();
                if (isCallable(p._ctor)) {
                    p._ctor.apply(o, args);
                }
            }
            return o;
        };

        return proto;
    };
    _G.newProto = newProto;

    function isInstanceOf(o, proto) {
        if (isProto(proto)) {
            var p = getProto(o);
            while (p != null) {
                if (p == proto) {
                    return true;
                }
            }
        }
        return false;
    }
    _G.isInstanceOf = isInstanceOf;
})(_G);
