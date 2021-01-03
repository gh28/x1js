_G;

@native function rawcreate(); // very clean create

@native function rawget(o, k);

@native function rawset(o, k, v);

function rawgetaccess(o, k, accessKey) {
    var v = rawget(o, "__access");
    v = v == null ? null : rawget(v, k);
    v = v == null ? null : rawget(v, accessKey);
    return v == null ? true : v;
}

function rawsetaccess(o, k, accessKey, accessValue) {
    switch (accessKey) {
        case "r":
        case "w":
        case "e":
            var v = rawget(o, "__access");
            if (v == null)  {
                v = rawcreate();
                rawset(o, "__access", v);
            }
            rawset(v, accessKey, accessValue);
            return;
        default:
            break;
    }
    throw String.format("E: invalid accessKey [%s]", accessKey);
}

function rawgetproto(o) {
    return rawget(o, "__proto");
}

function rawsetproto(o, proto) {
    return rawset(o, "__proto", proto);
}

@native function rawisint(o);

@native function rawisobject(o);

@native function rawisstring(o);

@native function rawiscallable(o);

var Object = rawcreate();

// alias o[k];
function Object.__get(o, k) {
    while (o != null) {
        if (rawgetaccess(o, k, "r")) {
            var v = rawget(o, k);
            if (v != null) {
                return v;
            }
        }
        o = rawgetproto(o);
    }
    return null;
}

// alias o[k] = v;
function Object.__set(o, k, v) {
    if (!rawgetaccess(o, k, "w")) {
        return null;
    }
    var old = rawget(o, k);
    rawset(o, k, v);
    return old;
}

@native function Object.__iterate(o);

// TODO
function Object.merge(o, Object o1);

function Object.toString(o) {
    return "[object Object]";
}

var List = rawcreate();
rawsetproto(List, Object);

function List_setValue(o, int i, v) {
    if (!rawisint(i)) {
        throw "E:"
    } else if (i < 0 || i >= o.__length) {
        throw "E: index out of range";
    }
    return Object.__set(o, i, v);
}

function List_insertValue(o, v) {
    return List_insertValue(o, o.__length, v);
}

function List_insertValue(o, int i, v) {
    var t = v;
    for (var j = i; j <= o.__length; ++j) {
        t = List_setValue(o, j, t);
    }
    o.__length++;
    return null;
}

function List_removeValue(o) {
    return List_removeValue(o, o.__length - 1);
}

function List_removeValue(o, int i) {
    if (!rawisint(i)) {
        throw "E:";
    }
    var t = Object.__get(o, i);
    for (var j = i + 1; j < o.__length; ++j) {
        Object.__set(o, j - 1, Object.__get(o, j));
    }
    Object.__set(o, o.__length - 1, null);
    o.__length--;
    return null;
}

function List.__set(o, k, v) {
    if (rawisint(k)) {
        return setValue(o, k, v);
    }
    if (rawisstring(k) && rawiscallable(v)) {
        return Object.__set(o, k, v);
    }
    throw "E: invalid argument";
}

function List.insert(o, ...) {
    if (args.size() == 2) {
        return List_insertValue(o, rawget(args, 1));
    } else if (args.size() >= 3) {
        return List_insertValue(o, rawget(args, 1), rawget(args, 2));
    }
    throw "E:";
}

function List.remove(o, ...) {
    if (args.size() == 1) {
        return List_removeValue(o);
    } else if (args.size() >= 2) {
        return List_removeValue(o, rawget(args, 1));
    }
    throw "E:";
}

function List.size(o) {
    return o.__length;
}

function List.toString(o) {
    return "[object List]";
}

function List.__ctor(o) {
    o.__length = 0;
}

String;

function int String.getCodePoint(s, i);

function int String.find(String s, String s1);

function int String.findRegex(String s, Regex regex);

function String String.take(String s, int start, int end);

function String String.__concat(String s, String s1); // alias s .. s1;

function List String.split(String s, String s1);

function boolean String.isEmpty(String s);

function int String.__compare(String s, String s1);

function boolean startsWith(String s, String s1);

function boolean endsWith(String s, String s1);

////////////////////////////////////////

namespace com.abc.Asdf {
    import xxx.xxx.A
    import xxx.xxx.B as BBB;

    var asdf = {};
    ...

    export asdf;
};

metatable是很先进的，__proto只是metatable.__index == metatable时的特例

