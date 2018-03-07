#!/usr/bin/env bash

[ ! -f node_modules/.bin/jake ] && npm rebuild

./node_modules/jake/bin/cli.js --jakefile src/build/Jakefile.js $@
