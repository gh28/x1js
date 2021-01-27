"use strict";

const File = loadjs("fenc.File");
const Uri = loadjs("net.UriObject");

const Context = function(request, response) {
    Cmap.merge(this, {
        "req": request,
        "ack": response,
        "uri": Uri.parse(request.url),
        "cookie": Cmap.fromString(request.headers["cookie"] || "", ";", "="),
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
        logi("about to use default config");
        if (!File.exists(path)) {
            logi("fail to find default config, creating");
            const DEFAULT_CONFIG_CONTENT = {
                "path": {
                    "asset": "asset",
                    "webpage": "asset/page",
                    "webroot": "asset/webroot"
                }
            };
            File.save(path, JSON.stringify(DEFAULT_CONFIG_CONTENT));
        }
    } else {
        path = locate(path);
        if (!File.exists(path)) {
            throw "E: fail to find config [" + path + "]";
        }
    }
    logi("loading config [" + path + "]");
    var config = require(path);
    var result = Cmap.merge({}, priviledgedConfig);
    return Cmap.merge(result, config);
};

Context.prototype.getReqHeader = function(key) {
    return this.req.headers[key] || "";
};

module.exports = Context;
