/**
 * to calculate and fill dom with row item data
 */

var Module = Module || {};

Module.RowItem = (function() {
	if (!$ || !jQuery) {
		throw new Error("cannot work without jQuery");
	}

	function getData($rowItem) {
		return $rowItem.find(".data").data();
	}

	function setData($rowItem, data) {
		if (typeof data === "object") {
			$rowItem.find(".data").data(data);
			return true;
		}
		return false;
	}

	function updateView($rowItem, data) {
		data = data || getData($rowItem) || {};
		for (var key in data) {
			$rowItem.find(".data-" + key).text(data[key]);
		}
		$rowItem.find(".image img").attr("src", data["itemImageUri"]);
	}

	function registerAction($rowItem, action, callback) {
		// validation
		if (typeof callback !== "function") {
			return false;
		}

		var ACTIONS = ["view", "modify", "remove"];

		for (var i, a in ACTIONS) {
			if (a === action) {
				// find, do register
				action = "action-" + action;
				var $trigger = $rowItem;
				if (!$rowItem.hasClass(action) {
					$trigger = $rowItem.find("." + action);
				}
				$trigger.off("click").on("click", function(eventObject) {
					callback($(eventObject), getData())
						&& eventObject.stopPropagation();
				});
				return true;
			}
		}
		return false;
	}

	function inject($rowItem) {
		if (typeof $rowItem !== "object") {
			throw new Error("cannot inject into a non-object var");
		}

		$rowItem.getData = function() {
			return getData(this);
		}

		$rowItem.setData = function(data) {
			setData(this, data) && updateView(this);
		}

		$rowItem.registerAction = function(actionId, callback) {
			return registerAction(this, actionId, callback);
		}
	}

	return {
		assimilate: inject,
	};
})();
