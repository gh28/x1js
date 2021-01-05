"use strict";

const Cookie = function(key, value) {
    this.key = key;
    this.value = value;
    this.isSecure = 0;
    this.isHttpOnly = 0;
};

Cookie.prototype.setDomain = function(domain) {
    this.domain = domain;
    return this;
};

Cookie.prototype.setPath = function(path) {
    this.path = path;
    return this;
};

Cookie.prototype.setTimeout = function(timeout) {
    this.timeout = timeout;
    return this;
};

Cookie.prototype.setSecure = function(isSecure) {
    this.isSecure = !!isSecure;
    return this;
};

Cookie.prototype.setHttpOnly = function(isHttpOnly) {
    this.isHttpOnly = !!isHttpOnly;
    return this;
};

// cookie uses key, value, domain, path, max-age(expires), secure
// "expires" will be ignored if "max-age" presents; it is a session cookie if neither of them set
Cookie.prototype.build = function() {
    if (!this.key || !this.value) {
        return;
    }

    var s = "";
    s += this.key + "=" + this.value) + ";";
    if (this.domain) {
        s += "domain=" + this.domain + ";";
    }
    if (this.path) {
        s += "path=" + this.path + ";";
    }
    if (typeof this.timeout === "number") {
        s += "max-age=" + this.timeout + ";";
        var t = +new Date() + this.timeout;
        s += "expires=" + new Date(t).toUTCString() + ";";
    }
    if (this.isSecure) {
        s += "secure;";
    }
    if (this.isHttpOnly) {
        s += "httponly;";
    }
    return s;
};

var cookiesToSet = {};

function setHeaderCookie(response) {
    var s = "";
    for (var k in cookiesToSet) {
        s += cookiesToSet[k];
    }
    response.setHeader("set-cookie", s);
}

Cookie.prototype.addHeaderCookie = function(response) {
    cookiesToSet[this.key] = this.build();
    setHeaderCookie(response);
};

module.exports = Cookie;
