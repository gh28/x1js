"use strict";

Object.defineProperties(String.prototype, {
    "codeAt": {
        "value": String.prototype.codePointAt
    },
    "trim": {
        "value": function() {
            return this.replace(/(^\s*)|(\s*$)/g, "");
        }
    },
    "startsWith": {
        "value": function(s) {
            return this.substring(0, s.length) === s;
        }
    },
    "endsWith": {
        "value": function(s) {
            return this.substring(this.length - s.length) === s;
        }
    }
});

String.compare = function(s) {
    var caller = this;
    if (caller == s)  {
        return 0;
    }
    if (caller == null) {
        return -1;
    }
    if (s == null) {
        return 1;
    }
    return caller < s ? -1 : 1;
}
