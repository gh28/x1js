"use strict";

const MimeType = (function() {

    var ext2mime = {
        "bin":  "application/octet-stream",
        "css":  "text/css",
        "gif":  "image/gif",
        "html": "text/html",
        "ico":  "image/x-icon",
        "jpg":  "image/jpeg",
        "js":   "text/javascript",
        "json": "application/json",
        "pdf":  "application/pdf",
        "png":  "image/png",
        "svg":  "image/svg+xml",
        "swf":  "application/x-shockwave-flash",
        "txt":  "text/plain",
        "wav":  "audio/x-wav",
        "wma":  "audio/x-ms-wma",
        "wmv":  "video/x-ms-wmv",
        "xml":  "text/xml",
    };

    function getMimeTypeByPath(path) {
        var ext = null;
        var i = path.lastIndexOf(".");
        if (i >= 0) {
            ext = path.substring(++i);
        } else {
            // try ext
            ext = path;
        }
        return ext && ext2mime[ext];
    };

    return {
        getMimeTypeByPath: getMimeTypeByPath,
    }
})();
