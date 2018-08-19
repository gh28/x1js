(function(_G) {

    function dummy() {
    }

    _G.createClass = function(proto, instanceInit) {
        if (isVoid(instanceInit)) {
            instanceInit = dummy;
        }
        assert(isFunction(instanceInit));

        var C = Object.create(proto);

        C.setMember("static", isObject(proto) && isObject(proto.static)
                ? Object.create(proto.static)
                : {});

        C.static.create = function() {
            var o = Object.create(C);
            instanceInit.apply(o, Array.prototype.slice.apply(arguments));
            o.constructor = arguments.callee;
            return o;
        };

        // make "instanceof" work
        C.static.create.prototype = C;

        return C;
    };

    function isClass(C) {
        return isObject(C) && isObject(C.static) && isFunction(C.static.create);
    }

    function isDottedIdentifier(id) {
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

    _G.importClass = function(id) {
        assert(isDottedIdentifier(id));
        var a = id.split(".");
        var name = a.pop();
        var ns = getNamespace(a);
        if (!isObject(ns)) {
            throw "E: no such namespace";
        }
        if (!isClass(ns[name])) {
            // would sleep and start loading (via filesystem or network) and awake when loading done
            // but there is no such mechanism in js
            throw "E: no such class";
        }
        return ns[name];
    };

    _G.exportClass = function(id, C) {
        assert(isDottedIdentifier(id));
        assert(isClass(C));
        var a = id.split(".");
        var name = a.pop();
        var ns = getNamespace(a, true);
        if (typeof ns[name] !== "undefined") {
            throw "E: export: name conflict";
        }
        ns[name] = C;
    };
})(_G);
