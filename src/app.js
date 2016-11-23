#!/usr/bin/env node

"use strict";

var fs = require("fs");

var TOP = ".";
require(TOP + "/supplement.js");
var config = require("./config.json");
var PORT = require("yargs").alias("port", "p").argv.port || config.port;
var Path = require(TOP + "/module/Path.js");

var Context = require(TOP + "/module/Context.js");
var MimeType = require(TOP + "/module/Mime.js");
var Router = require(TOP + "/module/Router.js");
var FileProvider = require(TOP + "/module/FileProvider.js");

var router = new Router();
router.addRule("/resume", function(context) {
    var fp = config.path.webpage + "/resume.html";
    FileProvider.sendFile(context, fp);
    return true;
});
router.addRule("/view", function(context) {
    var fp = config.path.webpage + Path.normalize("/" + decodeURIComponent(
            context.uri.query["fn"] || "demo"));
    FileProvider.sendFile(context, fp);
    return true;
});
router.addRule("/story/*", function(context) {
    // TODO as RESTful api:
    //  CU, idempotent      PUT path/id
    //  C, non-idempotent   POST path
    //  R, idempotent       GET path/id
    //  U, non-idempotent   PATCH path/id
    //  D, idempotent       DELETE path/id
    // query as filter
    // TODO scan and index
    return true;
});
router.addRule("/*", function(context) {
    if (context.orig.req.method === "POST") {
        var chunks = [];
        var length = 0;
        context.orig.req.addListener("data", function(chunk) {
            chunks.push(chunk);
            length += chunk.length;
            console.log("Received data chunk: " + chunk);
        });
        context.orig.req.addListener("end", function() {
            var postedData = new Buffer(length);
            for (var i = 0, p = 0; i < chunks.length; ++i) {
                var chunk = chunks[i];
                chunk.copy(postedData, p);
                p += chunk.length;
            }
            context.current.posted = postedData;
            // TODO next logic
        });
    } else {
        // GET
        var fp = config.path.webroot + Path.normalize(decodeURIComponent(context.uri.path));
        FileProvider.sendFile(context, fp);
        return true;
    }
});

require("http").createServer(function(request, response) {
    request.setEncoding("binary");
    response.setHeader("server", "node.js/v6");
    var context = new Context(request, response);
    router.route(context);
    return;
}).listen(PORT);

console.log("Listening at " + PORT);
