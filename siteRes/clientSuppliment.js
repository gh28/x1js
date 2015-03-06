function isInInternetExplorer() {
	return typeof ActiveXObject != "undefined";
}

function validateXml(text) {
	if (window.ActiveXObject) { // IE
		var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = "false";
		xmlDoc.loadXML(text);

		if (xmlDoc.parseError.errorCode != 0) {
			txt = "Error Code: " + xmlDoc.parseError.errorCode + "\n";
			txt = txt + "Error Reason: " + xmlDoc.parseError.reason;
			txt = txt + "Error Line: " + xmlDoc.parseError.line;
			alert(txt);
		} else {
			alert("No errors found");
		}
	} else if (document.implementation.createDocument) {
		var parser = new DOMParser();
		var xmlDoc = parser.parseFromString(text, "text/xml");

		if (xmlDoc.documentElement.nodeName == "parsererror") {
			alert(xmlDoc.documentElement.childNodes[0].nodeValue);
		} else {
			alert("No errors found");
		}
	} else {
		alert('Your browser cannot handle XML validation');
	}
}

/**
 * xml & dom translator
 */

var XmlDom = (function() {
	var xml2Dom = function(x) {
		if (typeof DOMParser !== "undefined") {
			// firefox
			return (new DOMParser()).parseFromString(x, "application/xml");
		} else if (typeof ActiveXObject !== "undefined") {
			// internet explorer
			var d = new ActiveXObject("MSXML2.DOMDocument");
			d.async = false;
			d.loadXML(x);
			return d;
		} else {
			// safari
			var url = "data:text/xml;charset=utf-8," + encodeURIComponent(x);
			var request = new XMLHttpRequest();
			request.open("GET", url, false);
			request.send(null);
			return request.responseXML;
		}
	};

	var dom2Xml = function(d) {
		if (typeof XMLSerializer != "undefined") {
			return (new XMLSerializer()).serializeToString(d);
		} else if (typeof d.xml != "undefined") {
			// internet explorer
			return d.xml;
		} else {
			throw new Error("XmlDom.dom2Xml: cannot.");
		}
	};

	/**
	 * transform XML to HTML via XSL
	 */
	var transform = function(xmldom, xsldom, htmldom) {
		if (typeof XSLTProcessor != "undefined") {
			var processor = new XSLTProcessor();
			processor.importStylesheet(xsldom);
			var fragment = processor.transformToFragment(xmldom, document);
			htmldom.innerHTML = "";
			htmldom.appendChild(fragment);
		} else if (typeof xmldom.transformNode != "undefined") {
			htmldom.innerHTML = xmldom.transformNode(xsldom);
		}
	};

	return {
		"xml2Dom": xml2Dom,
		"dom2Xml": dom2Xml,
		"transform": transform
	};
})();
