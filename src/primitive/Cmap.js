"use strict";

// static class Cmap
const Cmap = (function() {

    const Cmap = Object.create(null);

    Cmap.clear = function(p) {
        for (var k in p) {
            if (p.hasOwnProperty(k)) {
                delete p[k];
            }
        }
    };

    Cmap.copy = function(p) {
        var o = Object.create(Object.getPrototypeOf(p));
        for (var k in p) {
            if (p.hasOwnProperty(k)) {
                o[k] = p[k];
            }
        }
        return o;
    };

    function isObject(o) {
        return Object.prototype.toString.call(o) === "[object Object]";
    }

    Cmap.deepCopy = function(p) {
        var o = Object.create(Object.getPrototypeOf(p));
        for (var k in p) {
            if (p.hasOwnProperty(k)) {
                if (isObject(p[k])) {
                    o[k] = Cmap.deepCopy(p[k]);
                } else {
                    o[k] = p[k];
                }
            }
        }
        return o;
    };

    Cmap.merge = function(p, q) {
        if (!!q) {
            for (var k in q) {
                if (!p.hasOwnProperty(k) && q.hasOwnProperty(k)) {
                    p[k] = q[k];
                }
            }
        }
        return p;
    };

    // A \ B = A union B remove B
    Cmap.getComplement = function(p, q) {
        var result = {};
        for (var k in p) {
            if (p.hasOwnProperty(p) && !q.hasOwnProperty(k)) {
                result[k] = p[k];
            }
        }
        return result;
    };

    Cmap.getIntersection = function(p, q) {
        var result = {};
        for (var k in p) {
            if (p.hasOwnProperty(k) && q.hasOwnProperty(k)) {
                result[k] = p[k];
            }
        }
        return result;
    };

    // FIXME escape values
    Cmap.toString = function(p, majorSeparator, minorSeparator) {
        majorSeparator = majorSeparator || "&";
        minorSeparator = minorSeparator || "=";
        var a = [];
        for (var k in p) {
            if (p.hasOwnProperty(k) && !isVoid(p[k])) {
                a.push(k + minorSeparator + p[k]);
            }
        }
        return a.join(majorSeparator);
    };

    Cmap.fromString = function(s, majorSeparator, minorSeparator) {
        assert(isString(s), "E: invalid argument [" + s + "]");
        majorSeparator = majorSeparator || "&";
        minorSeparator = minorSeparator || "=";
        var o = {};
        var a = s.split(majorSeparator);
        for (var i = 0; i < a.length; ++i) {
            var p = a[i].split(minorSeparator);
            if (p[0]) {
                o[p[0]] = (p[1] || "1");
            }
        }
        return o;
    };

    return Cmap;
})();
