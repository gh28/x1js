// so it is in nodejs

"use strict";

Object.defineProperties(global, {
    "_G": { "value": global }
});

require("./fixlang.js");

_G.assert = require("assert");

_G.locate = function() {
    var path = process.env.PWD;
    for (var i in arguments) {
        var seg = arguments[i];
        assert (typeof(seg) == "string");
        if (seg && seg != '/') {
            if (seg[0] == '/') {
                path += seg;
            } else {
                path += '/' + seg;
            }
        }
    }
    return path;
};

_G.importjs = function(qualified) {
    assert(typeof(qualified) == "string" && qualified,
        "E: invalid argument [" + qualified + "]");

    const LOCAL_SRC_DIR = "src";

    var qualifiedName = null;
    var qualifiedPath = null;
    if (qualified.indexOf("/") >= 0) {
        // already qualified path
        qualifiedPath = qualified;
    } else if (qualified.indexOf(".") >= 0) {
        qualifiedName = qualified;
        var hierarchy = qualifiedName.split(".");
        qualifiedPath = locate(LOCAL_SRC_DIR, hierarchy.join("/") + ".js");
        // add "package" to namespace
        var scope = _G;
        for (var i in hierarchy) {
            var seg = hierarchy[i];
            if (i != hierarchy.length - 1) {
                if (typeof(scope[seg]) == "undefined") {
                    scope[seg] = {};
                } else if (typeof(scope[seg]) != "object") {
                    throw new Error("E: conflict package");
                }
                scope = scope[seg];
            } else {
                // TODO assert seg is an identifier
                if (typeof(scope[seg]) == "undefined") {
                    scope[seg] = require(qualifiedPath);
                } else if (! scope[seg] instanceof Object) {
                    throw new Error("E: conflict class");
                }
            }
        }
    } else {
        // nodejs platform library
        qualifiedPath = qualified;
    }
    return require(qualifiedPath);
};
