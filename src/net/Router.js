"use strict";

const wildcard = require('wildcard');

const Router = function() {
    this.routeMap = [];
};

function getKey(pattern) {
    return pattern || "/";
}

// function route(context) { ... }
Router.prototype.addRule = function(pattern, handler) {
    var key = getKey(pattern);
    console.log("adding route [" + key + "]");
    this.routeMap.push([key, handler]);
};

Router.prototype.route = function(context) {
    var path = context.uri.path;
    console.log("request received for [" + path + "]");
    for (var i = 0; i < this.routeMap.length; ++i) {
        var pattern = this.routeMap[i][0];
        var handler = this.routeMap[i][1];
        if (pattern instanceof RegExp && path.match(pattern)) {
            console.log("matched regex [" + pattern + "]");
            if (handler.call(handler, context)) {
                return true;
            }
        } else if (isString(pattern) && wildcard(pattern, path)) {
            console.log("matched wildcard [" + pattern + "]");
            if (handler.call(handler, context)) {
                return true;
            }
        }
    }
};

module.exports = Router;
