"use strict";

const Store = (function() {

    var Store = newProto(null, function() {
        this._store = {
            // "key" : value
        };
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
        Cmap.clear(this._store);
    };

    return Store;
})();