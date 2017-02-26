// design functions that calls with an object, assuming the object has corresponding fields
// I names 'struct-based design'

"use strict";

/**
 *  in javascript, Object is too wide a thing.
 *  let's define Mappin as a narrowed Object, as Json Object, associative array, map, dictionary
 *  Mappin is not a function, not an array, not a string
 */
const Mappin = function() {
};
_G.Mappin = Mappin;

Mappin.clear = function() {
    const caller = this;
    for (var i in caller.ownKeys()) {
        delete caller[i];
    }
};

Mappin.copy = function(isDeepCopy) {
    var caller = this;
    var target = {};
    for (var k in caller) {
        if (caller.hasOwnProperty(k)) {
            if (isDeepCopy && typeof(caller[k]) == "object") {
                target[k] = caller[k].copy(true);
            } else {
                target[k] = caller[k];
            }
        }
    }
    Object.setPrototypeOf(target, caller.prototype || null);
    return target;
};

Mappin.allKeys = function() {
    const caller = this;
    return Object.keys.call(null, caller);
};
Mappin.keys = Mappin.allKeys;

Mappin.ownKeys = function() {
    const caller = this;
    var ownKeys = [];
    var keys = Mappin.allKeys.call(caller);
    for (var i in keys) {
        if (caller.hasOwnProperty(keys[i])) {
            ownKeys.push(keys[i]);
        }
    }
    return ownKeys;
}

Mappin.byOneLine = function(s, spMajor, spMinor) {
    const caller = this;
    if (typeof s != "string") {
        throw "E: invalid argument [" + s + "]";
    }
    spMajor = spMajor || "&";
    spMinor = spMinor || "=";
    var a = s.split(spMajor);
    for (var i = 0; i < a.length; ++i) {
        var pair = a[i].split(spMinor);
        if (pair[0]) {
            caller[pair[0]] = (pair[1] || "1");
        }
    }
    return caller;
};

Mappin.toOneLine = function(spMajor, spMinor) {
    const caller = this;
    spMajor = spMajor || "&";
    spMinor = spMinor || "=";
    var a = [];
    for (var k in caller.ownKeys()) {
        if (caller[k]) {
            a.push(k + spMinor + caller[k]);
        }
    }
    return a.join(spMajor);
};

//// set manipulation/operation

Mappin.merge = function(o) {
    const caller = this;
    for (var k in o) {
        if (!caller.hasOwnProperty(k) && o.hasOwnProperty(k)) {
            caller[k] = o[k];
        }
    }
    return caller;
};

Mappin.unite = function(o) {
    const caller = this;
    var target = {};
    Mappin.merge.call(target, caller);
    Mappin.merge.call(target, o);
    return target;
};

Mappin.intersect = function(o) {
    const caller = this;
    var target = {};
    for (var i in caller) {
        if (caller.hasOwnProperty(i) && o.hasOwnProperty(i)) {
            target[i] = caller[i];
        }
    }
    return target;
};

// A \ B = A union B remove B
Mappin.complement = function(o) {
    const caller = this;
    var target = {};
    for (var i in caller) {
        if (caller.hasOwnProperty(i) && !o.hasOwnProperty(i)) {
            target[i] = caller[i];
        }
    }
    return target;
};
