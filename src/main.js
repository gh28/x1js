#!/usr/bin/env node

"use strict";

require("./cc/typedef/lang/fixNodejs.js");

////////

const config = importjs("module.Config").load();
logd("using config: " + JSON.stringify(config));
config.port = require("yargs").alias("port", "p").argv.port || config.port;

////////

const fs = importjs("fs");

const Path = importjs("cc.typedef.io.Path");

const Context = importjs("module.Context");
const Responder = importjs("module.Responder");
const Router = importjs("module.Router");

var router = new Router();
var register = function(uriPath, handler) {
    router.addRule(uriPath, handler);
};
importjs("plugin.Sentinel").init(register, config.path["asset"]);

{
    var storyDict = {};
    var buffer = require('child_process').execSync(
            "fnHash.sh " + locate(config.path["asset"], "story"));
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
                Responder.send(context, 200, "text/plain", menu);
                return true;
            }
            var filepath = storyDict[key];
            if (filepath) {
                var sketch = fs.readFileSync(locate(config.path["webpage"], "story"));
                var content = require('child_process').execSync(
                    "tx2html.py -f \"" + filepath + "\"");
                Responder.send(context, 200, "text/html",
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
        Responder.sendFile(context, fp);
        return true;
    }
});

require("http").createServer(function(request, response) {
    request.setEncoding("binary");
    response.setHeader("server", "node.js/v6");
    var context = new Context(request, response);
    router.route(context);
    return;
}).listen(config.port);
logd("Listening at " + config.port);
