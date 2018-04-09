#!/bin/bash -e

THIS_DIR="$(dirname "$0")"

docker container prune --force
docker image prune --force

docker build --tag 'automatopia-nodejs' \
       -f "$THIS_DIR/Dockerfile" .

if [ $1 == 'karma' ]; then
  docker run \
         --tty \
         --interactive \
         --publish 9876:9876 \
         --volume=`pwd`:/usr/src/app/ \
         'automatopia-nodejs' $@
elif [ $1 == 'run' ]; then
  docker run \
         --tty \
         --interactive \
         --publish 5000:5000 \
         --volume=`pwd`:/usr/src/app/ \
         'automatopia-nodejs' $@
else
    docker run \
           --tty \
           --interactive \
           --net="host" \
           --volume=`pwd`:/usr/src/app/ \
           'automatopia-nodejs' $@
fi
