#!/usr/bin/env bash

if [ ! -f node_modules/chromedriver/lib/chromedriver/chromedriver ]; then
   echo "Building node_modules binaries"
   npm rebuild
fi

./node_modules/jake/bin/cli.js --jakefile src/build/Jakefile.js $@
