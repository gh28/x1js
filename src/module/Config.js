"use strict";

const File = importjs("cc.typedef.io.File");
const Path = importjs("cc.typedef.io.Path");

const DEFAULT_CONFIG_PATH = "./config.json";
const DEFAULT_CONFIG = {
    "path": {
        "asset": "asset",
        "webpage": "asset/page",
        "webroot": "asset/webroot"
    },
    "port": 8090
};

function Config() {
}

Config.load = function(path) {
    if (!path || path.isEmpty()) {
        var defaultConfigFile = new File(DEFAULT_CONFIG_PATH);
        if (!defaultConfigFile.exists()) {
            logd("creating config");
            defaultConfigFile.save(JSON.stringify(DEFAULT_CONFIG));
        }
        path = DEFAULT_CONFIG_PATH;
    }
    path = locate(path);
    logd("loading [" + path + "]");
    return require(path);
}

module.exports = Config;
