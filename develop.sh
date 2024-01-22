#!/bin/bash

IMAGENAME="fold-ninja-develop"

run_docker() {
    XAUTH=${XAUTHORITY:-$HOME/.Xauthority}
    DOCKER_XAUTHORITY=${XAUTH}.docker
    cp --preserve=all $XAUTH $DOCKER_XAUTHORITY
    xauth nlist $DISPLAY | sed -e 's/^..../ffff/' | xauth -f $DOCKER_XAUTHORITY nmerge -

    docker run --rm -d \
        -u $(id -u):$(id -g) \
        -v /etc/passwd:/etc/passwd:ro \
        -e DISPLAY=unix$DISPLAY \
        -e NO_AT_BRIDGE=1 \
        -e GTK_THEME=Adwaita \
        -v /tmp/.X11-unix:/tmp/.X11-unix:ro \
        -e XAUTHORITY=$DOCKER_XAUTHORITY \
        -v $DOCKER_XAUTHORITY:$DOCKER_XAUTHORITY:ro \
        -v ./.home:/home/vscodeuser \
        -v .:/home/vscodeuser/Documents \
        -v ./.home:/home/$USER \
        -v .:/home/$USER/Documents \
        -e HOME=/home/vscodeuser \
        -e USER=vscodeuser \
        $IMAGENAME
}

if [ "$1" == "reset" ]; then
  echo "'reset' configuration"
  sudo rm -rf ./.home
fi

# Check if ./.home directory exists, if not create it
if [ ! -d ./.home ]; then
  echo "Creating ./.home directory"
  mkdir ./.home
fi

# Check if image exists, if not build it
if [ -z "$(docker images -q $IMAGENAME)" ]; then
  echo "Pulling the latest Ubuntu image"
  docker pull ubuntu:latest
  echo "Building $IMAGENAME"
  docker build -t $IMAGENAME .
fi

run_docker
