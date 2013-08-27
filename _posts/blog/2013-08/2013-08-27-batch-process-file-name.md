---
layout: post
title:  batch process file name
description: use find & sed to batch process file name
category: blog
---
<h2> {{ page.title }} </h2>

    find . -type f |sed 's/\(.*\)\.html/svn mv "\1.html" "\1.php"/' |sh

the command pass to shell by pipe is:

    svn mv "./cp_m/list/search_content.html" "./cp_m/list/search_content.php"
    svn mv "./cp_m/list/search_list.html" "./cp_m/list/search_list.php"
    svn mv "./cp_m/list/list_item.html" "./cp_m/list/list_item.php"
    svn mv "./cp_m/base/tail.html" "./cp_m/base/tail.php"
    svn mv "./cp_m/base/head.html" "./cp_m/base/head.php"
