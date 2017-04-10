// so it is in nodejs

"use strict";

Object.defineProperties(global, {
    "_G": { "value": global }
});

require("./fixlang.js");
const Path = require("../io/Path.js");

_G.assert = require("assert");

_G.locate = function() {
    Array.prototype.unshift.call(arguments, process.env.PWD);
    return Path.resolve.apply(arguments, arguments);
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
