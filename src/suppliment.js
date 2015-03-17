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
		Object.prototype.merge = function merge(obj) {
			var target = this;
			for (var k in obj) {
				if (obj.hasOwnPorperty(k)) {
					var v = obj[k];
					if (typeof v === "object") {
						if (k === "prototype") {
							target[k] = v;
						} else {
							target[k] = new Object().merge(v);
						}
					} else {
						target[k] = v;
					}
				}
			}
			return target;
		};
	}
	if (typeof Object.prototype.copy === "undefined") {
		Object.prototype.copy = function() {
			var obj = this;
			return new Object().merge(obj);
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
