(function(_G) {

    _G.createModule = function(proto, fnInitInst) {
        var C = createObject(proto);

        Object.defineProperties(C, {
            static: {
                value: isObject(proto) && isObject(proto.static)
                    ? createObject(proto.static)
                    : {},
                configurable: false,
                enumerable: false,
                writable: false
            }
        });

        if (fnInitInst) {
            C.static.create = function() {
                var o = createObject(C).merge(
                    fnInitInst.apply(null, Array.prototype.slice.apply(arguments)));
                o.constructor = arguments.callee;
                return o;
            };

            // make "instanceof" work
            C.static.create.prototype = C;
        }

        return C;
    };

    function isDottyId(id) {
        assert(isString(id));
        var identifierRegex = "[A-Za-z$_][A-Za-z0-9$_]*";
        var regex = "^(" + identifierRegex + "\.)*" + identifierRegex + "$";
        return !!id.match(regex);
    }

    function getNamespace(a, createIfNotExist) {
        var ns = _G;
        for (var i in a) {
            var ai = a[i];
            if (typeof ns[i] === "undefined") {
                if (createIfNotExist) {
                    ns[ai] = {};
                } else {
                    throw "E: name not exist";
                }
            } else if (!isObject(ns[ai])) {
                throw "E: name conflict";
            }
            ns = ns[ai];
        }
        return ns;
    }

    function getOrCreateNamespace(a) {
        return getNamespace(a, true);
    }

    _G.importModule = function(id) {
        assert(isDottyId(id));
        var a = id.split(".");
        var name = a.pop();
        var ns = getNamespace(a);
        if (isObject(ns) && isObject(ns[name])) {
            return ns[name];
        }
        throw "E: name not exist";
    };

    _G.exportModule = function(id, C) {
        assert(isDottyId(id));
        var a = id.split(".");
        var name = a.pop();
        var ns = getOrCreateNamespace(a);
        if (typeof ns[name] === "undefined") {
            ns[name] = C;
        } else {
            throw "E: export: name conflict";
        }
    };

})(_G);
