#!/bin/bash

NODE_IMAGE="node_env"
DOTNET_IMAGE="dotnet_env"
SCRIPT_DIR=$(dirname $(realpath "$0"))

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

    build                 Build application images.
    test                  Run unit tests.
    deploy                Deploy application locally.
    clean                 Stop application and clean environment.

    OPTIONS:

    -h, --help:         Print help.

EOF
}

usage_build() {
    cat << EOF

    Build application code

    USAGE:

    $0 build [OPTIONS]

    OPTIONS:

    -a, --all:          Default option. Build both dotnet api and angular ui.
    -w, --webapi:       Build dotnet api.
    -f, --frontend:     Build angular ui.
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
            build --webap
            [ $? -ne 0 ] && return 1

            build --frontend
            [ $? -ne 0 ] && return 1
            ;;
        -w|--webapi)
            check_image ${DOTNET_IMAGE}
            [ $? -ne 0 ] && ./env.sh build --dotnet

            docker run --rm -v ${SCRIPT_DIR}/JournalApi:/src ${DOTNET_IMAGE} dotnet build
            [ $? -ne 0 ] && return 1
            ;;
        -f|--frontend)
            check_image ${NODE_IMAGE}
            [ $? -ne 0 ] && ./env.sh build --node

            docker run --rm -v ${SCRIPT_DIR}/JournalApp:/src ${NODE_IMAGE} ng build
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

usage_test() {
    cat << EOF

    Run unit tests

    USAGE:

    $0 test [OPTIONS]

    OPTIONS:

    -a, --all:          Default option. Run both dotnet api and angular ui tests.
    -w, --webapi:       Run dotnet api tests.
    -f, --frontend:     Run angular ui tests.
    -h, --help:         Print help.

EOF
}

test() {
    case "$1" in
        -h|--help)
            usage_build
            return $?
            ;;
        -a|--all|"")
            test --webapi
            [ $? -ne 0 ] && return 1

            build --frontend
            [ $? -ne 0 ] && return 1
            ;;
        -w|--webapi)
            check_image ${DOTNET_IMAGE}
            [ $? -ne 0 ] && ./env.sh build --dotnet

            docker run --rm -v ${SCRIPT_DIR}/JournalApi:/src ${DOTNET_IMAGE} dotnet test
            [ $? -ne 0 ] && return 1
            ;;
        -f|--frontend)
            check_image ${NODE_IMAGE}
            [ $? -ne 0 ] && ./env.sh build --node

            docker run --rm -v ${SCRIPT_DIR}/JournalApp:/src ${NODE_IMAGE} ng test --no-watch --no-progress --browsers=ChromeHeadlessCI
            [ $? -ne 0 ] && return 1
            ;;
        *)
            echo "Unexpected argument $1!"
            usage_test
            return 1
            ;;
    esac

    return 0
}

deploy() {
    
    if [ "$1" == "--prod" ]; then
        docker-compose -f ./.docker/docker-compose.yaml up -d
    else
        docker-compose -f ./.docker/docker-compose-local.yaml up -d --build
    fi
    
    [ $? -ne 0 ] && return 1

    return 0
}

clean() {

    docker-compose -f ./.docker/docker-compose-local.yaml down
    docker-compose -f ./.docker/docker-compose.yaml down
    docker system prune

    return 0
}


case "$1" in
    -h|--help)
        usage_main
        ;;
    build)
        shift
        build $@
        ;;
    test)
        shift
        test $@
        ;;
    run)
        shift
        run $@
        ;;
    deploy)
        shift
        deploy $@
        ;;
    clean)
        clean
        ;;
    *)
        echo "Unexpected argument $1! (try -h|--help)"
        ;;
esac
RC=$?

exit ${RC}