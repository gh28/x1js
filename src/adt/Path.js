"use strict";

var Path = createModule(String.prototype, null);

Path.isAbsolute = function() {
    return !!this.startsWith("/");
};

function path2segs(path) {
    return path.split("/");
};

Path.basename = function() {
    var segs = path2segs(this);
    return segs[segs.length - 1];
};

Path.join = function() {
    var caller = this;
    for (var i = 0; i < arguments.length; ++i) {
        var seg = arguments[i];
        if (seg) {
            if (seg[0] == '/') {
                caller += seg;
            } else {
                caller += "/" + seg;
            }
        }
    }
    return caller;
};

Path.static.normalize = function(path) {
    var isAbsolute = path.isAbsolute();
    var segs = path2segs(path);
    for (var i = 0; i < segs.length;) {
        if (segs[i].isEmpty() || segs[i].equals(".")) {
            segs.splice(i, 1);
            continue;
        }
        if (segs[i].equals("..")) {
            if (i > 0) {
                if (!segs[i - 1].equals("..")) {
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
    } else {
        segs.unshift(".");
    }
    return segs.join("/");
};

Path.static.relativize = function(base, combined) {
    if (!combined.startsWith("/")) {
        return combined;
    }

    var srcSegs = path2segs(Path.static.normalize(base));
    var dstSegs = path2segs(Path.static.normalize(combined));
    while (srcSegs.length > 0 && dstSegs.length > 0) {
        var a1 = srcSegs.shift();
        var b1 = dstSegs.shift();
        if (!a1.equals(b1)) {
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
};

Path.static.resolve = function(base, relative) {
    var start = 0;
    for (var i = 0; i < arguments.length; ++i) {
        if (!arguments[i].isEmpty()) {
            start = i;
            break;
        }
    }
    for (var i = start + 1; i < arguments.length; ++i) {
        if (arguments[i].startsWith("/")) {
            start = i;
        }
    }

    var combined = arguments[start];
    for (var i = start + 1; i < arguments.length; ++i) {
        var s = arguments[i];
        if (!s.isEmpty()) {
            combined += "/" + s;
        }
    }
    return Path.static.normalize(combined);
};
