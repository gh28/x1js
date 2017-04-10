"use strict";

const Path = importjs("cc.typedef.io.Path");

const FileProvider = importjs("module.FileProvider");

function init(register, pathPrefix) {
    register(/^\/sentinel$|^\/watchdog$/, function(context) {
        FileProvider.sendFile(context, locate(pathPrefix, "user-agent.html"), "text/html");
        return true;
    });
    register("/view", function(context) {
        if (context.uri.query["q"]) {
            var q = decodeURIComponent(context.uri.query["q"]);
            var qPath = Path.normalize("/" + q).substring(1);
            FileProvider.sendFile(context, locate(pathPrefix, qPath));
        } else {
            FileProvider.sendFile(context, null);
        }
        return true;
    });
}

module.exports = {
    "init": init
}
