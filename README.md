# Automatopia-nodejs
This repo is a web-application template that provides sufficient tooling for
testing at the unit, integration, and end-to-end level.

There is a strong focus on automation and static analysis (linting). Tests can
also be run incrementally to keep the feedback loop as tight as possible.

## Development
View the available tasks to run

``` bash
./tasks.sh
```

## Setup
### Frontend testing requirements
In order to perform cross-browser testing professionally, we must test our
application in real browsers. The testing infrastructure checks that the
expected browsers are tested. You will need to install the necessary browsers
and run the necessary emulators(or test loosely - see the error message).

I recommend that you test all browsers/platforms that you intend to serve
as part of the automated testing.

With this in place, make sure to start the karma server and capture each of
the browsers you would like to test by visiting http://localhost:9876 (may
differ if you are in an emulator - read the docs for that environment).

## Credits
  Much of the inspiration and implementation is borrowed from James Shore
  (https://github.com/jamesshore). I highly recommend his webseries Let's Code
  Test Driven Javascript (http://www.letscodejavascript.com/).
