"use strict";

var Mappin = importjs("cc.typedef.lang.Mappin");
var Uri = importjs("cc.typedef.net.Uri");

function Context(request, response) {
    Mappin.merge.call(this, {
        "orig": {
            "req": request,
            "ack": response,
        },
        "uri": Uri.parse(request.url),
        "cookie": Mappin.byOneLine.call({}, request.headers["cookie"] || "", ";", "="),
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

module.exports = Context;
