"use strict";

const File = importjs("cc.typedef.io.File");
const Uri = importjs("cc.typedef.net.Uri");

function Context(request, response) {
    Mappin.merge.call(this, {
        "req": request,
        "ack": response,
        "uri": Uri.parse(request.url),
        "cookie": Mappin.fromOneLine.call({}, request.headers["cookie"] || "", ";", "="),
        "current": {
        },
    });
};

Context.loadConfig = function(locate, path, priviledgedConfig) {
    // validate path
    if (path === undefined || path === null) {
        // ensure default config existing
        const DEFAULT_CONFIG_PATH = "./config.json";
        path = locate(DEFAULT_CONFIG_PATH);
        logd("about to use default config");
        var file = new File(path);
        if (!file.exists()) {
            logd("fail to find default config, creating");
            const DEFAULT_CONFIG_CONTENT = {
                "path": {
                    "asset": "asset",
                    "webpage": "asset/page",
                    "webroot": "asset/webroot"
                }
            };
            file.save(JSON.stringify(DEFAULT_CONFIG_CONTENT));
        }
    } else {
        path = locate(path);
        var file = new File(path);
        if (!file.exists()) {
            throw "E: fail to find config [" + path + "]";
        }
    }
    logd("loading config [" + path + "]");
    var config = require(path);
    return Mappin.merge.call({}, priviledgedConfig, config);
};

Context.prototype.getReqHeader = function(key) {
    return this.req.headers[key] || "";
};

module.exports = Context;
