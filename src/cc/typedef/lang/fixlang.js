// core javascript

"use strict";

require("./Mappin.js");
require("./String.js");

_G.logd = console.log;

_G.isNull = function(o) {
    return o === undefined || o === null;
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
    return typeof(o) == "object" && o !== null && !(o instanceof Array);
};

Object.defineProperties(Object.prototype, {
    "setClass": {
        configurable: false,
        enumerable: false,
        writable: true,
        //__proto__: null,
        value: function(o) {
            if (typeof(o) != "object" && typeof(o) != "function") {
                throw "E: invalid argument [" + o + "]: expect null/Object/Function";
            }
            if (isCallable(o)) {
                o = o.prototype;
            }
            this.__proto__ = o;
        }
    }
});

Object.defineProperties(Function.prototype, {
    "setClass": {
        configurable: false,
        enumerable: false,
        writable: true,
        //__proto__: null,
        value: function(o) {
            if (typeof(o) != "object" && typeof(o) != "function") {
                throw "E: invalid argument [" + o + "]: expect null/Object/Function";
            }
            if (isCallable(o)) {
                o = o.prototype;
            }
            this.prototype.__proto__ = o;
        }
    }
});

// 一些语言特性
// function A() {}
// var a = new A();
// assert a.__proto__ == A.prototype;
