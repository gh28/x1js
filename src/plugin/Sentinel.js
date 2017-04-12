"use strict";

const Path = importjs("cc.typedef.io.Path");

const Responder = importjs("module.Responder");

function init(register, pathPrefix) {
    register(/^\/sentinel$|^\/watchdog$/, function(context) {
        Responder.sendFile(context, locate(pathPrefix, "user-agent.html"), "text/html");
        return true;
    });
    register("/view", function(context) {
        if (context.uri.query["q"]) {
            var q = decodeURIComponent(context.uri.query["q"]);
            var qPath = Path.normalize("/" + q).substring(1);
            Responder.sendFile(context, locate(pathPrefix, qPath));
        } else {
            Responder.sendFile(context, null);
        }
        return true;
    });
}

module.exports = {
    "init": init
}
