"use strict";

// facility
(function(_G) {

    _G.isVoid = function(o) {
        return o === undefined || o === null;
    };

    _G.isNumber = function(o) {
        return typeof(o) === "number";
    };

    // it seems "function" means global function while "method" means member method
    // use "callable"
    _G.isCallable = function(o) {
        return typeof(o) === "function";
    };

    _G.isString = function(o) {
        return typeof(o) === "string";
    };

    _G.isList = function(o) {
        // return typeof(o) == "object" && o instanceof Array;
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

    _G.logi = function(message) {
        return console.log(message);
    };
})(_G);
