---
layout: post_wide
title: Install jekyll on CentOS
description: A simple guide about installing jekyll on CentOS.
keywords: "Install jekyll in CentOS"
category: blog
---
###Installation script in github


[centos setup in Github], it contains some intallation scripts, inlcuding jekyll,  you can use the installation script to install.

[centos setup in Github]:    https://github.com/liaohuqiu/centos_setup "centos setup"


---
###Manually

First you need Ruby & RubyGems

`
sudo yum install -y ruby ruby-devel rubygems
`

Then install jekyll via gem

`
sudo gem install jekyll
`

You will need rdiscount to parse markdown format file

`sudo gem install rdiscount`

Now, the `jekyll` enviroment has been installed successfully;

You can entry the site directory, start up the site

    cd .../site_diretory

    jekyll server --watch

Jekyll will server at port: 4000.
