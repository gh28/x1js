// core javascript

"use strict";

function isNull(o) {
    return typeof(o) == "undefined" || o == null;
}

function isCallable(o) {
    return typeof(o) == "function";
}

function isObject(o) {
    return typeof(o) == "object" || typeof(o) == "function";
}

function isString(o) {
    return typeof(o) == "string";
}

Object.defineProperties(Object, {
    "copy": {
        configurable: false,
        enumerable: false,
        writable: false,
        value: function(self, isDeepCopy) {
            var target = {};
            for (var k in self) {
                if (self.hasOwnProperty(k)) {
                    if (isDeepCopy && isObject(self[k])) {
                        target[k] = self[k].copy(true);
                    } else {
                        target[k] = self[k];
                    }
                }
            }
            Object.setPrototypeOf(target, self.prototype || null);
            return target;
        }
    },
    "extend": {
        configurable: false,
        enumerable: false,
        writable: false,
        //__proto__: null,
        value: function(self, o) {
            if (!isCallable(o)) {
                throw "E: invalid argument [" + o + "]. Expecting a function";
            }
            // set __proto__ and constructor
            Object.setPrototypeOf(self, o.prototype || null);
        }
    },
    "merge": {
        configurable: false,
        enumerable: false,
        writable: false,
        value: function(o1, o2) {
            if (!isObject(o1) || !isObject(o2)) {
                throw "E: invalid argument";
            }
            var target = o1.copy();
            for (var k in o2) {
                if (isNull(self[k]) && o.hasOwnProperty(k)) {
                    target[k] = o[k];
                }
            }
            return target;
        }
    }
});

Object.defineProperties(Object.prototype, {
    "copy": {
        "value": function(isDeepCopy) {
            return Object.copy.call(null, this, isDeepCopy);
        }
    },
    "extend": {
        "value": function(o) {
            Object.extend.call(null, this, o);
        }
    },
    "merge": {
        "value": function(o) {
            if (!isObject(o)) {
                throw "E: invalid argument [" + o + "]. Expecting an object";
            }
            for (var k in o) {
                if (isNull(this[k]) && o.hasOwnProperty(k)) {
                    this[k] = o[k];
                }
            }
            return this;
        }
    },
    "keys": {
        "value": function() {
            return Object.keys.call(null, this);
        }
    }
});

Object.defineProperties(String, {
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
