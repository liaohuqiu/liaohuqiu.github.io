#!/bin/bash

set -e

prj_path=$(cd $(dirname $0); pwd -P)
SCRIPTFILE=`basename $0`

source $prj_path/base.sh

app_image=srain/blog-jekyll
app_fe_image=srain/blog-fe
app_container=blog-jekyll
app_fe_container=blog-fe

function run_app_container() {
    args=''
    args="$args -v $prj_path:/opt/app"
    args="$args -w /opt/app"
    run_cmd "docker run -it $args --name $app_container $app_image /bin/bash"
}

function build() {
    docker build -t $app_image $prj_path/_docker/blog-jekyll/
}

function build_fe() {
    docker build -t $app_fe_image $prj_path/_fe
}

function run_fe_container() {
    local path='/opt/app'
    args=''
    args="$args -v $prj_path:$path"
    args="$args -w $path/_fe"
    run_cmd "docker run -it $args --rm --name $app_fe_container $app_fe_image /bin/bash"
}

function stop_fe_container() {
    stop_container $app_fe_container
}

function run() {
    run_app_container
}

function restart() {
    stop
    run
}

function stop() {
    stop_container $app_container
}

function show_usage() {
	cat <<-EOF
    
    Usage: mamanger.sh [options]

	    Valid options are:

            build
            run
            restart
            stop

            build-fe
            run-fe
            stop-fe

            -h                      show this help message and exit

EOF
	exit $1
}

while :; do
    case $1 in
        -h|-\?|--help)
            show_usage
            exit
            ;;
        build)
            build
            exit
            ;;
        build-fe)
            build_fe
            exit
            ;;
        run)
            run
            exit
            ;;
        run-fe)
            run_fe_container
            exit
            ;;
        stop-fe)
            stop_fe_container
            exit
            ;;
        stop)
            stop
            exit
            ;;
        restart)
            restart
            exit
            ;;
        *)               # Default case: If no more options then break out of the loop.
            printf 'ERROR: no such option.\n' >&2
            show_usage
            exit 1
            break
    esac

    shift
done
