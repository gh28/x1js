// so it is in nodejs

"use strict";

Object.defineProperties(global, {
    "_G": { "value": global }
});

_G.assert = require("assert");

_G.importjs = function(id) {
    assert(typeof(id) == "string" && id.length > 0, "E: invalid argument");
    var path;
    if (id.indexOf("/") >= 0) {
        // as a file path it must starts with "./" or "/"
        path = id;
    } else if (id.indexOf(".") >= 0) {
        // package
        // assume: working from project root
        // assume: sources in package hierarchy just under "src"
        path = process.env.PWD + "/src/" + id.split(".").join("/") + ".js";
    } else {
        // nodejs platform library
        path = id;
    }
    return require(path);
};

_G.exportjs = function(name, o) {
    var a = name.split(".");
    var scope = _G;
    for (var i in a) {
        if (i != a.length - 1) {
            // iterate scope
            if (typeof(scope[a[i]] === "undefined")) {
                scope[a[i]] = {};
            } else if (typeof(scope[a[i]]) !== "object") {
                throw "E: export: conflict scope";
            }
            scope = scope[a[i]];
        } else {
            // set object
            if (typeof(scope[a[i]] === "undefined")) {
                scope[a[i]] = o;
            } else {
                throw "E: export: conflict var";
            }
        }
    }
};

require("./fixlang.js");
