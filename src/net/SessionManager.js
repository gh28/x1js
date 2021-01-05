"use strict";

// class Session

const Session = function(id, timeout) {
    this.id = id;
    this.timeout = timeout || 5 * 60 * 1000; // 5min
    this.data = {};
    this.touch();
};

Session.prototype.getId = function() {
    return this.id;
};

Session.prototype.get = function(key) {
    return this.data[key];
};

Session.prototype.put = function(key, value) {
    if (typeof value === "undefined") {
        delete this.data[key];
    } else {
        this.data[key] = value;
    }
};

Session.prototype.isExpired = function() {
    return this.ctime + this.timeout >= +new Date();
};

Session.prototype.removeAll = function(key) {
    delete this.data;
    this.data = {};
};

Session.prototype.touch = function() {
    this.ctime = +new Date();
};

// class SessionManager

function generateSessionId() {
    return +new Date() + "-" + Math.random() * 1000;
}

var SessionManager = function(sessionTimeout) {
    this.sessionTimeout = sessionTimeout;
    this.sessions = {};
};

SessionManager.prototype.update = function(response) {
    var sessionId = generateSessionId();
    var session = new Session(sessionId, this.sessionTimeout);
    new Cookie("sessionId", sessionId)
        .setPath("/")
        .setTimeout(this.sessionTimeout)
        .setToHeader(response);
    return session;
};

SessionManager.prototype.get = function(sessionId) {
    return this.sessions[sessionId];
};

SessionManager.prototype.put = function(session) {
    this.sessions[session.getId()] = session;
};

SessionManager.prototype.remove = function(sessionId) {
    delete this.sessions[sessionId];
};

var sessionManager = null;
module.exports = {
    "getInstance": function() {
        if (!sessionManager) {
            sessionManager = new SessionManager(5 * 60 * 1000);
        }
        return sessionManager;
    }
};
