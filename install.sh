#!/bin/bash

NODE_IMAGE="node_env"
DOTNET_IMAGE="dotnet_env"
SCRIPT_DIR=$(dirname $(realpath "$0"))
DOCKER_COMMON_OPTIONS_UI="--rm -v ${SCRIPT_DIR}/JournalApp:/src"
DOCKER_COMMON_OPTIONS_API="--rm -v ${SCRIPT_DIR}/JournalApi:/src"

check_image() {
    [[ "$(docker images -q $1 2> /dev/null)" == "" ]] && return 1

    return 0
}

step() {
    local step=" $@ "
    local line=$(eval printf "%0.s-" {1..5})
    echo -e "\n\033[31m${line}${step}${line}\033[0m\n"
}

check_node_modules() {
    local rc=0
    if [ "JournalApp/package.json" -nt "JournalApp/node_modules" ]; then
        set -x
        time docker run ${DOCKER_COMMON_OPTIONS_UI} ${NODE_IMAGE} sh -c 'npm install && touch node_modules'
        rc=$?
        set +x
    fi

    return $rc
}

usage_main() {
    cat << EOF

USAGE: $0 [[build]|test|deploy|clean|api|ui|-h|--help]

    OPTIONS:

    build               Build API and UI code. 
                        This is a default option.
    test                Run unit tests for API and UI.
    deploy              Deploy application locally.
    clean               Stop application and clean environment.
    api                 Build, test or inspect API code.
    ui                  Build or test UI code.
    -h, --help:         Print help.

EOF
}

_build_code() {
    local rc=
    local do_api=
    local do_ui=
    local do_production=

    while [ $# != 0 ]; do
        _option="$1"
        case ${_option} in
            api)
                do_api=true
                ;;
            ui)
                do_ui=true
                ;;
            --prod)
                do_production=true
                ;;
        esac
        shift
    done

    if [[ -n ${do_api} ]]; then
        step "BUILDING API"
        if [[ -n ${do_production} ]]; then
            set -x
            time docker build -f $SCRIPT_DIR/.docker/Dockerfile.api -t journalapp_api $SCRIPT_DIR/JournalApi
            rc=$?
            set +x
        else
            check_image ${DOTNET_IMAGE}
            [ $? -ne 0 ] && ./env.sh build --dotnet

            set -x
            time docker run ${DOCKER_COMMON_OPTIONS_API} ${DOTNET_IMAGE} dotnet build
            rc=$?
            set +x            
        fi

        [ $rc -ne 0 ] && return $rc
    fi


    if [[ -n ${do_ui} ]]; then
        step "BUILDING UI"
        if [[ -n ${do_production} ]]; then
            set -x
            time docker build -f $SCRIPT_DIR/.docker/Dockerfile.ui -t journalapp_ui $SCRIPT_DIR/JournalApp
            rc=$?
            set +x
        else
            check_image ${NODE_IMAGE}
            [ $? -ne 0 ] && ./env.sh build --node

            check_node_modules
            [ $? -ne 0 ] && return 1

            set -x
            time docker run ${DOCKER_COMMON_OPTIONS_UI} ${NODE_IMAGE} npm run build
            rc=$?
            set +x
        fi

        [ $rc -ne 0 ] && return $rc
    fi

    return $rc
}

_run_unit_tests() {
    local rc=

    case "$1" in
        api)
            check_image ${DOTNET_IMAGE}
            [ $? -ne 0 ] && ./env.sh build --dotnet

            step "RUNNING API UNIT TESTS"
            set -x
            time docker run ${DOCKER_COMMON_OPTIONS_API} ${DOTNET_IMAGE} dotnet test
            rc=$?
            set +x
            ;;
        ui)
            check_image ${NODE_IMAGE}
            [ $? -ne 0 ] && ./env.sh build --node

            step "RUNNING UI UNIT TESTS"
            check_node_modules
            [ $? -ne 0 ] && return 1

            set -x
            time docker run ${DOCKER_COMMON_OPTIONS_UI} ${NODE_IMAGE} ng test --no-watch --no-progress --browsers=ChromeHeadlessCI
            rc=$?
            set +x
            ;;
        *)
            return 1
            ;;
    esac

    return $rc
}

_code_inspect() {
    local rc=

    check_image ${DOTNET_IMAGE}
    [ $? -ne 0 ] && ./env.sh build --dotnet

    _build_code api
    [ $? -ne 0 ] && return 1

    step "RUNNING DOTNET CODE INSPECTION"
    set -x
    time docker run ${DOCKER_COMMON_OPTIONS_API} ${DOTNET_IMAGE} bash -c '$HOME/.dotnet/tools/jb inspectcode JournalApi.sln -o=reports/inspect.xml'
    rc=$?
    set +x

    return $rc
}

usage_build() {
    cat << EOF

USAGE: $0 build [[--dev]|--prod|-h|--help]

    Build whole project

    OPTIONS:

    --dev:              Default. Build code in the container.
    --prod:             Build production images
                        for API and client.
    -h, --help:         Print help.

EOF
}

build() {
    local option=${1:---dev}
    local rc=

    case "${option}" in
        -h|--help)
            usage_build
            return $?
            ;;
        --dev)
            _build_code api ui
            rc=$?
            ;;
        --prod)
            _build_code api ui --prod
            rc=$?
            ;;
        *)
            echo "Unexpected argument $1!"
            usage_build
            return 1
            ;;
    esac

    return $rc
}

usage_test() {
    cat << EOF

USAGE: $0 test [-h|--help]

    Run unit tests for both API and UI

    OPTIONS:

    -h, --help:         Print help.

EOF
}

test() {
    case "$1" in
        -h|--help)
            usage_test
            return $?
            ;;
        "")
            _run_unit_tests api
            [ $? -ne 0 ] && return 1

            _run_unit_tests ui
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

usage_deploy() {
    cat << EOF

USAGE: $0 deploy [[--dev]|--build|--release|-h|--help]

    Deploy project using docker-compose.

    OPTIONS:

    --dev:              Default option. Deploy latest local build.
                        It will build images, if no deployment
                        images are present locally.
    --build:            Build and deploy project from local code.
    --release           Deploy latest release version.
                        !!! Note that this option is NOT supported yet.
    -h, --help:         Print help.

EOF
}

deploy() {
    local option=${1:---dev}
    shift
    local rc=

    case ${option} in
        -h|--help)
            usage_deploy
            return $?
            ;;
#        --release)
#            clean
#            step "DEPLOY LATEST RELEASE"
#            docker-compose -f ./.docker/docker-compose.yaml up -d
#            [ $? -ne 0 ] && return 1
        --build)
            clean
            step "BUILD AND DEPLOY"
            _build_code api ui --prod
            set -x
            docker-compose -f ./.docker/docker-compose-dev.yaml up -d
            rc=$?
            set +x
            ;;
        --dev)
            clean
            step "DEPLOY"
            set -x
            docker-compose -f ./.docker/docker-compose-dev.yaml up -d
            rc=$?
            set +x
            ;;
        *)
            echo "Unexpected argument $1!"
            usage_test
            return 1
            ;;
    esac

    local deployment_ip=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' journalapp_ui)
    echo "You can access website in your browser at $deployment_ip"

    return $rc
}

usage_clean() {
    cat << EOF

USAGE: $0 clean [[--soft]|--hard|-h|--help]

    Clean environment

    $0 clean [OPTION]

    OPTIONS:

    --soft:             Remove only deployment (if exists).
                        This is a default option.
    --hard:             Remove deployment and images created
                        by it. Removes also binaries.
    -h, --help:         Print help.

EOF
}

clean() {
    local option=${1:---soft}

    case "$option" in
            -h|--help)
                usage_clean
                return $?
                ;;
            --soft)
                step "ENVIRONMENT CLEANUP - SOFT"
                docker-compose -f ./.docker/docker-compose-dev.yaml down
                docker-compose -f ./.docker/docker-compose.yaml down
                ;;
            --hard)
                step "ENVIRONMENT CLEANUP - HARD"
                docker-compose -f ./.docker/docker-compose-dev.yaml down --rmi all
                docker-compose -f ./.docker/docker-compose.yaml down --rmi all
                docker system prune -f
                rm -rf JournalApi/JournalApi/bin JournalApi/JournalApi/obj \
                       JournalApi/Test/bin JournalApi/Test/obj
                rm -rf JournalApp/dist
                ;;
            *)
                echo "Unexpected argument $1!"
                usage_clean
                return 1
                ;;
        esac

    return 0
}

usage_ui() {
    cat << EOF

USAGE: $0 api [[--build]|--test|-h|--help]

    Perform actions on the UI code. You can pass multiple actions
    eg. $0 ui --build --test

    OPTIONS:

    --build            Build UI code. This is a default option.
    --test             Run tests on UI code.
    -h, --help         Print help.

EOF
}

ui() {
    local option=${1:---build}

    while [ $# != 0 ]; do
        case ${option} in
            -h|--help)
                usage_ui
                return $?
                ;;
            --test)
                _run_unit_tests ui
                [ $? -ne 0 ] && return 1
                ;;
            --build)
                _build_code ui
                [ $? -ne 0 ] && return 1
                ;;
            *)
                echo "Unexpected argument $1!"
                usage_ui
                return 1
                ;;
        esac
        shift
        option="$1"
    done

    return 0
}

usage_api() {
    cat << EOF

USAGE: $0 api [[--build]|--test|--inspect|-h|--help]

    Perform actions on the API code. You can pass multiple actions
    eg. $0 api --build --test

    OPTIONS:

    --build             Build API code. This is a default option.
    --test              Run tests on API code.
    --inspect           Run code inspection on API project.
    --coverage          Run code coverage on API project.
    -h, --help          Print help.

EOF
}

api() {
    local option=${1:---build}

    while [ $# != 0 ]; do
        case ${option} in
            -h|--help)
                usage_api
                return $?
                ;;
            --test)
                _run_unit_tests api
                [ $? -ne 0 ] && return 1
                ;;
            --build)
                _build_code api
                [ $? -ne 0 ] && return 1
                ;;
            --inspect)
                _code_inspect
                [ $? -ne 0 ] && return 1
                ;;
            --coverage)
                step "RUNNING DOTNET CODE COVERAGE"
                set -x
                time docker run ${DOCKER_COMMON_OPTIONS_API} ${DOTNET_IMAGE} bash -c '$HOME/.dotnet/tools/dotnet-dotcover test --dcXML=/src/reports/coverage.xml'
                local rc=$?
                set +x
                [ $rc -ne 0 ] && return 1
                "$BROWSER" "${SCRIPT_DIR}/JournalApi/reports/coverageReport.html"
                ;;
            *)
                echo "Unexpected argument $1!"
                usage_api
                return 1
                ;;
        esac
        shift
        option="$1"
    done

    return 0
}

run_command="$0 $@"
option=${1:-build}

case ${option} in
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
    deploy)
        shift
        deploy $@
        ;;
    clean)
        shift
        clean $@
        ;;
    api)
        shift
        api $@
        ;;
    ui)
        shift
        ui $@
        ;;
    *)
        echo "Unexpected argument $1! Run: $0 --help"
        ;;
esac
RC=$?

[ $RC -ne 0 ] && echo -e "\nExecution of: ${run_command} failed!\n"

exit ${RC}