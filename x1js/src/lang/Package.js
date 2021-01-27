"use strict";

// package system
(function(_G) {

    function isDottedIdentifier(s) {
        var idTokenRegex = "[A-Za-z$_][A-Za-z0-9$_]*";
        var regex = "^(" + idTokenRegex + "\.)*" + idTokenRegex + "$";
        return !!s.match(regex);
    }

    function getPackage(a, createIfNotExist) {
        // a is list
        var ns = _G;
        for (var i in a) {
            var ai = a[i];
            if (typeof ns[ai] === "undefined") {
                if (createIfNotExist) {
                    ns[ai] = {};
                    ns = ns[ai];
                } else {
                    return undefined;
                }
            } else if (isObject(ns[ai])) {
                ns = ns[ai];
            } else {
                throw "E: package name conflict";
            }
        }
        return ns;
    }

    if (_G._vm == "nodejs") {
        function loadjs(pathLike) {
            assert(isString(pathLike) && pathLike.length > 0, "E: invalid argument");
            if (pathLike.indexOf("/") >= 0) {
                // as a file path it must starts with "./" or "/"
                // dummy
            } else if (pathLike.indexOf(".") >= 0) {
                // package
                // assume: working from project root
                pathLike = "./" + pathLike.split(".").join("/") + ".js";
            } else {
                // nodejs platform library e.g. "fs"
                // dummy
            }
            // "require" itself has cache
            return require(pathLike);
        }
        _G.loadjs = loadjs;
    }

    function loadFromFullId(fullId) {
        assert(isDottedIdentifier(fullId));
        var a = fullId.split(".");
        var basename = a.pop();
        var ns = getPackage(a);
        if (!ns) {
            throw "E: no such package";
        } else if (!isProto(ns[basename])) {
            // would sleep and start loading (via filesystem or network) and awake when loading done
            // but there is no such mechanism in js
            throw "E: no such proto";
        } else {
            return ns[basename];
        }
    }
    _G.loadFromFullId = loadFromFullId;

    function saveToFullId(proto, fullId) {
        var a = fullId.split(".");
        var basename = a.pop();
        var ns = getPackage(a, true);
        if (typeof ns[basename] !== "undefined") {
            throw "E: export: name conflict";
        }
        ns[basename] = proto;
    };
    _G.saveToFullId = saveToFullId;
})(_G);
