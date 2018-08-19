"use strict";

// ---------------------------------------------------------

var Session = createClass(Object.prototype, function(id) {
    this.merge({
        _id: id || null,
        _timeout: 0,
        _ctime: +new Date(),
        _values: Store.static.create()
    });
});

Session.setTimeout = function(timeout) {
    this._timeout = timeout;
};

Session.getId = function() {
    return this._id;
};

Session.isExpired = function() {
    return this._ctime + this._timeout >= +new Date();
};

Session.touch = function() {
    this._ctime = +new Date();
};

Session.get = function(key) {
    return this._values.get(key);
};

Session.put = function(key, value) {
    return this._values.put(key, value);
};

Session.remove = function(key) {
    return this._values.remove(key);
};

Session.removeAll = function() {
    this._values.clear();
};

// ---------------------------------------------------------

var SessionManager = createClass(Object.prototype, function(timeout) {
    return {
        _sessionTimeout: timeout,
        _sessions: Store.static.create()
    };
});

SessionManager.updateSession = function(sessionId) {
    var session = null;
    if (!sessionId) {
        // create operation
        sessionId = +new Date() + "-" + Math.random() * 1000;
        session = Session.static.create(sessionId);
        this.putSession(session);
    } else {
        // update operation
        session = this.getSession(sessionId);
        if (!session) {
            throw "E: fail to get session [" + sessionId + "]";
        }
    }
    session.setTimeout(this._sessionTimeout);
    return session;
};

SessionManager.getSession = function(sessionId) {
    return this._sessions.get(sessionId);
};

SessionManager.putSession = function(session) {
    this._sessions.put(session.getId(), session);
};

SessionManager.removeSession = function(sessionId) {
    delete this._sessions.remove(sessionId);
};
