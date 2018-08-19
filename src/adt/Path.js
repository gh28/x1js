"use strict";

var Path = createClass(String.prototype, null);

Path.isAbsolute = function() {
    return this._a[0] == "";
};

function path2segs(path) {
    return path.split("/");
};

Path.basename = function() {
    var segs = path2segs(this);
    return segs[segs.length - 1];
};

Path.normalize = function() {
    var segments = path2segs(this);
    switch (segments[0]) {
        case "":
            break;
        case ".":
            break;
        case "..":
            break;
        default:
            segments.unshift(".");
            break;
    }

    for (var i = 1; i < segments.length;) {
        switch (segments[i]) {
            case "":
                // fall through
            case ".":
                segments.splice(i, 1);
                continue;
            case "..":
                switch (segments[i - 1]) {
                    case "":
                        throw "E: invalid argument";
                    case ".":
                        segments.splice(i - 1, 1);
                        continue;
                    case "..":
                        // dummy
                        break;
                    default:
                        segments.splice(i - 1, 2);
                        --i;
                        continue;
                }
                break;
            default:
                break;
        }
        ++i;
    }
    return segments.join("/");
};

Path.relativizeTo = function(to) {
    var dst = path2segs(to);
    var src = path2segs(this);

    var start = 0;
    while (start < dst.length && start < src.length) {
        if (dst[start] != src[start]) {
            break;
        }
        ++start;
    }
    dst.slice(start);
    src.slice(start);

    src.fill("..");
    src.concat(dst);
    return src.join("/");
};

Path.resolve = function() {
    var relatives = Array.prototype.slice.call(arguments);
    for (var i in relatives) {
        if (Path.isAbsolute(relatives[i])) {
            throw "E: invalid argument";
        }
    }
    relatives.unshift(this);
    return relatives.join("/");
};
