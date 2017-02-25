"use strict";

const Path = importjs("cc.typedef.basic.Path");

// a virtual file
var File = function(path) {
    this.clear();
    path = path && Path.normalize(path);
    if (path) {
        this.isFile = true;
        this.path = path;
    }
}

// avoid memory leak
File.prototype.clear = function() {
    this.isFile = false;
    this.path = null;
    this.stat = null;
    this.buff = null;
}

File.prototype.loadStat = function() {
    if (typeof(this.path) === "string" && this.path) {
        const fs = require("fs");
        this.stat = fs.statSync(this.path);
        return true;
    }
    return false;
}

File.prototype.load = function() {
    this.loadStat();
    if (this.stat.isFile()) {
        const fs = require("fs");
        this.buff = fs.readFileSync(this.path);
    }
}

if (module) {
    module.exports = File;
}
