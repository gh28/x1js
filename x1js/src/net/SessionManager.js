"use strict";

// SessionManager the constructor
const SessionManager = function(sessionTimeout) {
    this.sessionTimeout = sessionTimeout || 5 * 60 * 1000;
    this.sessions = {};
};

SessionManager.prototype.createSession = function() {
    var sessionId = +new Date() + "-" + Math.random() * 1000;
    var session = new Session(sessionId, sessionTimeout);
    this.putSession(session);
    return session;
};

SessionManager.prototype.getSession = function(sessionId) {
    return this.sessions[sessionId];
};

SessionManager.prototype.putSession = function(session) {
    var sessionId = session.getSessionId();
    var old = this.getSession(sessionId);
    this.sessions[sessionId] = session;
    return old;
};

SessionManager.prototype.removeSession = function(sessionId) {
    var old = this.getSession(sessionId);
    delete this.sessions[sessionId];
    return old;
};
