"use strict";

/**
 * package system
 */
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
                } else {
                    throw "E: package name not exist";
                }
            } else if (isObject(ns[ai])) {
                ns = ns[ai];
            } else {
                throw "E: package name conflict";
            }
        }
        return ns;
    }

    function importProto(id) {
        assert(isDottedIdentifier(id));
        var a = id.split(".");
        var basename = a.pop();
        var ns = getPackage(a);
        if (!isObject(ns)) {
            throw "E: no such package";
        }
        if (!isProto(ns[basename])) {
            // would sleep and start loading (via filesystem or network) and awake when loading done
            // but there is no such mechanism in js
            throw "E: no such proto";
        }
        return ns[basename];
    }
    _G.importProto = importProto;

    function exportProto(id, proto) {
        var a = id.split(".");
        var basename = a.pop();
        var ns = getPackage(a, true);
        if (typeof ns[basename] !== "undefined") {
            throw "E: export: name conflict";
        }
        ns[basename] = proto;
    };
    _G.exportProto = exportProto;
})(_G);
