"use strict";

var srcPath = "../";
var Path = require(srcPath + "model/Path.js");
var Query = require(srcPath + "model/Query.js");

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
    if (this.queried) {
        s += "?" + this.queried.toString("=", "&");
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

Uri.prototype.normalize = function() {
    if (this.isOpaque()) {
        return this;
    }

    var path = Path.normalize(this.path);
    if (path === this.path) {
        return this;
    }

    var normalized = this.copy();
    normalized.path = path;
    return normalized;
};

Uri.prototype.relativize = function(combined) {
    if (!(combined instanceof Uri)) {
        throw new Error("invalid argument: " + combined);
    }

    if (!this.path || !this.path.startsWith("/")
        || !combined.path || !combined.path.startsWith("/")) {
        // TODO figure out the requirement
        return new Uri();
    }

    var relative = new Uri();
    relative.path = Path.relativize(this.path, combined.path);
    relative.fragment = combined.fragment;
    return relative;
};

Uri.prototype.resolve = function(relative) {
    if (!(relative instanceof Uri)) {
        throw new Error("invalid argument: " + relative);
    }

    if (!relative.path || relative.path.startsWith("/")) {
        return relative;
    }

    var combined = this.copy();
    combined.fragment = relative.fragment;
    if (this.isHierarchical()) {
        combined.path = Path.resolve(this.path, relative.path);
    }
    return combined;
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
                + "(" + "(.*?)" + "@" + ")?" // 2:userInfo
                + "([^:]+)" // 3:host
                + "(" + ":(\\d+)" + ")?" // 5:port
                + "$");
        uri.userInfo = captured[2];
        uri.host = captured[3];
        uri.port = captured[5];
    }

    if (uri.userInfo) {
        var captured = uri.userInfo.match("^"
                + "(.*?)"
                + "(" + ":" + "(.*)" + ")?"
                + "$");
        uri.user = captured[1];
        uri.pass = captured[3];
    }

    if (uri.query) {
        uri.queried = Query.fromString(uri.query, "&", "=");
    }

    // test: "//user:pass@host:port/path?query"
    // test: "///usr/local/bin/aaa"
    // test: "comp.lang.javascript"
    // test: "../../a/b/c/d"
}

module.exports = {
    parse: Uri.byString
};
