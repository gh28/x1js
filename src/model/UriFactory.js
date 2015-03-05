"use strict";

// to parse uri(mostly url) into an object and reverse
// think this uri: http://user:pass@abc.org:80/path?debug=1#anchor
// will be parsed to object

// hash => string
var build = function(h, sepLv1, sepLv2) {
	sepLv1 = sepLv1 || "=";
	sepLv2 = sepLv2 || ";";
	var a = [];
	for (var i in h) {
		if (h[i]) {
			a.push(i + sepLv1 + h[i]);
		}
	}
	return a.join(sepLv2);
};

// string => hash
var parse = function(s, sepLv1, sepLv2) {
	sepLv1 = sepLv1 || "=";
	sepLv2 = sepLv2 || ";";
	var h = {};
	if (typeof s === "object") {
		h = s;
	} else if (typeof s === "string") {
		var a = s.split(sepLv2);
		for (var i in a) {
			var p = a[i].split(sepLv1);
			if (p[0]) {
				h[p[0]] = (p[1] || "1")
			}
		}
	}
	return h;
};

module.exports = {
	build: build,
	parse: parse
};
