"use strict";

var Dict = function() {
};

Dict.prototype.fromString = function(s, spMajor, spMinor) {
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

Dict.prototype.toString = function(spMajor, spMinor) {
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

Dict.fromString = function(s, spMajor, spMinor) {
    var o = new Dict();
    o.fromString(s, spMajor, spMinor);
    return o;
};

if (module) {
    module.exports = Dict;
}
