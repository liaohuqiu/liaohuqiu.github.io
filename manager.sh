#!/bin/bash

set -e

prj_path=$(cd $(dirname $0); pwd -P)
SCRIPTFILE=`basename $0`

source $prj_path/base.sh

app_image=liaohuqiu/blog-jekyll
app_fe_image=liaohuqiu/blog-fe
app_container=blog-jekyll
app_fe_container=blog-fe

function build_blog() {
    docker build -t $app_image $prj_path/_docker/blog-jekyll/
}

function build_fe() {
    docker build -t $app_fe_image $prj_path/_fe
    local fe_dir=_fe
    if [ -d "$fe_dir/node_modules" ]; then
        run_cmd "rm $fe_dir/node_modules"
    fi
    run_cmd "ln -sf /opt/node_npm_data/node_modules $fe_dir/"
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

function stop_blog() {
    stop_container $app_container
}

function stop_fe() {
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

function build() {
    run_blog_container 'jekyll build -w'
}

function help() {
	cat <<-EOF
    
    Usage: manager [options]

	    Valid options are:

            build_blog
            build                   build blog
            into_blog
            stop_blog

            build_fe
            fe_build
            fe_build_prod
            into_fe
            stop_fe

            -h                      show this help message and exit

EOF
}

action=${1:-help}
ALL_COMMANDS="build_blog build into_blog stop_blog build_fe fe_build fe_build_prod into_fe stop_fe"
list_contains ALL_COMMANDS "$action" || action=help
$action "$@"
