var wildcard = require('wildcard')

function Router() {
    this.routeMap = [];
}

function getKey(method, path) {
    return (method && method.toLowerCase() || "get") + ":" + path;
}

// function route(context) { ... }
Router.prototype.addRule = function(method, path, route) {
    var key = getKey(method, path);
    this.routeMap.push([key, route]);
    console.log("route added for [" + key + "]");
}

Router.prototype.route = function(context) {
    var path = context.uri.path;
    console.log("request received for [" + path + "]");
    var key = getKey(context.orig.req.method, path);
    for (var i = 0; i < this.routeMap.length; ++i) {
        if (wildcard(this.routeMap[i][0], key)) {
            var route = this.routeMap[i][1];
            if (typeof route === "function") {
                if (route(context)) {
                    return;
                }
            }
        }
    }
}

if (module) {
    module.exports = Router;
}
