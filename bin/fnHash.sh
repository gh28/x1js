#!/bin/bash

d=$1
if test ! -d "$d"; then
    d=.
fi

find -L $d -path "*/.[^\.]*" -prune -o -type f -name "*.tx_" -print 2>/dev/null | \
    while read fp; do
        i=$(basename "$fp")
        fn=${i%.*}
        sha1=$(sha1sum <<< "$fn" | cut -c1-4)
        echo $sha1 $fp
    done
