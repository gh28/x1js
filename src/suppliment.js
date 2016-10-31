/**
 * as a suppliment to js, not rely on any lib
 */

NULL = null;
NULS = "";

// additional functionality
(function() {
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
            var target = this;
            for (var k in obj) {
                if (obj.hasOwnProperty(k)) {
                    var v = obj[k];
                    if (k === "prototype") {
                        // dummy
                    } else if (typeof target[k] === "undefined" || replaces) {
                        target[k] = v;
                    }
                }
            }
            return target;
        };
    }
    if (typeof Object.prototype.copy === "undefined") {
        Object.prototype.copy = function(isDeepCopy) {
            var target = new Object();
            var obj = this;
            for (var k in obj) {
                if (obj.hasOwnProperty(k)) {
                    var v = obj[k];
                    if (k === "prototype") {
                        target[k] = v;
                    } else if (typeof v === "object") {
                        target[k] = isDeepCopy ? v.copy(true) : v;
                    } else {
                        target[k] = v;
                    }
                }
            }
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
