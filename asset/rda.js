/**
 * remote data accessor
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
			for (var p in extraOption) {
				if (extraOption.hasOwnProperty(p)) {
					option[p] = extraOption[p];
				}
			}
		}

		$.ajax(option);
	}

	function pull(uri, data, onDone, onFail, extraOption) {
		ajax("GET", uri, data, onDone, onFail, extraOption);
	}

	function push(uri, data, onDone, onFail, extraOption) {
		ajax("POST", uri, data, onDone, onFail, extraOption);
	}

	return {
		"pull": pull,
		"push": push,
	}
})();

var rda = (function() {
	var rda = rda;
})();