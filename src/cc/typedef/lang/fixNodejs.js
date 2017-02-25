// so it is in nodejs

"use strict";

global._G = global;

_G.isServerSide = true;
_G.isClientSide = false;

_G.assert = require("assert");
_G.logd = console.log;

_G.resolvePath = (function() {
    const TOP = process.env.PWD;
    return function(path) {
        // resolve(TOP, path)
        if (typeof(path) != "string" || !path) {
            throw "E: invalid argument [" + path + "]";
        }
        if (path[0] == '/') {
            return TOP + path;
        } else {
            return TOP + "/" + path;
        }
    };
})();

_G.importjs = function(qualified) {
    assert(typeof(qualified) == "string" && qualified,
        "E: invalid argument [" + qualified + "]");
    if (qualified.indexOf("/") >= 0) {
        // already qualified path
        // dummy
    } else if (qualified.indexOf(".") >= 0) {
        // qualified name to qualified path
        qualified = resolvePath("src/" + qualified.split(".").join("/") + ".js");
    } else {
        // nodejs platform library
        // dummy
    }
    return require(qualified);
}

importjs("cc.typedef.lang.fixjs");
