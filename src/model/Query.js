"use strict";

var Query = function() {
};

Query.prototype.fromString = function(queryString, sp1, sp2) {
	sp1 = sp1 || "&";
	sp2 = sp2 || "=";
	var query = this;
	query.clear();
	var a = queryString.split(sp1);
	for (var i in a) {
		var pair = a[i].split(sp2);
		var k = pair[0];
		var v = pair[1];
		if (k) {
			query[k] = (v || "1");
		}
	}
	return this;
};

Query.prototype.toString = function(sp1, sp2) {
	sp1 = sp1 || "=";
	sp2 = sp2 || "&";
	var query = this;
	var a = [];
	for (var k in query) {
		var v = query[k];
		if (v) {
			a.push(k + sp1 + v);
		}
	}
	return a.join(sp2);
};

// static method
Query.fromString = function(queryString, sp1, sp2) {
	var query = new Query();
	query.fromString(queryString, sp1, sp2);
	return query;
};

module.exports = Query;
