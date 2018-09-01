"use strict";

// ---------------------------------------------------------

var Session = newClass(Object.prototype, function(sessionId) {
    this.merge({
        _id: sessionId || null,
        _timeout: 0,
        _ctime: +new Date(),
        _valueStore: Store.create()
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
    return this._valueStore.get(key);
};

Session.put = function(key, value) {
    return this._valueStore.put(key, value);
};

Session.remove = function(key) {
    return this._valueStore.remove(key);
};

Session.removeAll = function() {
    Cmap.clear(this._valueStore);
};

// ---------------------------------------------------------

var SessionManager = newClass(Object.prototype, function(timeout) {
    return {
        _sessionTimeout: timeout,
        _sessionStore: Store.create()
    };
});

SessionManager.updateSession = function(sessionId) {
    var session = null;
    if (!sessionId) {
        // create operation
        sessionId = +new Date() + "-" + Math.random() * 1000;
        session = Session.create(sessionId);
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
    return this._sessionStore.get(sessionId);
};

SessionManager.putSession = function(session) {
    this._sessionStore.put(session.getId(), session);
};

SessionManager.removeSession = function(sessionId) {
    delete this._sessionStore.remove(sessionId);
};
