#!/bin/bash

set -e

prj_path=$(cd $(dirname $0); pwd -P)
SCRIPTFILE=`basename $0`

source $prj_path/base.sh

app_image=srain/blog-jekyll
app_fe_image=srain/blog-fe
app_container=blog-jekyll
app_fe_container=blog-fe

function build_blog_image() {
    docker build -t $app_image $prj_path/_docker/blog-jekyll/
}

function build_fe_image() {
    docker build -t $app_fe_image $prj_path/_fe
}

function run_blog_container() {
    cmd=$1
    args=''
    args="$args -v $prj_path:/opt/app"
    args="$args -w /opt/app"
    run_cmd "docker run -it $args --rm --name $app_container $app_image $cmd"
}

function run_fe_container() {
    cmd=$1
    local path='/opt/app'
    args=''
    args="$args -v $prj_path:$path"
    args="$args -w $path/_fe"
    run_cmd "docker run -it $args --rm --name $app_fe_container $app_fe_image $cmd"
}

function stop_blog_container() {
    stop_container $app_container
}

function stop_fe_container() {
    stop_container $app_fe_container
}

function into_fe() {
    run_fe_container '/bin/bash'
}

function fe_build() {
    run_fe_container 'npm run build'
}

function fe_build_prod() {
    run_fe_container 'npm run build-prod'
}

function into_blog() {
    run_blog_container '/bin/bash'
}

function build_log() {
    run_blog_container 'jekyll build -w'
}

function show_usage() {
	cat <<-EOF
    
    Usage: mamanger.sh [options]

	    Valid options are:

            build-blog-image
            build                   build blog
            into-blog
            stop-blog

            build-fe-image
            fe-build
            fe-build-prod
            into-fe
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
        build-blog-image)
            build_blog_image
            exit
            ;;
        build-fe-image)
            build_fe_image
            exit
            ;;
        build)
            build_log
            exit
            ;;
        into-blog)
            into_blog
            exit
            ;;
        stop-blog)
            stop_blog_container
            exit
            ;;
        into-fe)
            into_fe
            exit
            ;;
        stop-fe)
            stop_fe_container
            exit
            ;;
        fe-build)
            fe_build
            exit
            ;;
        fe-build-prod)
            fe_build_prod
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
