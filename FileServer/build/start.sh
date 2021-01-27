#!/bin/bash

echo $(cd `dirname $BASH_SOURCE`; pwd) '=>' $(dirname $(readlink -f $BASH_SOURCE))

cd `dirname $BASH_SOURCE`
PATH=$PATH:./bin:./build nodejs ./main.js --port=8090
