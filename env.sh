#!/bin/bash

NODE_IMAGE="node_env"
DOTNET_IMAGE="dotnet_env"
BASE_DIR=$(dirname $(realpath "$0"))
DOCKERFILE_DOTNET="${BASE_DIR}/.docker/Dockerfile.dotnet"
DOCKERFILE_NODE="${BASE_DIR}/.docker/Dockerfile.node"

check_image() {
    [[ "$(docker images -q $1 2> /dev/null)" == "" ]] && return 1

    return 0
}

step() {
    local step=" $@ "
    local line=$(eval printf "%0.s-" {1..5})
    echo -e "\n\033[31m${line}${step}${line}\033[0m\n"
}

usage_main() {
    cat << EOF

USAGE: $0 [[build]|run|-h|--help]

    OPTIONS:

    build:              Build environment docker image. Default option.
    run:                Run development environment in a docker container.
    -h, --help:         Print help.

EOF
}

usage_build() {
    cat << EOF

USAGE: $0 build [[-a|--all]|-d|--dotnet|-n|--node|-h|--help]

    Build development environment image

    OPTIONS:

    -a, --all:          Default option. Build containers with dotnet and node environments.
    -d, --dotnet:       Build container with dotnet environment.
    -n, --node:         Build container with node environment.
    -h, --help:         Print help.

EOF
}

build() {
    local option=${1:--a}
    local rc=

    case ${option} in
        -h|--help)
            usage_build
            return $?
            ;;
        -a|--all|"")
            build --dotnet
            [ $? -ne 0 ] && return 1

            build --node
            [ $? -ne 0 ] && return 1
            ;;
        -d|--dotnet)
            step "BUILDING ${DOTNET_IMAGE}"

            set -x
            time docker build -f ${DOCKERFILE_DOTNET} --build-arg USER=${USER} \
                        --build-arg UID=$(id -u) -t ${DOTNET_IMAGE} ${BASE_DIR}/.docker
            rc=$?
            set +x
            ;;
        -n|--node)
            step "Building ${NODE_IMAGE}"

            set -x
            time docker build -f ${DOCKERFILE_NODE} --build-arg USER=${USER} \
                        --build-arg UID=$(id -u) -t ${NODE_IMAGE} ${BASE_DIR}/.docker
            rc=$?
            set +x
            ;;
        *)
            echo "Unexpected argument $1!"
            usage_build
            return 1
            ;;
    esac

    return $rc
}


usage_run() {
    cat << EOF

USAGE: $0 run [-d|--dotnet|-n|--node|-h|--help] [--build]

    Run development environment in docker container

    OPTIONS:

    -d, --dotnet:       Run container with dotnet environment.
    -n, --node:         Run container with node environment.
    -h, --help:         Print help.

    --build:            Extra option to rebuild image before running.
                        This option defaults to false.

EOF
}

run() {
    
    local rebuild=
    local rc=

    [ "$2" == "--build" ] && rebuild=true

    case "$1" in
        -h|--help|"")
            usage_run
            return $?
            ;;
        -d|--dotnet)
            check_image ${DOTNET_IMAGE}
            [ $? -ne 0 ] || [[ $rebuild == true ]] && build --dotnet

            step "STARTING ${DOTNET_IMAGE}"
            set -x
            docker run --rm -ti -v ${BASE_DIR}/JournalApi:/src ${DOTNET_IMAGE}
            rc=$?
            set +x
            ;;
        -n|--node)
            check_image ${NODE_IMAGE}
            [ $? -ne 0 ] || [ $rebuild = true ] && build --node

            step "STARTING ${NODE_IMAGE}"
            set -x
            docker run --rm -ti -v ${BASE_DIR}/JournalApp:/src ${NODE_IMAGE}
            rc=$?
            set +x
            ;;
        *)
            echo "Unexpected argument $1!"
            usage_run
            return 1
            ;;
    esac

    return $rc
}

run_command="$0 $@"
option=${1:-build}

case ${option} in
    -h|--help)
        usage_main
        ;;
    run)
        shift
        run $@
        ;;
    build)
        shift
        build $@
        ;;
    *)
        echo "Unexpected argument $1! Run: $0 --help"
        ;;
esac
RC=$?

[ $RC -ne 0 ] && echo -e "\nExecution of: ${run_command} failed!\n"

exit $RC