#!/bin/bash -e

THIS_DIR="$(dirname "$0")"

docker container prune --force
docker image prune --force

docker build --tag 'automatopia-nodejs' \
       -f "$THIS_DIR/Dockerfile" .

if [ $@ == 'karma' ]; then
  docker run \
         --tty \
         --interactive \
         --publish 9876:9876 \
         --volume=`pwd`/generated/:/usr/src/app/generated/ \
         --volume=`pwd`/src/:/usr/src/app/src/ \
         --volume=`pwd`/Procfile:/usr/src/app/Procfile \
         --volume=`pwd`/tasks.sh:/usr/src/app/tasks.sh \
         'automatopia-nodejs' "$THIS_DIR/tasks.sh" $@
elif [ $@ == 'run' ]; then
  docker run \
         --tty \
         --interactive \
         --publish 5000:5000 \
         --volume=`pwd`/generated/:/usr/src/app/generated/ \
         --volume=`pwd`/src/:/usr/src/app/src/ \
         --volume=`pwd`/Procfile:/usr/src/app/Procfile \
         --volume=`pwd`/tasks.sh:/usr/src/app/tasks.sh \
         'automatopia-nodejs' "$THIS_DIR/tasks.sh" $@
else
    docker run \
           --tty \
           --interactive \
           --net="host" \
           --volume=`pwd`/generated/:/usr/src/app/generated/ \
           --volume=`pwd`/src/:/usr/src/app/src/ \
           --volume=`pwd`/Procfile:/usr/src/app/Procfile \
           --volume=`pwd`/tasks.sh:/usr/src/app/tasks.sh \
           'automatopia-nodejs' "$THIS_DIR/tasks.sh" $@
fi
