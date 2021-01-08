"use strict";

// Session the constructor
const Session = function(sessionId, sessionTimeout) {
    this.sessionId = sessionId;
    this.sessionTimeout = sessionTimeout;
    this.touch();
    this.data = {};
};

Session.prototype.getSessionId = function() {
    return this.sessionId;
};

Session.prototype.getSessionTimeout = function() {
    return this.sessionTimeout;
};

Session.prototype.setSessionTimeout = function(sessionTimeout) {
    this.sessionTimeout = sessionTimeout;
};

Session.prototype.isExpired = function() {
    return this.ctime + this.sessionTimeout >= +new Date();
};

Session.prototype.touch = function() {
    this.ctime = +new Date();
};

Session.prototype.getValue = function(key) {
    return this.data[key];
};

Session.prototype.putValue = function(key, value) {
    var old = this.data[key];
    if (typeof value === "undefined") {
        delete this.data[key];
    } else {
        this.data[key] = value;
    }
    return old;
};

Session.prototype.removeAll = function(key) {
    delete this.data;
    this.data = {};
};

Session.prototype.toCookie = function() {
    return new Cookie("sessionId", this.sessionId)
        .setPath("/")
        .setTimeout(this.sessionTimeout);
};
