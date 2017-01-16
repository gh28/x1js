"use strict";

var Path = {};

Path.isAbsolute = function(path) {
    return path.startsWith("/");
}

Path.isRelative = function(path) {
    return !Path.isAbsolute(path);
}

function path2segs(path) {
    return path.split("/");
}

Path.basename = function(path) {
    var segs = path2segs(path);
    return segs[segs.length - 1];
}

Path.join = function() {
    var path = arguments[0];
    for (var i = 1; i < arguments.length; ++i) {
        var seg = arguments[i];
        if (seg) {
            if (seg[0] == '/') {
                path += seg;
            } else {
                path += "/" + seg;
            }
        }
    }
    return path;
}

Path.normalize = function(path) {
    if (typeof path !== "string") {
        throw new Error("E: invalid argument: " + path);
    }
    var isAbsolute = Path.isAbsolute(path);
    var segs = path2segs(path);
    for (var i = 0; i < segs.length;) {
        if (!segs[i] || segs[i] === ".") {
            segs.splice(i, 1);
            continue;
        }
        if (segs[i] === "..") {
            if (i > 0) {
                if (segs[i - 1] !== "..") {
                    segs.splice(i - 1, 2);
                    --i;
                    continue;
                }
            } else if (isAbsolute) {
                segs.splice(i, 1);
                continue;
            }
        }
        ++i;
    }
    if (isAbsolute) {
        segs.unshift("");
    }
    return segs.join("/");
}

Path.relativize = function(base, combined) {
    if (typeof base !== "string"
            || typeof combined != "string") {
        throw new Error("invalid argument: " + base + ", " + combined);
    }

    if (!combined.startsWith("/")) {
        return combined;
    }

    var srcSegs = path2segs(normalize(base));
    var dstSegs = path2segs(normalize(combined));
    while (srcSegs.length > 0 && dstSegs.length > 0) {
        var a1 = srcSegs.shift();
        var b1 = dstSegs.shift();
        if (a1 !== b1) {
            srcSegs.unshift(a1);
            dstSegs.unshift(b1);
            break;
        }
    }
    var i = srcSegs.length();
    while (i--) {
        dstSegs.unshift("..");
    }
    return dstSegs.join("/");
}

Path.resolve = function(base, relative) {
    if (typeof base !== "string"
            || typeof relative !== "string") {
        throw new Error("invalid argument: " + base + ", " + relative);
    }

    if (!base || relative.startsWith("/")) {
        return relative;
    }

    if (isDirectory(base)) {
        base = base + "/" + relative;
    } else {
        base = base + "/../" + relative;
    }
    return normalize(base);
}

if (module) {
    module.exports = Path;
}
