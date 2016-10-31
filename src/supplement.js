/**
 * as a supplement to js
 */

"use strict";

NULL = null;
NULS = "";

(function() {
    if (typeof Object.prototype.alignPrototype === "undefined") {
        Object.prototype.alignPrototype = function(o) {
            if (typeof(o) == "object") {
                this.__proto__ = o.__proto__;
                this.constructor = o.constructor;
            }
        }
    }

    if (typeof Object.prototype.clear === "undefined") {
        Object.prototype.clear = function() {
            var obj = this;
            for (var k in obj) {
                if (obj.hasOwnProperty(k)) {
                    delete obj[k];
                }
            }
        };
    }
    if (typeof Object.prototype.merge === "undefined") {
        Object.prototype.merge = function merge(obj, replaces) {
            for (var k in obj) {
                if (obj.hasOwnProperty(k)) {
                    var v = obj[k];
                    if (k === "prototype") {
                        // dummy
                    } else if (typeof this[k] === "undefined" || replaces) {
                        this[k] = v;
                    }
                }
            }
            return this;
        };
    }
    if (typeof Object.prototype.copy === "undefined") {
        Object.prototype.copy = function(isDeepCopy) {
            var target = new Object();
            for (var k in this) {
                if (this.hasOwnProperty(k)) {
                    var v = this[k];
                    if (k === "prototype") {
                        target[k] = v;
                    } else if (typeof v === "object") {
                        target[k] = isDeepCopy ? v.copy(true) : v;
                    } else {
                        target[k] = v;
                    }
                }
            }
            target.alignPrototype(this);
            return target;
        };
    }

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
