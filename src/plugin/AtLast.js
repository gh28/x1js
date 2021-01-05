"use strict";

const Path = importjs("fenc.Path");

const Responder = importjs("net.Responder");

function init(register, locate, pathConfig) {
    register("/*", function(context) {
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
            var fp = pathConfig["webroot"] + Path.normalize(decodeURIComponent(context.uri.path));
            Responder.sendFile(context, fp);
            return true;
        }
    });
}

module.exports = {
    "init": init
};
