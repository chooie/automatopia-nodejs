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
         --volume ~/.docker-yarn-cache:/root/yarn-cache \
         --volume `pwd`:/tmp/project \
         --workdir /tmp/project \
         --publish 9876:9876 \
         'automatopia-nodejs' "$THIS_DIR/tasks.sh" $@
elif [ $@ == 'run' ]; then
  docker run \
         --tty \
         --interactive \
         --volume ~/.docker-yarn-cache:/root/yarn-cache \
         --volume `pwd`:/tmp/project \
         --workdir /tmp/project \
         --publish 5000:5000 \
         'automatopia-nodejs' "$THIS_DIR/tasks.sh" $@
else
    docker run \
           --tty \
           --interactive \
           --volume ~/.docker-yarn-cache:/root/yarn-cache \
           --volume `pwd`:/tmp/project \
           --workdir /tmp/project \
           --net="host" \
           'automatopia-nodejs' "$THIS_DIR/tasks.sh" $@
fi
