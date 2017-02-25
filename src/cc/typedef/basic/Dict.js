"use strict";

const Dict = function() {
};

Dict.prototype.clear = function() {
    for (var k in this) {
        if (this.hasOwnProperty(k)) {
            delete this[k];
        }
    }
}

Dict.prototype.union = function(o) {
    var t = new Dict();
    return t.merge(this).merge(o);
};

Dict.prototype.intersect = function(o) {
    var t = new Dict();
    for (var i in this) {
        if (this.hasOwnProperty(i) && o.hasOwnProperty(i)) {
            t[i] = this[i];
        }
    }
    return t;
};

// A \ B = A union B remove B
Dict.prototype.complement = function(o) {
    var t = new Dict();
    for (var i in this) {
        if (this.hasOwnProperty(i) && !o.hasOwnProperty(i)) {
            t[i] = this[i];
        }
    }
    return t;
};

Dict.prototype.byOneLine = function(s, spMajor, spMinor) {
    if (typeof s !== "string") {
        throw new Error("E: invalid: " + s);
    }
    spMajor = spMajor || "&";
    spMinor = spMinor || "=";
    this.clear();
    var a = s.split(spMajor);
    for (var i = 0; i < a.length; ++i) {
        var pair = a[i].split(spMinor);
        var k = pair[0];
        var v = pair[1];
        if (k) {
            this[k] = (v || "1");
        }
    }
    return this;
};

Dict.prototype.toOneLine = function(spMajor, spMinor) {
    spMajor = spMajor || "&";
    spMinor = spMinor || "=";
    var a = [];
    for (var k in this) {
        var v = this[k];
        if (v) {
            a.push(k + spMinor + v);
        }
    }
    return a.join(spMajor);
};

Dict.byOneLine = function(s, spMajor, spMinor) {
    var o = new Dict();
    o.byOneLine(s, spMajor, spMinor);
    return o;
};

if (isServerSide) {
    module.exports = Dict;
}
