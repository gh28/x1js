// so it is in nodejs

"use strict";

Object.defineProperties(global, {
    "_G": { "value": global }
});

_G.assert = require("assert");

_G.resolvePath = (function() {
    const TOP = process.env.PWD;
    return function(path) {
        // resolve(TOP, path)
        assert(typeof(path) == "string" && path);
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
};

importjs("cc.typedef.lang.fixlang");
importjs("cc.typedef.lang.Mappin");
importjs("cc.typedef.lang.String");
