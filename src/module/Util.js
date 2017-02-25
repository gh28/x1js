"use strict";

// sRange: "2-8" => [2,8], "2-" => [2,n-1], "-8" => [n-8, n-1]
function parseRange(sRange, size) {
    if (sRange.indexOf(",") != -1) {
        return;
    }

    var aRange = sRange.split("-");
    var b = parseInt(aRange[0], 10);
    var e = parseInt(aRange[1], 10);

    if (!isNaN(b)) {
        if (!isNaN(e)) {
            // dummy
        } else {
            e = size - 1;
        }
    } else {
        if (!isNaN(e)) {
            b = size - e;
            e = size - 1;
        } else {
            // invalid format
            return;
        }
    }

    if (b < 0 || e >= size || b > e) {
        return;
    }
    return [b, e];
}

if (isServerSide) {
    module.exports = {
        parseRange: parseRange
    };
}
