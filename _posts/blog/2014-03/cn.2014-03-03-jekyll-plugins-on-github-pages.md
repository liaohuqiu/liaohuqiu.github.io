---
layout: post_wide
title: "Jekyll 插件和Github Pages"
description: "Github Pages运行在安全模式下，大部分的插件是不能使用的。如何可以在使用各种插件的同时，又可以使用Github Pages的托管服务？"
keywords:   "Jekyll plugins, not working Github pages"
category: blog
---

####First of all:

Github Pages works in `safe mode` in which most of the Jekyll plugins can not work.

So ***we can not use Jekyll plugins on github pages***, even you have marked it to `safe`. If you have tried, you will know.

**We must use the other way:**

> **Build the site content locally, then push the content to Github.**

---
###Solution

If we do not use plugins, we only need a branch:

*   `gh-pages` for project page.

*   or `master` for Person or Organization Page. 

We push the origin document, Github will build them into `Site Content` into the destiantion directory.

Now we need another branch for the origin destiantion, for example: `docs`.

1. Build locally

    We build the site content in `docs` branch into the description directory, for example, `_site`.
    
    ```bash
    git checkout docs
    # some other code

    # commit
    git commit -a -m 'udpate content'

    # build
    jekyll build
    ```
    
    Please remember add `_site` to `.gitignore` and commit the changes in `docs`.

2.  Push 

    Checkout `ph-pages` or `master`, remove the old content, copy the content in `_site` to the root directory of the repositor.

    ```
    git checkout gh-pages
    ls | grep -v _site|xargs rm -rf
    cp -r _site/* .
    rm -rf _site/
    touch .nojekyll

    # commit
    git commit -a -m 'update content'

    git push --all origin
    ```

3.  The take away:

    [publish-gh-pages.sh](https://github.com/liaohuqiu/work-anywhere/blob/master/tools/publish-gh-pages.sh)
 
    ```bash
    #!/bin/bash
    
    function exe_cmd() {
        echo $1
        eval $1
    }
    
    if [ $# -lt 1 ]; then
        echo "Usage: sh $0 [ gh-pages | master ]"
        exit
    fi
    
    branch=$1
    if [ -z "$branch" ] || [ "$branch" != "master" ]; then
        branch='gh-pages'
    fi
    
    exe_cmd "jekyll build"
    if [ ! -d '_site' ];then
        echo "not content to be published"
        exit
    fi
    
    exe_cmd "git checkout $branch"
    error_code=$?
    if [ $error_code != 0 ];then
        echo 'Switch branch fail.'
        exit
    else
        ls | grep -v _site|xargs rm -rf
        exe_cmd "cp -r _site/* ."
        exe_cmd "rm -rf _site/"
        exe_cmd "touch .nojekyll"
    fi
    ```
