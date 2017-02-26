"use strict";

Object.defineProperties(String.prototype, {
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
