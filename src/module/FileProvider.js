"use strict";

var fs = require("fs");
var iconv = require("iconv-lite");
var zlib = require("zlib");

var TOP = ".."
var Mime = require(TOP + "/module/Mime.js");
var Path = require(TOP + "/module/Path.js");

function sendFile(context, fp, mimeType) {
    console.log("about to send [" + fp + "]");
    if (!fp) {
        console.log("invalid call");
        context.reply(404);
        return;
    }

    try {
        var stats = fs.statSync(fp);
        if (!stats.isFile()) {
            throw new Error("not a file");
        }
    } catch(err) {
        console.log("file status error: " + err.message);
        context.reply(404);
        return;
    }

    var ack = context.orig.ack;

    var lastModified = stats.mtime.toUTCString();
    ack.setHeader("last-modified", lastModified);
    if (context.getReqHeader("if-modified-since") === lastModified) {
        // cached
        context.reply(304);
        return;
    }

    if (/bytes=(.+)/.test(context.getReqHeader("range") || "")) {
        context.current.aRange = Util.parseRange(RegExp.$1, stats.size);
        if (!context.current.aRange) {
            // 416: Requested Range Not Satisfiable
            context.reply(416);
            return;
        }
    }

    // content-type defaults to "text/html"
    // if the content cannot be parsed as text, the browser will save content to file
    mimeType = mimeType || Mime.getMimeTypeByPath(fp) || "text/html";

    var ack = context.orig.ack;
    ack.setHeader('accept-ranges', 'bytes');

    var fn = iconv.encode(Path.basename(fp), "iso8859-1");
    if (context.getReqHeader("accept-attachment")) {
        ack.setHeader("content-disposition", "attachment;filename=" + fn);
        ack.setHeader("content-type", "application/octet-stream");
    } else {
        ack.setHeader("content-disposition", "inline;filename=" + fn);
        ack.setHeader("content-type", mimeType + ";charset=utf8");
    }

    context.current.allowsCompressing =
            /^text/.test(mimeType) && !context.current.aRange;
    if (!context.current.allowsCompressing) {
        if (context.current.aRange) {
            ack.setHeader("content-range",
                    "bytes " + aRange[0] + "-" + aRange[1] + "/" + stats.size);
            ack.setHeader("content-length", aRange[1] - aRange[0] + 1);
        } else {
            ack.setHeader("content-length", stats.size);
        }
    }
    if (context.current.aRange) {
        ack.statusCode = 206;
        var stream = fs.createReadStream(fp, {
            "start": aRange[0],
            "end": aRange[1]
        });
    } else {
        ack.statusCode = 200;
        var stream = fs.createReadStream(fp);
    }
    if (context.current.allowsCompressing) {
        var sEncodings = context.getReqHeader("accept-encoding") || "";
        /\b(gzip|deflate)\b/.test(sEncodings);
        switch (RegExp.$1) {
            case "deflate":
                ack.setHeader("content-encoding", "deflate");
                stream = stream.pipe(zlib.createDeflate());
                break;
            case "gzip":
                ack.setHeader("content-encoding", "gzip");
                stream = stream.pipe(zlib.createGzip());
                break;
            default:
                break;
        }
    }
    stream.pipe(ack);
}

var simpleFile = function(context, fp, mimeType) {
    var ack = context.orig.ack;
    fs.readFile(fp, function(error, data) {
        if (error) {
            console.log("file status error: " + JSON.stringify(error) + "\n");
            context.reply(404);
            return;
        }

        ack.writeHead(200, {
            "content-type": mimeType || Mime.getMimeTypeByPath(fp) || "application/octet-stream",
        });
        ack.write(data);
        ack.end();
    });
};

module.exports = {
    "sendFile" : sendFile,
    "simpleFile" : simpleFile,
};
