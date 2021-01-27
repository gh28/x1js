"use strict";

const fs = require("fs");
const iconv = require("iconv-lite");
const zlib = require("zlib");

const File = loadjs("fenc.File");
const Path = loadjs("fenc.Path");
const MimeType = loadjs("net.MimeType");

const Util = loadjs("net.Util");

const Responder = function() {
};

Responder.pushHeader = function(statusCode, headers) {
    const stream = this;
    stream.writeHead(statusCode, headers);
    console.log("  " + statusCode + " sent");
};

Responder.push = function(etc) {
    const stream = this;
    for (var i = 0; i < arguments.length; ++i) {
        stream.write(arguments[i]);
    }
};

Responder.finish = function() {
    const stream = this;
    stream.end();
};

Responder.send = function(context, statusCode, mimeType, etc) {
    const stream = context.ack;

    if (mimeType) {
        Responder.pushHeader.call(stream, statusCode, {
            "content-type": mimeType || "application/octet-stream",
        });
    } else {
        Responder.pushHeader.call(stream, statusCode);
    }

    if (statusCode == 404) {
        Responder.push.call(stream, "\"You know a server is working by seeing this.\"");
    } else {
        for (var i = 3; i < arguments.length; ++i) {
            Responder.push.call(stream, arguments[i]);
        }
    }

    Responder.finish.call(stream);
};

/**
 * read file content and send via file stream
 */
Responder.sendFile = function(context, path, mimeType) {
    var meta = null;
    try {
        meta = File.getMeta(path);
    } catch (e) {
        console.log(e.message);
        Responder.send(context, 404);
        return;
    }
    if (!meta.isFile()) {
        console.log("E: not a regular file");
        Responder.send(context, 404);
        return;
    }

    var headers = {};

    var lastModified = meta.mtime.toUTCString();
    if (lastModified.equals(context.getReqHeader("if-modified-since"))) {
        // 304 Not Modified
        Responder.send(context, 304);
        return;
    }
    headers["last-modified"] = lastModified;

    if (/bytes=(.+)/.test(context.getReqHeader("range"))) {
        context.current.aRange = Util.parseRange(RegExp.$1, meta.size);
        if (!context.current.aRange) {
            // 416 Requested Range Not Satisfiable
            Responder.send(context, 416);
            return;
        }
    }

    // content-type defaults to "text/plain"
    // if the content cannot be parsed as text, the browser will save content to file
    mimeType = mimeType || MimeType.getMimeTypeByPath(path) || "text/plain";
    console.log("about to send [" + path + "] as [" + mimeType + "]" );

    headers["accept-ranges"] = "bytes";

    var fn = iconv.encode(Path.basename(path), "iso8859-1");
    if (context.getReqHeader("accept-attachment")) {
        headers["content-disposition"] = "attachment;filename=" + fn;
        headers["content-type"] = "application/octet-stream";
    } else {
        headers["content-disposition"] = "inline;filename=" + fn;
        headers["content-type"] = mimeType + ";charset=utf8";
    }

    context.current.allowsCompressing =
            /^text/.test(mimeType) && !context.current.aRange;
    if (!context.current.allowsCompressing) {
        if (context.current.aRange) {
            headers["content-range"] =
                    "bytes " + aRange[0] + "-" + aRange[1] + "/" + meta.size;
            headers["content-length"] = aRange[1] - aRange[0] + 1;
        } else {
            headers["content-length"] = meta.size;
        }
    }
    var statusCode;
    if (context.current.aRange) {
        statusCode = 206;
        var stream = fs.createReadStream(path, {
            "start": aRange[0],
            "end": aRange[1]
        });
    } else {
        statusCode = 200;
        var stream = fs.createReadStream(path);
    }
    if (context.current.allowsCompressing) {
        var sEncodings = context.getReqHeader("accept-encoding") || "";
        /\b(gzip|deflate)\b/.test(sEncodings);
        switch (RegExp.$1) {
            case "deflate":
                headers["content-encoding"] = "deflate";
                stream = stream.pipe(zlib.createDeflate());
                break;
            case "gzip":
                headers["content-encoding"] = "gzip";
                stream = stream.pipe(zlib.createGzip());
                break;
            default:
                break;
        }
    }
    Responder.pushHeader.call(context.ack, statusCode, headers);
    stream.pipe(context.ack);
};

module.exports = Responder;
