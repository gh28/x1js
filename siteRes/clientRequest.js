/*******************************************************************************
 * client request
 */

var clientRequest = (function() {

	var factories = [
		function() { return new XMLHttpRequest(); },
		function() { return new ActiveXObject("MSXML2.XMLHTTP"); },
		function() { return new ActiveXObject("Microsoft.XMLHTTP"); }
	];

	var factory = null;

	function newRequest() {
		if (factory == null) {
			for (var i in factories) {
				try {
					var f = factories[i];
					var request = f();
					if (request != null) {
						factory = f;
						return request;
					}
				} catch (e) {
					continue;
				}
			}
			factory = function() {
				throw new Error("http.newRequest(): cannot.");
			}
		}
		return factory();
	}

	function pullSync(url) {
		var request = newRequest();
		request.open("GET", url, false);
		request.send(null);
		if (request.status == 200) {
			return request.responseText;
		}
	}

	function pushSync(url, text) {
		var request = newRequest();
		request.open("POST", url, false);
		request.send(text);
		return request.status + ":" + request.responseText;
	}

	function pullAsync(url, callback) {
		var request = newRequest();
		request.onreadystatechange = function() {
			if (request.status == 200 && request.readyState == 4) {
				callback(request.responseText);
			}
		};
		request.open("GET", url);
		request.send(null);
	}

	function pushAsync(url, text, callback) {
		var request = HTTP.new_request();
		request.onreadystatechange = function() {
			if (request.readyState == 4) {
				callback(request.status + ":" + request.responseText);
			}
		};
		request.open("POST", url);
		request.send(text);
	}

	return {
		"pull": pullSync,
		"pullAsync": pullAsync,
		"push": pushSync,
		"pushAsync": pushAsync
	};
})();

/**
 * onFail() will be invoked iff ajax itself fails
 */
var ajax = (function() {

	function ajax(methodType, uri, data, onDone, onFail, extraOption) {
		if (!jQuery) {
			throw new Error("cannot work without jQuery");
		}

		var option = {
			"async": true,
			"cache": false,
			"dataType": "json",
			"type": methodType,
			"timeout": 2000,
			"url": uri,
			"data": data || {},
			"success": function(data, textStatus, jqXhr) {
				onDone && onDone(data && data.statusCode, data && data.message, data && data.data);
			},
			"error": function(jqXhr, textStatus, errorThrown) {
				console.log("ajax fails: " + (textStatus || "(null)") + (errorThrown || "(null)"));
				onFail && onFail();
			}
		};

		if (typeof extraOption === "object") {
			// merge
			for (var p in extraOption) {
				if (extraOption.hasOwnProperty(p)) {
					option[p] = extraOption[p];
				}
			}
		}

		jQuery.ajax(option);
	}

	function pullAsync(uri, data, onDone, onFail, extraOption) {
		ajax("GET", uri, data, onDone, onFail, extraOption);
	}

	function pushAsync(uri, data, onDone, onFail, extraOption) {
		ajax("POST", uri, data, onDone, onFail, extraOption);
	}

	return {
		"pull": pullAsync,
		"push": pushAsync,
	}
})();
