"use strict";

const fs = importjs("fs");

const Path = importjs("cc.typedef.io.Path");

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
        this.stat = fs.statSync(this.path);
        return true;
    }
    return false;
}

File.prototype.load = function() {
    this.loadStat();
    if (this.stat.isFile()) {
        this.buff = fs.readFileSync(this.path);
    }
}

File.exists = function() {
    var caller = this;
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

File.save = function(s) {
    var caller = this;
    fs.writeFileSync(caller.path, s);
};

module.exports = File;
