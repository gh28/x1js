const Cmap = createClass(Object.proto, null);

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
