#!/usr/bin/env node

"use strict";

require("./cc/typedef/lang/fixNodejs.js");

////////

var CONFIG = "./config"

const config = (function() {
    var config = importjs(locate("config.json"));
    for (var i in config.path) {
        if (config.path.hasOwnProperty(i)) {
            config.path[i] = locate(config.path[i]);
        }
    }
    config.path.getAsset = function(seg) {
        return Path.join(config.path.asset, seg);
    }
    config.path.getBin = function(seg) {
        return Path.join(config.path.bin, seg);
    }
    config.path.getPage = function(seg) {
        return Path.join(config.path.webpage, seg);
    }
    config.path.getStory = function(seg) {
        return Path.join(config.path.story, seg);
    }
    config.port = require("yargs").alias("port", "p").argv.port || 8090;
    return config;
})();

////////

const fs = importjs("fs");

const Path = importjs("cc.typedef.basic.Path");

const Context = importjs("module.Context");
const Router = importjs("module.Router");
const FileProvider = importjs("module.FileProvider");

var router = new Router();
router.addRule("/resume", function(context) {
    var fp = config.path.getPage("resume");
    FileProvider.sendFile(context, fp, "text/html");
    return true;
});
router.addRule("/view", function(context) {
    var fp = config.path.webpage + Path.normalize("/" + decodeURIComponent(
            context.uri.query["fn"] || "demo.html"));
    FileProvider.sendFile(context, fp, "text/html");
    return true;
});

{
    var storyDict = {};
    var buffer = require('child_process').execSync(
            "bash " + config.path.getBin("fnHash.sh") + " " + config.path.getStory());
    var lines = buffer.toString("utf8").split("\n");
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];
        var j = line.indexOf(" ");
        if (j > 0) {
            var key = line.substring(0, j);
            var filepath = line.substring(j + 1);
            storyDict[key] = filepath;
        }
    }
    router.addRule("/story/*", function(context) {
        // TODO as RESTful api:
        //  CU, idempotent      PUT path/id
        //  C, non-idempotent   POST path
        //  R, idempotent       GET path/id
        //  U, non-idempotent   PATCH path/id
        //  D, idempotent       DELETE path/id
        // query as filter
        // TODO scan and index
        if (context.uri.path.match("/story/(.*)")) {
            var key = RegExp.$1;
            if (key == "ls") {
                if (context.uri.query.code != "233") {
                    return false;
                }
                var menu = "";
                for (var key in storyDict) {
                    if (storyDict.hasOwnProperty(key)) {
                        var value = Path.basename(storyDict[key]);
                        var end = value.lastIndexOf('.');
                        value = value.substring(0, end);
                        menu += key + " " + value + "\n";
                    }
                }
                FileProvider.sendData(context, "text/plain", menu);
                return true;
            }
            var filepath = storyDict[key];
            if (filepath) {
                var sketch = fs.readFileSync(config.path.getPage("story"));
                var content = require('child_process').execSync(
                    "python " + config.path.getBin("tx2html.py") + " -f \"" + filepath + "\"");
                FileProvider.sendData(context, "text/html",
                    sketch, "<div class=\"content\">", content, "</div></body></html>");
                return true;
            }
        }
        return false;
    });
}

router.addRule("/*", function(context) {
    if (context.req.method === "POST") {
        var chunks = [];
        var length = 0;
        context.req.addListener("data", function(chunk) {
            chunks.push(chunk);
            length += chunk.length;
            logd("Received data chunk: " + chunk);
        });
        context.req.addListener("end", function() {
            var postedData = new Buffer(length);
            for (var i = 0, start = 0; i < chunks.length; ++i) {
                var chunk = chunks[i];
                chunk.copy(postedData, start);
                start += chunk.length;
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

const port = require("yargs").alias("port", "p").argv.port || 8090;
require("http").createServer(function(request, response) {
    request.setEncoding("binary");
    response.setHeader("server", "node.js/v6");
    var context = new Context(request, response);
    router.route(context);
    return;
}).listen(port);
logd("Listening at " + port);
