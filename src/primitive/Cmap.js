const Cmap = createClass(Object.proto, null);

Cmap.clear = function() {
    var o = this;
    for (var k in o) {
        if (o.hasOwn()) {
            delete o[k];
        }
    }
};

Cmap.copy = function() {
    var p = this;
    var q = Object.create(p.getProto());
    for (var k in p) {
        if (p.hasOwn(k)) {
            q[k] = p[k];
        }
    }
    return q;
};

Cmap.deepCopy = function() {
    var p = this;
    var q = Object.create(p.getProto());
    for (var k in p) {
        if (p.hasOwn(k)) {
            if (isObject(p[k])) {
                q[k] = arguments.callee.call(p[k]);
            } else {
                q[k] = p[k];
            }
        }
    }
    return q;
};

Cmap.static.fromOneLine = function(s, majorSeparator, minorSeparator) {
    assert(isString(s), "E: invalid argument [" + s + "]");
    majorSeparator = majorSeparator || "&";
    minorSeparator = minorSeparator || "=";
    var o = {};
    var a = s.split(majorSeparator);
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split(minorSeparator);
        if (p[0]) {
            o[p[0]] = (p[1] || "1");
        }
    }
    return o;
};

// FIXME encode values
Cmap.toOneLine = function(majorSeparator, minorSeparator) {
    majorSeparator = majorSeparator || "&";
    minorSeparator = minorSeparator || "=";
    var o = this;
    var a = [];
    for (var k in o) {
        if (o.hasOwn(k) && !isVoid(o[k])) {
            a.push(k + minorSeparator + o[k]);
        }
    }
    return a.join(majorSeparator);
};

// ---- as an entry set ----

// A \ B = A union B remove B
Cmap.toComplement = function(q) {
    var p = this;
    var o = {};
    for (var k in p) {
        if (p.hasOwn(p) && !q.hasOwn(k)) {
            o[k] = p[k];
        }
    }
    return o;
};

Cmap.toIntersection = function(q) {
    var p = this;
    var o = {};
    for (var k in p) {
        if (p.hasOwn(k) && q.hasOwn(k)) {
            o[k] = p[k];
        }
    }
    return o;
};
