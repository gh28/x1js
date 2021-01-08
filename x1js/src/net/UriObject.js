"use strict";

// rfc3986
// to parse uri(mostly url) into an object and reverse
// see http://docs.oracle.com/javase/1.5.0/docs/api/java/net/URI.html

const UriObject = (function() {

    var Uri = newProto(null, function() {
        this.source = undefined;
        this.scheme = undefined;
        this.schemeSpecificPart = undefined;
        this.fragment = undefined;
    });

    Uri.isAbsolute = function() {
        return !!this.scheme;
    };

    Uri.isRelative = function() {
        return !this.isAbsolute();
    };

    // Opaque Uri is not subject to further parsing
    // mailto:java-net@java.sun.com
    // news:comp.lang.java
    // urn:isbn:096139210x
    Uri.isOpaque = function() {
        return this.isAbsolute() && !this.schemeSpecificPart.startsWith("/");
    };

    Uri.isHierarchical = function() {
        return !this.isOpaque();
    };

    // should be overridden to compose a specific scheme
    // e.g. http/mailto is different
    Uri.toString = function() {
        var caller = this;
        var s = "";
        if (caller.scheme) {
            s += caller.scheme + ":"
        }

        var au = "";
        if (caller.user) {
            au += caller.user;
            if (caller.pass) {
                au += ":" + caller.pass;
            }
            au += "@";
        }
        if (caller.host) {
            au += host;
        }
        if (caller.port) {
            au += ":" + caller.port;
        }
        if (au) {
            s += "//" + au;
        }

        if (caller.path) {
            s += caller.path;
        }
        if (!caller.query.isEmpty()) {
            s += "?" + caller.query.toString("=", "&");
        }
        if (caller.fragment) {
            s += "#" + caller.fragment;
        }
        return s;
    };

    Uri.fromString = function(uriString) {
        var uri = Uri.malloc();
        uri.source = uriString;
        // test: [scheme:]scheme-specific-part[#fragment]
        var captured = uriString.match("^"
                + "(" + "([0-9a-z_-]+?)" + ":" + ")?" // 2:scheme
                + "([^#]+)" // 3:schemeSpecificPart
                + "(" + "#" + "(.*)" + ")?" // 5:fragment
                + "$");
        uri.scheme = captured[2];
        uri.schemeSpecificPart = captured[3];
        uri.fragment = captured[5];
        parseSchemeSpecificPart(uri);
        return uri;
    }
    Uri.parse = Uri.fromString;
    Uri.deserialize = Uri.fromString;

    function parseSchemeSpecificPart(uri) {
        if (uri.schemeSpecificPart) {
            // test: [//authority][path][?query]
            var captured = uri.schemeSpecificPart.match("^"
                    + "(" + "//" + "([^/]*)" + ")?" // 2:authority
                    + "(" + "/.*?" + ")?" // 3:path
                    + "(" + "\\?" + "(.*)" + ")?" // 5:query
                    + "$");
            uri.authority = captured[2];
            uri.path = captured[3];
            uri.query = captured[5];
        }

        if (uri.authority) {
            // test: [user-info@]host[:port]
            var captured = uri.authority.match("^"
                    + "(" + "(.*?)" + "@" + ")?" // 2:userinfo
                    + "([^:]+)" // 3:host
                    + "(" + ":(\\d+)" + ")?" // 5:port
                    + "$");
            uri.userinfo = captured[2];
            uri.host = captured[3];
            uri.port = captured[5];
        }

        if (uri.userinfo) {
            var captured = uri.userinfo.match("^"
                    + "(.*?)"
                    + "(" + ":" + "(.*)" + ")?"
                    + "$");
            uri.user = captured[1];
            uri.pass = captured[3];
        }

        uri.query = Mappin.fromOneLine.call({}, uri.query || "", "&", "=");

        // test: "//user:pass@host:port/path?query"
        // test: "///usr/local/bin/aaa"
        // test: "comp.lang.javascript"
        // test: "../../a/b/c/d"
    }

    return Uri;
})();
