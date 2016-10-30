"use strict";

var srcPath = "../";
var Path = require(srcPath + "model/Path.js");
var Query = require(srcPath + "model/Query.js");

// to parse uri(mostly url) into an object and reverse
// sample uriString like: scheme://user:pass@host:port/path?query#fragment
// and like: mailto:abc@def.ghi
// may have field(s): source, scheme, ssp, user, pass, host, port, path, query, fragment
// see http://docs.oracle.com/javase/1.5.0/docs/api/java/net/URI.html
var Uri = function() {
}

Uri.prototype.getSource = function() {
    return this.source;
}

Uri.prototype.getScheme = function() {
    return this.scheme;
}

Uri.prototype.getUserinfo = function() {
    return {
        user: this.user,
        pass: this.pass
    };
}

Uri.prototype.getHost = function() {
    return {
        host: this.host,
        port: this.port
    };
}

Uri.prototype.getQuery = function() {
    return this.query;
}

Uri.prototype.getFragment = function() {
    return this.fragment;
}

Uri.prototype.getAuthority = function() {
    var s = "";
    if (this.user) {
        s += this.user;
        if (this.pass) {
            s += ":" + this.pass;
        }
        s += "@";
    }
    if (this.host) {
        s += host;
    }
    if (this.port) {
        s += ":" + this.port;
    }
    return s;
};

Uri.prototype.setQuery = function(query) {
    if (query instanceof Query) {
        this.query = query;
    } else {
        throw new Error("cannot set query to an non-Query object");
    }
}

// see toString()
Uri.prototype.fromString = function(uriString) {
    this.clear();
    this.valid = true;
    this.source = uriString;
    // test: "scheme://user:pass@host:port/path?query#fragment"
    var a = uriString.match("^\\s*(([0-9a-z]+?):)?(.*?)(#(.*?))?\\s*$");
    this.scheme = a[2];
    var ssp = a[3];
    this.fragment = a[5];

    if (!ssp) {
        this.valid = false;
        return this;
    }

    if (!this.isAbsolute()) {
        this.path = ssp;
        return this;
    }

    // test: "//user:pass@host:port/path?query"
    // test: "///usr/local/bin/aaa"
    // test: "comp.lang.javascript"
    // test: "../../a/b/c/d"
    if (ssp.startsWith("/")) {
        a = ssp.match("^(//(.*?))?(/.*?)?(\\?(.*))?$");
        var authority = a[2];
        this.path = a[3];
        var queryString = a[5];
        if (authority) {
            // test: "user:pass@host:7749"
            a = authority.match("^((.*?)@)?(.+?)(:(\\d+))?$");
            var userinfoString = a[2];
            this.host = a[3];
            this.port = parseInt(a[5]); // note it is int
            if (!this.host) {
                this.valid = false;
                return this;
            }
            if (userinfoString) {
                // test: "user:pass"
                a = userinfoString.match("^(.*?)(:(.*))?$");
                this.user = a[1];
                this.pass = a[3];
            }
        }
        if (queryString) {
            this.query = Query.fromString(queryString, "&", "=");
        }
    } else {
        this.ssp = ssp;
    }

    return this;
};

// should be overridden to compose a specific scheme
// e.g. http scheme and mailto scheme is different
Uri.prototype.toString = function() {
    var s = "";
    if (this.scheme) {
        s += this.scheme + ":"
    }
    var authority = this.getAuthority();
    if (authority) {
        s += "//" + authority;
    }
    if (this.path) {
        s += this.path;
    }
    if (this.query) {
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

Uri.prototype.isOpaque = function() {
    return this.isAbsolute()
        && (typeof this.ssp !== "string" || !this.ssp.startsWith("/"));
};

Uri.prototype.isHierarchical = function() {
    return !this.isAbsolute() || typeof this.ssp !== "string";
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
        // TODO find out the requirement
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

module.exports = {
    parse: function(uriString) {
        return new Uri().fromString(uriString);
    }
};
