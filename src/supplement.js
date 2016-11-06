"use strict";

var NULL = null;
var NULS = "";

(function() {
    if (typeof Object.prototype.isEmpty == "undefined") {
        Object.prototype.isEmpty = function() {
            for (var k in this) {
                if (this.hasOwnProperty(k)) {
                    return false;
                }
            }
            return true;
        }
    }
    if (typeof Object.prototype.alignPrototype === "undefined") {
        Object.prototype.alignPrototype = function(o) {
            if (typeof(o) == "object") {
                this.__proto__ = o.__proto__;
                this.constructor = o.constructor;
            }
        }
    }
    if (typeof Object.prototype.copy === "undefined") {
        Object.prototype.copy = function(isDeep) {
            var target = {};
            for (var k in this) {
                if (this.hasOwnProperty(k)) {
                    if (isDeep && typeof this[k] === "object" && k !== "prototype") {
                        target[k] = this[k].copy(true);
                    } else {
                        target[k] = this[k];
                    }
                }
            }
            target.alignPrototype(this);
            return target;
        };
    }
    if (typeof Object.prototype.merge === "undefined") {
        Object.prototype.merge = function(o) {
            if (typeof o !== "object") {
                return;
            }
            for (var k in o) {
                if (typeof this[k] === "undefined" && o.hasOwnProperty(k)) {
                    this[k] = o[k];
                }
            }
        };
        return this;
    }
})();

(function() {
    if (typeof String.prototype.trim === "undefined") {
        String.prototype.trim = function() {
            return this.replace(/(^\s*)|(\s*$)/g, "");
        };
    }
    if (typeof String.prototype.startsWith === "undefined") {
        String.prototype.startsWith = function(s) {
            return this.substring(0, s.length) === s;
        };
    }
    if (typeof String.prototype.endsWith === "undefined") {
        String.prototype.endsWith = function(s) {
            return this.substring(this.length - s.length) === s;
        };
    }
})();

var Util = (function() {
    // sRange: "2-8" => [2,8], "2-" => [2,n-1], "-8" => [n-8, n-1]
    function parseRange(sRange, size) {
        if (sRange.indexOf(",") != -1) {
            return;
        }

        var aRange = sRange.split("-");
        var b = parseInt(aRange[0], 10);
        var e = parseInt(aRange[1], 10);

        if (!isNaN(b)) {
            if (!isNaN(e)) {
                // dummy
            } else {
                e = size - 1;
            }
        } else {
            if (!isNaN(e)) {
                b = size - e;
                e = size - 1;
            } else {
                // invalid format
                return;
            }
        }

        if (b < 0 || e >= size || b > e) {
            return;
        }
        return [b, e];
    }
    return {
        "parseRange": parseRange
    };
})();
