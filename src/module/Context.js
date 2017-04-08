"use strict";

var Uri = importjs("cc.typedef.net.Uri");

function Context(request, response) {
    Mappin.merge.call(this, {
        "req": request,
        "ack": response,
        "uri": Uri.parse(request.url),
        "cookie": Mappin.fromOneLine.call({}, request.headers["cookie"] || "", ";", "="),
        "current": {
        },
    });
}

Context.prototype.getReqHeader = function(key) {
    return this.req.headers[key];
}

Context.prototype.reply = function(statusCode, message) {
    this.ack.writeHead(statusCode);
    if (message) {
        this.ack.write(message);
    } else if (statusCode == 404) {
        this.ack.write("\"You know a server is working by seeing this.\"");
    }
    this.ack.end();
}

module.exports = Context;
