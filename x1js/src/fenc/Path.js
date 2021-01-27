"use strict";

// static
_G.Path = (function() {

    var Path = newProto(null);

    Path.isAbsolute = function(s) {
        return Cstring.startsWith(s, "/");
    };

    Path.join = function(s) {
        var s = arguments[0];
        for (var i = 1; i < arguments.length; ++i) {
            var arg = arguments[i];
            if (arg) {
                if (Path.isAbsolute(arg)) {
                    throw "E: want to join an absolute path?";
                } else {
                    s += "/" + arg;
                }
            }
        }
        return s;
    };

    function path2segs(path) {
        return path.split("/");
    }

    Path.basename = function(s) {
        var segs = path2segs(s);
        return segs[segs.length - 1];
    };

    Path.normalize = function(s) {
        var segments = path2segs(s);
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

    Path.relativizeTo = function(base, combined) {
        if (Path.isAbsolute(base) != Path.isAbsolute(combined)) {
            return combined;
        }

        var src = path2segs(Path.normalize(base));
        var dst = path2segs(Path.normalize(combined));

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

    Path.resolve = function(s) {
        var relatives = Array.prototype.slice.call(arguments);
        for (var i in relatives) {
            if (Path.isAbsolute(relatives[i])) {
                throw "E: invalid argument";
            }
        }
        return relatives.join("/");
    };

    return Path;
})();

if (_G._vm == "nodejs") {
    module.exports = Path;
}
