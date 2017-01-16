#!/usr/bin/env node

"use strict";

global["_G"] = global;
_G.assert = require("assert");
_G.logd = console.log;

var getSubHierarchy = (function(dir) {
    if (typeof(dir) === "undefined" || !dir) {
        dir = process.env.PWD;
    }
    var TOP = dir;
    return function(sub) {
        if (typeof(sub) === "undefined" || !sub) {
            return TOP;
        }
        if (sub[0] === '/') {
            return TOP + sub;
        } else {
            return TOP + "/" + sub;
        }
    };
})();

_G.importjs = function(path) {
    assert(path, "E: invalid path [" + path + "]");
    if (path.indexOf(".") != -1) {
        return require(getSubHierarchy(path));
    } else {
        return require(path);
    }
};

_G.importPackage = function(packageName) {
    assert(packageName, "E: invalid package name [" + packageName + "]");
    return importjs("src/" + packageName.split(".").join("/") + ".js");
};

importPackage("cc.typedef.framework.Supplement");

////////

const config = (function() {
    var config = importjs("config.json");
    for (var i in config.path) {
        if (config.path.hasOwnProperty(i)) {
            config.path[i] = getSubHierarchy(config.path[i]);
        }
    }
    config.path.getAsset = function(seg) {
        return Path.join(config.path.asset, seg);
    }
    config.path.getBin = function(seg) {
        return Path.join(config.path.bin, seg);
    }
    config.path.getPage = function(seg) {
        return Path.join(config.path.webpage, seg);
    }
    config.port = require("yargs").alias("port", "p").argv.port || config.port;
    return config;
})();

////////

const fs = require("fs");

const Path = importPackage("cc.typedef.basic.Path");

const Context = importPackage("module.Context");
const Router = importPackage("module.Router");
const FileProvider = importPackage("module.FileProvider");

var router = new Router();
router.addRule("/resume", function(context) {
    var fp = config.path.getPage("resume");
    FileProvider.sendFile(context, fp, "text/html");
    return true;
});
router.addRule("/view", function(context) {
    var fp = config.path.webpage + Path.normalize("/" + decodeURIComponent(
            context.uri.query["fn"] || "demo"));
    FileProvider.sendFile(context, fp, "text/html");
    return true;
});
router.addRule("/story/*", function(context) {
    // TODO as RESTful api:
    //  CU, idempotent      PUT path/id
    //  C, non-idempotent   POST path
    //  R, idempotent       GET path/id
    //  U, non-idempotent   PATCH path/id
    //  D, idempotent       DELETE path/id
    // query as filter
    // TODO scan and index
    return true;
});
router.addRule("/*", function(context) {
    if (context.orig.req.method === "POST") {
        var chunks = [];
        var length = 0;
        context.orig.req.addListener("data", function(chunk) {
            chunks.push(chunk);
            length += chunk.length;
            logd("Received data chunk: " + chunk);
        });
        context.orig.req.addListener("end", function() {
            var postedData = new Buffer(length);
            for (var i = 0, p = 0; i < chunks.length; ++i) {
                var chunk = chunks[i];
                chunk.copy(postedData, p);
                p += chunk.length;
            }
            context.current.posted = postedData;
            // TODO next logic
        });
    } else {
        // GET
        var fp = config.path.webroot + Path.normalize(decodeURIComponent(context.uri.path));
        FileProvider.sendFile(context, fp);
        return true;
    }
});

require("http").createServer(function(request, response) {
    request.setEncoding("binary");
    response.setHeader("server", "node.js/v6");
    var context = new Context(request, response);
    router.route(context);
    return;
}).listen(config.port);

logd("Listening at " + config.port);
