#!/usr/bin/env bash

if [[ "$BASH_SOURCE" == /* ]]; then
    TOP=$(realpath $(dirname $BASH_SOURCE)/..)
else
    TOP=$(realpath $(pwd)/$(dirname $BASH_SOURCE)/..)
fi

x1js=$TOP/../x1js/out

mkdir -p $TOP/out/bin
cp -t $TOP/out/bin \
    $TOP/build/fnHash.sh \
    $TOP/build/txt2html.py \
    $TOP/build/start.sh
cp -r -t $TOP/out/bin \
    $x1js/*
cp -r -t $TOP/out/bin \
    $TOP/src/*
