"use strict";

_G.Cstring = (function() {

    var Cstring = Object.create(null);

    // Cstring.codePointAt = String.prototype.codePointAt;

    Cstring.toLower = String.prototype.toLowerCase;

    Cstring.toUpper = String.prototype.toUpperCase;

    Cstring.isEmpty = function(s) {
        return s.length === 0;
    };

    Cstring.trim = function(s) {
        return s.replace(/(^\s*)|(\s*$)/g, "");
    };

    Cstring.startsWith = function(s, s1) {
        return s.substring(0, s1.length) === s;
    };

    Cstring.endsWith = function(s, s1) {
        return s.substring(s.length - s1.length) === s;
    };

    Cstring.compare = function(s, s1) {
        if (s === s1)  {
            return 0;
        }
        if (s === undefined || s === null) {
            return -1;
        } else if (s1 === undefined || s1 === null) {
            return 1;
        }
        return s < s1 ? -1 : 1;
    };

    return Cstring;
})();
