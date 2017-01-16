#!/usr/bin/env python
#coding:utf-8

import re as regex;
import sys
import gflags;

def isHeading(line):
    if regex.match("^第.{1,5}(章|回|节|折)".decode("utf8"), line.decode("utf8")):
        return True

numTotalLines = 0;
numEmptyLines = 0;
meta = {};

gflags.DEFINE_string("filepath", None, "", short_name="f");
gflags.FLAGS(sys.argv)
for line in open(gflags.FLAGS["filepath"].value):
    numTotalLines += 1;
    line = line.strip();
    if (not line):
        numEmptyLines += 1;
        continue;

    utf8Len = len(line.decode("utf8"));

    if (numTotalLines - numEmptyLines == 1):
        meta["title"] = line;
        print "<h1>" + line + "</h1>";
        continue;

    if (numTotalLines - numEmptyLines == 2):
        if (utf8Len < 12):
            meta["author"] = line;
            print "<h2>" + line + "</h2>";
            continue;

    if isHeading(line):
        print "<h4>" + line + "</h4>";
        continue;

    print "<p>" + line + "</p>";

