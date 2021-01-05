"use strict";

const Path = importjs("fenc.Path");

const Responder = importjs("net.Responder");

function init(register, locate, pathConfig) {
    register(/^\/sentinel$|^\/watchdog$/, function(context) {
        Responder.sendFile(context, locate(pathConfig["webpage"], "user-agent.html"), "text/html");
        return true;
    });
    register("/view", function(context) {
        if (context.uri.query["q"]) {
            var q = decodeURIComponent(context.uri.query["q"]);
            var qPath = Path.normalize("/" + q).substring(1);
            Responder.sendFile(context, locate(pathConfig["asset"], qPath));
        } else {
            Responder.sendFile(context, null);
        }
        return true;
    });
}

module.exports = {
    "init": init
};
