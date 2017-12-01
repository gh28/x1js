"use strict";

// ---------------------------------------------------------

var Session = createModule(Object.prototype, function(id) {
    return {
        _id: id || null,
        _timeout: 0,
        _ctime: +new Date(),
        _values: Store.static.create()
    };
};

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

var SessionManager = createModule(Object.prototype, function(timeout) {
    return {
        _sessionTimeout = timeout,
        _sessions = Store.static.create();
    };
});

SessionManager.updateSession = function(sessionId) {
    var caller = this;
    var session = null;
    if (!sessionId) {
        // create operation
        sessionId = +new Date() + "-" + Math.random() * 1000;
        session = Session.static.create(sessionId);
        caller.putSession(session);
    } else {
        // update operation
        session = caller.getSession(sessionId);
        if (!session) {
            throw "E: fail to get session [" + sessionId + "]";
        }
    }
    session.setTimeout(caller._sessionTimeout);
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
