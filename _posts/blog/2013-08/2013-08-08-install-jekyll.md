---
layout: post_wide
title: Install jekyll in CentOS
description: A simple guide about installing jekyll in CentOS.
category: blog
---
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


I created a repository in gitbub, [centos setup], it contains some intallation scripts, inlcuding jekyll,  you can use the installation script to install.

[centos setup]:    https://github.com/liaohuqiu/centos_setup "centos setup"
