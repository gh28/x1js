"use strict";

const fs = importjs("fs");
const Path = importjs("fenc.Path");

// a virtual file
const File = function(path) {
    this.path = path && Path.normalize(path);
};

File.prototype.getContent = function() {
    const caller = this;
    return fs.readFileSync(caller.path);
};

File.prototype.getMeta = function() {
    const caller = this;
    return fs.statSync(caller.path);
};

File.prototype.exists = function() {
    const caller = this;
    try {
        fs.statSync(caller.path);
        return true;
    } catch (e) {
        if (e.code == "ENOENT") {
            return false;
        } else {
            throw e;
        }
    }
};

File.prototype.normalize = function(s) {
    // TODO
    return s;
};

File.prototype.save = function(s) {
    var caller = this;
    fs.writeFileSync(caller.path, s);
};

module.exports = File;
