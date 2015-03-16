"use strict";

function path2segs(path) {
	return path.split("/");
}

function isPathDirectory(path) {
	return path.endsWith("/");
}

function isPathAbsolute(path) {
	return path.startsWith("/");
}

function isPathRelative(path) {
	return !isPathAbsolute(path);
}

function normalize(path) {
	if (typeof path === "string") {
		path = path2segs(path);
	}

	if (typeof path !== "object") {
		throw new Error("invalid argument: " + path);
	}

	var a = path;
	for (var i = 0; i < a.length; ) {
		if (!a[i] || a[i] === ".") {
			a.splice(i, 1);
			continue;
		}
		if (a[i] === "..") {
			if (i > 0) {
				if (a[i - 1] !== "..") {
					a.splice(i - 1, 2);
					--i;
					continue;
				}
			}
		}
		++i;
	}
	return a.join("/");
}

function relativize(base, combined) {
	if (typeof base !== "string"
			|| typeof combined != "string") {
		throw new Error("invalid argument: " + base + ", " combined);
	}

	if (!combined.startsWith("/")) {
		return combined;
	}

	var a = path2segs(normalize(base));
	var b = path2segs(normalize(combined));
	while (a.length > 0 && b.length > 0) {
		var a1 = a.shift();
		var b1 = b.shift();
		if (a1 !== b1) {
			a.unshift(a1);
			b.unshift(b1);
			break;
		}
	}
	var i = a.length();
	while (i--) {
		b.unshift("..");
	}
	return b.join("/");
}

function resolve(base, relative) {
	if (typeof base !== "string"
			|| typeof relative !== "string")) {
		throw new Error("invalid argument: " + base + ", " + relative);
	}

	if (!base || relative.startsWith("/")) {
		return relative;
	}

	if (isPathDirectory(base)) {
		base = base + "/" + relative;
	} else {
		base = base + "/../" + relative;
	}
	return normalize(base);
}

module.exports = {
	normalize: normalize,
	relative: relative,
	resolve: resolve
};
