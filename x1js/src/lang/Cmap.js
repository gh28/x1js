"use strict";

// any function can be any object's "member methods", as long as the object has necessary member variables
// this goal can be achieved via apply/call with implied "this" as the 1st variable

// in javascript, Object is too wide a thing
// let's narrow it down as a dictionary/map/table
_G.Cmap = (function() {

    const Cmap = Object.create(null);

    Cmap.clear = function(o) {
        for (var k in o) {
            if (o.hasOwnProperty(k)) {
                delete o[k];
            }
        }
    };

    Cmap.copy = function(o) {
        var p = Object.create(Object.getPrototypeOf(o));
        for (var k in o) {
            if (o.hasOwnProperty(k)) {
                p[k] = o[k];
            }
        }
        return p;
    };

    Cmap.deepCopy = function(o) {
        var p = Object.create(Object.getPrototypeOf(o));
        for (var k in o) {
            if (o.hasOwnProperty(k)) {
                if (isObject(o[k])) {
                    p[k] = Cmap.deepCopy(o[k]);
                } else {
                    p[k] = o[k];
                }
            }
        }
        return p;
    };

    Cmap.merge = function(o, o1) {
        if (!!o1) {
            for (var k in o1) {
                if (!o.hasOwnProperty(k) && o1.hasOwnProperty(k)) {
                    o[k] = o1[k];
                }
            }
        }
        return o;
    };

    // A \ B = A union B remove B
    Cmap.getComplement = function(o, o1) {
        var result = {};
        for (var k in o) {
            if (o.hasOwnProperty(o) && !o1.hasOwnProperty(k)) {
                result[k] = o[k];
            }
        }
        return result;
    };

    Cmap.getIntersection = function(o, o1) {
        var result = {};
        for (var k in o) {
            if (o.hasOwnProperty(k) && o1.hasOwnProperty(k)) {
                result[k] = o[k];
            }
        }
        return result;
    };

    // FIXME escape values
    Cmap.toString = function(o, majorSeparator, minorSeparator) {
        majorSeparator = majorSeparator || "&";
        minorSeparator = minorSeparator || "=";
        var a = [];
        for (var k in o) {
            if (o.hasOwnProperty(k) && !isVoid(o[k])) {
                a.push(k + minorSeparator + o[k]);
            }
        }
        return a.join(majorSeparator);
    };

    Cmap.fromString = function(s, majorSeparator, minorSeparator) {
        assert(isString(s), "E: invalid argument type [" + typeof(s) + "]");
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
