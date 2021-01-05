#!/usr/bin/env node

"use strict";

require("./lang/fixNodejs.js");

const Path = importjs("fenc.Path");

const Context = importjs("net.Context");
const Router = importjs("net.Router");

// prepare router
const router = new Router();
(function() {
    function register(uriPath, handler) {
        router.addRule(uriPath, handler);
    };

    function locate() {
        Array.prototype.unshift.call(arguments, process.env.PWD);
        return Path.resolve.apply(null, arguments);
    }

    const config = Context.loadConfig(locate);
    logd("using config: " + JSON.stringify(config));

    for (var i in arguments) {
        var item = arguments[i];
        importjs(item).init(register, locate, config.path);
    }
})(
    "plugin.Sentinel",
    "plugin.Story",
    "plugin.AtLast"
);

const PORT = require("yargs").alias("port", "p").argv.port;
require("http").createServer(function(request, response) {
    request.setEncoding("binary");
    response.setHeader("server", "node.js/v6");
    var context = new Context(request, response);
    router.route(context);
    return;
}).listen(PORT);
logd("Listening at " + PORT);
logd("...");
