"use strict";

var Cookie = newClass(Object.prototype, function() {
    this.merge({
        _key: null,
        _value: null,
        _domain: null,
        _path: null,
        _timeout: 0,
        _isSecure: false,
        _isHttpOnly: false
    });
});

Cookie.setKeyValue = function(key, value) {
    this._key = key;
    this._value = value;
    return this;
};

Cookie.setDomain = function(domain) {
    this._domain = domain;
    return this;
};

Cookie.setPath = function(path) {
    this._path = path;
    return this;
};

Cookie.setTimeout = function(timeout) {
    this._timeout = timeout;
    return this;
};

Cookie.setSecure = function(isSecure) {
    this._isSecure = !!isSecure;
    return this;
};

Cookie.setHttpOnly = function(isHttpOnly) {
    this._isHttpOnly = !!isHttpOnly;
    return this;
};

// cookie uses key, value, domain, path, max-age(expires), secure
// "expires" will be ignored if "max-age" presents; it is a session cookie if neither of them set
Cookie.toString = function() {
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
