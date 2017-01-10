"use strict";

var Dict = importPackage("cc.typedef.basic.Dict");
var Uri = importPackage("cc.typedef.net.Uri");

function Context(request, response) {
    this.merge({
        "orig": {
            "req": request,
            "ack": response,
        },
        "uri": Uri.parse(request.url),
        "cookie": Dict.byOneLine(request.headers["cookie"] || "", ";", "="),
        "current": {
        },
    });
}

Context.prototype.getReqHeader = function(key) {
    return this.orig.req.headers[key];
}

Context.prototype.reply = function(statusCode, message) {
    var ack = this.orig.ack;
    ack.writeHead(statusCode);
    if (message) {
        ack.write(message);
    } else if (statusCode == 404) {
        ack.write("\"You know a server is working by seeing this.\"");
    }
    ack.end();
}

if (module) {
    module.exports = Context;
}
