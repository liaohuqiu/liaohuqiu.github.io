#!/bin/bash
function exe_cmd()
{
    echo $1
    eval $1
}
function show_help() 
{
    echo "usage: sh _tools/$0; please run this script in the project root directory"
    exit 1
}

root_dir=`pwd`
if [[ $root_dir == *"/_tools"* ]]; then
    show_help
fi

dest_dir=`readlink -f ../liaohuqiu-master`
if [ ! -d $dest_dir ];then
    echo "Destination directory is not existent: " $dest_dir
    exit
fi

exe_cmd "cd _fe"
exe_cmd "npm run build-prod"
exe_cmd "cd $root_dir"
exe_cmd "jekyll build"
if [ ! -d '_site' ];then
    echo "not content to be published"
    exit
fi

exe_cmd "cd $dest_dir"
exe_cmd "git checkout master"
error_code=$?
if [ $error_code != 0 ];then
    echo 'Switch master fail.'
    exit
else
    ls | grep -v _site|xargs rm -rf
    exe_cmd "rm -rf *"
    exe_cmd "cp -r $root_dir/_site/* ."
    exe_cmd "touch .nojekyll"
fi
