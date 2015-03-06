"use strict";

var ObjectStatic = {
	clear: function(obj) {
		for (var k in obj) {
			if (obj.hasOwnPorperty(k)) {
				delete obj[k];
			}
		}
	},
	copy: function(obj) {
		return ObjectStatic.merge({}, obj);
	},
	merge: function(target, obj) {
		for (var k in obj) {
			if (obj.hasOwnPorperty(k)) {
				var v = obj[k];
				if (typeof v === "object") {
					target[k] = {};
					ObjectStatic.merge(target[k], v);
				} else {
					target[k] = v;
				}
			}
		}
		return target;
	}
}

var QueryPrototype = {
	fromString: function(queryString, sp1, sp2) {
		var query = this;
		ObjectStatic.clear(query);
		var a = queryString.split(sp1);
		for (var i in a) {
			var pair = a[i].split(sp2);
			var k = pair[0];
			var v = pair[1];
			if (k) {
				query[k] = (v || "1");
			}
		}
	},
	toString: function(sp1, sp2) {
		var query = this;
		var a = [];
		for (var k in query) {
			var v = query[k];
			if (v) {
				a.push(k + sp1 + v);
			}
		}
		return a.join(sp2);
	}
};

// to parse uri(mostly url) into an object and reverse
// think this uri: scheme://user:pass@host:port/path?query#frag
// will be parsed to object

var Uri = function() {
	this.source = null; // the source string before parse
	this.scheme = null;
	this.user = null;
	this.pass = null;
	this.host = null;
	this.port = null;
	this.path = null;
	this.query = {}; // object as key-value pair
	this.fragment = null;
}

Uri.prototype.getSource = function() {
	return this.source;
}

Uri.prototype.getScheme = function() {
	return this.scheme;
}

Uri.prototype.getAuth = function() {
	return {
		user: this.user,
		pass: this.pass
	};
}

Uri.prototype.getHost = function() {
	return {
		host: this.host,
		port: this.port
	};
}

Uri.prototype.getQuery = function() {
	return this.query;
}

Uri.prototype.getFragment = function() {
	return this.fragment;
}

Uri.prototype.setQuery = function(query) {
	if (typeof query === "object") {
		this.query = query;
		this.query.prototype = QueryPrototype;
	}
}

Uri.prototype.getAuthority = function() {
	var s = "";
	if (this.user) {
		s += this.user;
		if (this.pass) {
			s += ":" + this.pass;
		}
		s += "@";
	}
	if (this.host) {
		s += host;
	}
	if (this.port) {
		s += ":" + this.port;
	}
	return s;
};

// see toString() TODO
Uri.prototype.fromString = function(queryString) {
};

// should be overridden to compose a specific scheme
// e.g. http scheme and mailto scheme is different
Uri.prototype.toString = function() {
	var s = "";
	if (this.scheme) {
		s += this.scheme + ":"
	}
	var authority = this.getAuthority();
	if (authority) {
		s += "//" + authority;
	}
	if (this.path) {
		s += this.path;
	}
	if (this.query) {
		s += "?" + this.query.toString("=", "&");
	}
	if (this.fragment) {
		s += "#" + this.fragment;
	}
	return s;
};

Uri.prototype.copy = function() {
	return ObjectStatic.merge(new Uri(), this);
};

// TODO
Uri.prototype.relativize = function(combined) {
	var relative = new Uri();
	return relative;
};

// TODO
Uri.prototype.resolve = function(relative) {
	var combined = new Uri();
	return combined;
};

module.exports = {
	parse: function(uriString) {
		return new Uri().fromString(uriString);
	};
};
