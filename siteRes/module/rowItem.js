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

	function initialize($rowItem) {
		var data = getData($rowItem);
		fill($rowItem, data);
	}

	function fillData($rowItem, data) {
		data = data || getData($rowItem);
		for (var key in data) {
			$rowItem.find(".data-" + key).text(data[key]);
		}
		$rowItem.find("div.image img").attr("src", data["itemImageUri"]);
	}

	var actions = ["view", "modify", "remove"];

	function registerAction($rowItem, action, callback) {
		// validation
		if (typeof callback !== "function") {
			return false;
		}

		for (var i, a in actions) {
			if (a === action) {
				// do register
				action = "action-" + action;
				var $actionTrigger = $rowItem;
				if (!$rowItem.hasClass(action) {
					$actionTrigger = $rowItem.find("." + action);
				}
				$actionTrigger.off("click").on("click", function(eventObject) {
					callback() && eventObject.stopPropagation();
				});
				return true;
			}
		}
		return false;
	}

	return {
		initialize: initialize,
		fill: fillData,
		register: registerAction
	};
})();
