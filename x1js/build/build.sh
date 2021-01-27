#!/usr/bin/env bash

if [[ "$BASH_SOURCE" == /* ]]; then
    TOP=$(realpath $(dirname $BASH_SOURCE)/..)
else
    TOP=$(realpath $(pwd)/$(dirname $BASH_SOURCE)/..)
fi

OUT=$TOP/out

########

function usage() {
    echo "usage: (TBD)"
}

PARSED_OPTS=$(getopt -a -n "$0" -o h: --long help,restore -- "$@")
if [ $? != 0 ]; then
    usage
    exit 1
fi

eval set -- "$PARSED_OPTS"

optWantsRestore=false
while true
do
    case "$1" in
        -h | --help)
            usage
            shift
            ;;
        --restore)
            optWantsRestore=true
            shift
            ;;
        --)
            shift
            break
            ;;
        *)
            break
            ;;
    esac
done

if $optWantsRestore; then
    npm install
fi

mkdir -p $OUT

uglifyjs=$TOP/node_modules/uglify-js/bin/uglifyjs

$uglifyjs -c properties,dead_code,collapse_vars -m \
    -o $OUT/_G.min.js \
    -- \
    $TOP/src/lang/_G.js \
    $TOP/src/lang/P.js

$uglifyjs -c properties,dead_code,collapse_vars -m \
    -o $OUT/x1.min.js \
    -- \
    $TOP/src/lang/x1.js \
    $TOP/src/lang/Proto.js \
    $TOP/src/lang/Package.js \
    $TOP/src/lang/Cstring.js \
    $TOP/src/lang/Cmap.js

cat > $OUT/demo.html << EOF
<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
    <title>demo</title>
    <script type="text/javascript">
`cat \
    $OUT/_G.min.js \
`
    </script>
</head>
<body>
    <script>
P.addConfig("jQuery", "https://code.jquery.com/jquery-3.2.1.min.js", function() {
    P.ask().answer("jQuery", function() {
        return jQuery;
    });
});
P.ask("init").answer(null, function() {
    var div = document.createElement("div");
    div.textContent = "hello world";
    document.body.appendChild(div);
});
P.ask("jQuery").answer("init", null);
    </script>
</body>
</html>
EOF

cp -r -t $TOP/out \
    $TOP/src/fenc

cp -r -t $TOP/out \
    $TOP/src/net
