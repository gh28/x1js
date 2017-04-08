// so it is in nodejs

"use strict";

Object.defineProperties(global, {
    "_G": { "value": global }
});

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
}

_G.importjs = function(qualified) {
    assert(typeof(qualified) == "string" && qualified,
        "E: invalid argument [" + qualified + "]");
    if (qualified.indexOf("/") >= 0) {
        // already qualified path
        // dummy
    } else if (qualified.indexOf(".") >= 0) {
        // qualified name to qualified path
        qualified = locate("src", qualified.split(".").join("/") + ".js");
    } else {
        // nodejs platform library
        // dummy
    }
    return require(qualified);
};

importjs("cc.typedef.lang.fixlang");
importjs("cc.typedef.lang.Mappin");
importjs("cc.typedef.lang.String");
