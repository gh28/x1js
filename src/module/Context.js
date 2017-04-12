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
    return this.req.headers[key] || "";
}

module.exports = Context;
