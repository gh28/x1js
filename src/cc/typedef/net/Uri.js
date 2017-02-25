"use strict";

// rfc3986

const Dict = importjs("cc.typedef.basic.Dict");

// to parse uri(mostly url) into an object and reverse
// see http://docs.oracle.com/javase/1.5.0/docs/api/java/net/URI.html
var Uri = function() {
    this.source = undefined;
    this.scheme = undefined;
    this.schemeSpecificPart = undefined;
    this.fragment = undefined;
}

// should be overridden to compose a specific scheme
// e.g. http/mailto is different
Uri.prototype.toString = function() {
    var s = "";
    if (this.scheme) {
        s += this.scheme + ":"
    }

    var au = "";
    if (this.user) {
        au += this.user;
        if (this.pass) {
            au += ":" + this.pass;
        }
        au += "@";
    }
    if (this.host) {
        au += host;
    }
    if (this.port) {
        au += ":" + this.port;
    }
    if (au) {
        s += "//" + au;
    }

    if (this.path) {
        s += this.path;
    }
    if (!this.query.isEmpty()) {
        s += "?" + this.query.toString("=", "&");
    }
    if (this.fragment) {
        s += "#" + this.fragment;
    }
    return s;
};

Uri.prototype.isAbsolute = function() {
    return !!this.scheme;
};

Uri.prototype.isRelative = function() {
    return !this.isAbsolute();
};

// Opaque Uri is not subject to further parsing
// mailto:java-net@java.sun.com
// news:comp.lang.java
// urn:isbn:096139210x
Uri.prototype.isOpaque = function() {
    return this.isAbsolute() && !this.schemeSpecificPart.startsWith("/");
};

Uri.prototype.isHierarchical = function() {
    return !this.isOpaque();
};

Uri.byString = function(uriString) {
    var uri = new Uri();
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
Uri.parse = Uri.byString;

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

    uri.query = Dict.byOneLine(uri.query || "", "&", "=");

    // test: "//user:pass@host:port/path?query"
    // test: "///usr/local/bin/aaa"
    // test: "comp.lang.javascript"
    // test: "../../a/b/c/d"
}

if (module) {
    module.exports = Uri;
}
