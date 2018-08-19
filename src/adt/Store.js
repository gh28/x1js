"use strict";

var Store = createClass(Object.prototype, function() {
    this.merge({
        _store: {}
    });
});

Store.get = function(key) {
    return this._store[key] || null;
};

Store.put = function(key, value) {
    var old = this.get(key);
    this._store[key] = value;
    return old;
};

Store.contains = function(key) {
    return !!this.get(key);
};

Store.remove = function(key) {
    var old = this.get(key);
    delete this._store[key];
    return old;
};

Store.clear = function() {
    for (var k in this._store) {
        if (this._store.hasOwn(k)) {
            delete this._store[k];
        }
    }
};
