---
layout: post
title: Install jekyll in CentOS
description: A simple guide about installing jekyll in CentOS.
category: blog
---
<h2> {{ page.title }} </h2>

### first you need Ruby & RubyGems ###
`
sudo yum install -y ruby ruby-devel rubygems
`

### then install jekyll via gem ###
`
sudo gem install jekyll
`
### you will need rdiscount to parse markdown format file###
`sudo gem install rdiscount`

now, the `jekyll` envioment has been intalled successfully;
You can entry the site directory, starup the site

    cd .../site_diretory

    jekyll server --watch

Jekyll will server at port: 4000.


<p> {{ page.date | date_to_string }} </p>
