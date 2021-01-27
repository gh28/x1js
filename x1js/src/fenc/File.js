"use strict";

const File = (function() {

    var File = newProto(null);

    File.normalize = function(path) {
        return Path.normalize(path);
    };

    if (_G._vm == "nodejs") {
        const fs = require("fs");

        File.getContent = function(path) {
            return fs.readFileSync(path);
        };

        File.getMeta = function(path) {
            return fs.statSync(path);
        };

        File.exists = function(path) {
            if (!path) {
                return false;
            }
            try {
                fs.statSync(path);
                return true;
            } catch (e) {
                if (e.code == "ENOENT") {
                    return false;
                } else {
                    throw e;
                }
            }
        };

        File.save = function(path, content) {
            fs.writeFileSync(path, content);
        };
    }

    return File;
})();

if (_G._vm == "nodejs") {
    module.exports = File;
}
