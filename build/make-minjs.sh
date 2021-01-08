#!/usr/bin/env bash

if [[ "$BASH_SOURCE" == /* ]]; then
    TOP=$(realpath $(dirname $BASH_SOURCE)/..)
else
    TOP=$(realpath $(pwd)/$(dirname $BASH_SOURCE)/..)
fi

mkdir -p $TOP/out

/usr/local/bin/uglifyjs -c properties,dead_code,collapse_vars -m \
    -o $TOP/out/embedded.min.js \
    -- \
    $TOP/x1js/src/lang/_G.js \
    $TOP/x1js/src/lang/P.js

/usr/local/bin/uglifyjs -c properties,dead_code,collapse_vars -m \
    -o $TOP/out/x1.min.js \
    -- \
    $TOP/x1js/src/lang/x1.js \
    $TOP/x1js/src/lang/Proto.js \
    $TOP/x1js/src/lang/Package.js \
    $TOP/x1js/src/lang/Cstring.js \
    $TOP/x1js/src/lang/Cmap.js
