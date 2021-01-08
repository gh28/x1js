"use strict";

// Cookie the constructor
const Cookie = function() {
    this.key = null;
    this.value = null;
    this.domain = null;
    this.path = null;
    this.timeout = 0;
    this.isSecure = false;
    this.isHttpOnly = false;
};

Cookie.prototype.setKeyValue = function(key, value) {
    this.key = key;
    this.value = value;
    return this;
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
Cookie.prototype.toString = function() {
    if (!this._key || !this._value) {
        return;
    }

    var s = "";
    s += (this._key + "=" + this._value) + ";";
    if (this._domain) {
        s += "domain=" + this._domain + ";";
    }
    if (this._path) {
        s += "path=" + this._path + ";";
    }
    if (typeof this._timeout === "number") {
        s += "max-age=" + this._timeout + ";";
        var t = +new Date() + this._timeout;
        s += "expires=" + new Date(t).toUTCString() + ";";
    }
    if (this._isSecure) {
        s += "secure;";
    }
    if (this._isHttpOnly) {
        s += "httponly;";
    }
    return s;
};

Cookie.prototype.toHttpResponseHeader = function() {
    return "Set-Cookie: " + this.toString();
};
