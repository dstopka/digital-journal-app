#!/bin/bash

NODE_IMAGE="node_env"
DOTNET_IMAGE="dotnet_env"

check_image() {
    [[ "$(docker images -q $1 2> /dev/null)" == "" ]] && return 1

    return 0
}

usage_main() {
    cat << EOF

    run_env script's help

    USAGE:

    $0 -h|--help

    COMMANDS:

    run                 Runs development environment in docker container.

    OPTIONS:

    -h, --help:         Print help.

EOF
}

usage_build() {
    cat << EOF

    Build development environment container

    USAGE:

    $0 build [OPTIONS]

    OPTIONS:

    -a, --all:          Default option. Build containers with dotnet and node environments.
    -d, --dotnet:       Build container with dotnet environment.
    -n, --node:         Build container with node environment.
    -h, --help:         Print help.

EOF
}

build() {
    case "$1" in
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
            docker build -f .docker/Dockerfile.dotnet -t ${DOTNET_IMAGE} .
            [ $? -ne 0 ] && return 1
            ;;
        -n|--node)
            docker build -f .docker/Dockerfile.node -t ${NODE_IMAGE} .
            [ $? -ne 0 ] && return 1
            ;;
        *)
            echo "Unexpected argument $1!"
            usage_build
            return 1
            ;;
    esac

    return 0
}


usage_run() {
    cat << EOF

    Run development environment in docker container

    USAGE:

    $0 run [OPTIONS]

    OPTIONS:

    -d, --dotnet:       Run container with dotnet environment.
    -n, --node:         Run container with node environment.
    -h, --help:         Print help.

    --build:            Extra option to rebuild image before running.

EOF
}

run() {
    script_dir=$(dirname $(realpath "$0"))
    rebuild=false

    [ "$2" == "--build" ] && rebuild=true

    case "$1" in
        -h|--help)
            usage_run
            return $?
            ;;
        -d|--dotnet)
            check_image ${DOTNET_IMAGE}
            [ $? -ne 0 ] || [ $rebuild = true ] && build --dotnet

            docker run --rm -ti -v ${script_dir}/JournalApi:/src ${DOTNET_IMAGE}
            [ $? -ne 0 ] && return 1
            ;;
        -n|--node)
            check_image ${NODE_IMAGE}
            [ $? -ne 0 ] || [ $rebuild = true ] && build --node

            docker run --rm -ti -v ${script_dir}/JournalApp:/src ${NODE_IMAGE}
            [ $? -ne 0 ] && return 1
            ;;
        *)
            echo "Unexpected argument $1!"
            usage_run
            return 1
            ;;
    esac

    return 0
}

case "$1" in
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
        echo "Unexpected argument $1! (try -h|--help)"
        ;;
esac
RC=$?

exit ${RC}