// core javascript

"use strict";

_G.logd = console.log;

_G.isNull = function(o) {
    return typeof(o) == "undefined" || o == null;
};

_G.isNumber = function(o) {
    return typeof(o) == "number";
};

_G.isCallable = function(o) {
    return typeof(o) == "function";
};
_G.isFunction = _G.isCallable;

_G.isString = function(o) {
    return typeof(o) == "string";
};

_G.isVector = function(o) {
    return typeof(o) == "object" && o instanceof Array;
}

_G.isMappin = function(o) {
    return typeof(o) == "object" && !(o instanceof Array);
};

_G.codeAt = function(s, i) {
    assert(isString(s));
    return s.codePointAt(i);
};

Object.defineProperties(Object.prototype, {
    "extend": {
        configurable: false,
        enumerable: false,
        writable: true,
        //__proto__: null,
        value: function(o) {
            if (!isCallable(o)) {
                throw "E: invalid argument [" + o + "]. Expecting a function";
            }
            // set __proto__ and constructor
            Object.setPrototypeOf(this, o.prototype || null);
        }
    }
});
