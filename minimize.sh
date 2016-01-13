#!/bin/sh
uglifyjs -c -m --preamble "/* Copyright (c) 2014-2016 Dan Stillman - MIT License - https://github.com/dstillman/pathparser.js */" pathparser.js > pathparser.min.js
