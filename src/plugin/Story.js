"use strict";

const fs = importjs("fs");

const Path = importjs("cc.typedef.io.Path");

const Responder = importjs("module.Responder");

function init(register, locate, pathConfig) {
    var storyMappin = {};
    var buffer = require('child_process').execSync(
            "fnHash.sh " + locate(pathConfig["asset"], "story/story"));
    var lines = buffer.toString("utf8").split("\n");
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];
        var j = line.indexOf(" ");
        if (j > 0) {
            var key = line.substring(0, j);
            var filepath = line.substring(j + 1);
            storyMappin[key] = filepath;
        }
    }

    register("/story/*", function(context) {
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
                for (var key in storyMappin) {
                    if (storyMappin.hasOwnProperty(key)) {
                        var value = Path.basename(storyMappin[key]);
                        var end = value.lastIndexOf('.');
                        value = value.substring(0, end);
                        menu += key + " " + value + "\n";
                    }
                }
                Responder.send(context, 200, "text/plain", menu);
                return true;
            }
            var filepath = storyMappin[key];
            if (filepath) {
                var sketch = fs.readFileSync(locate(pathConfig["webpage"], "story.skeleton.start.html"));
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

module.exports = {
    "init": init
};
