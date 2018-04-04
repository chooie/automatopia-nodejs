#!/bin/bash -e

THIS_DIR="$(dirname "$0")"

docker container prune --force
docker image prune --force

docker build --tag 'automatopia-nodejs' \
       -f "$THIS_DIR/Dockerfile" .

docker run \
       --tty \
       'automatopia-nodejs' "$THIS_DIR/tasks.sh" $@
