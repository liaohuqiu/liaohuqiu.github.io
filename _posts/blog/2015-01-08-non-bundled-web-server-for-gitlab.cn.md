---
layout: post_wide
permalink: /cn/posts/non-bundled-web-server-for-gitlab
title: "gitlab 使用现有 nginx 服务器"
description: ""
category: blog
---

gitlab 安装自带 nginx，如果想利用原有 nginx，可按如下操作：

> 8.0 版本 socket 文件位置有变动，感谢评论区的同学。

* nginx 增加虚拟主机配置

    ```
    # gitlab socket 文件地址
    upstream gitlab {
      # 7.x 版本在此位置
      # server unix:/var/opt/gitlab/gitlab-rails/tmp/sockets/gitlab.socket;
      # 8.0 位置
      server unix://var/opt/gitlab/gitlab-rails/sockets/gitlab.socket;
    }
    
    
    server {
      listen *:80;
    
      server_name gitlab.liaohuqiu.com;   # 请修改为你的域名
    
      server_tokens off;     # don't show the version number, a security best practice
      root /opt/gitlab/embedded/service/gitlab-rails/public;
    
    
      # Increase this if you want to upload large attachments
      # Or if you want to accept large git objects over http
      client_max_body_size 250m;
    
      # individual nginx logs for this gitlab vhost
      access_log  /var/log/gitlab/nginx/gitlab_access.log;
      error_log   /var/log/gitlab/nginx/gitlab_error.log;
    
      location / {
        # serve static files from defined root folder;.
        # @gitlab is a named location for the upstream fallback, see below
        try_files $uri $uri/index.html $uri.html @gitlab;
      }
    
      # if a file, which is not found in the root folder is requested,
      # then the proxy pass the request to the upsteam (gitlab unicorn)
      location @gitlab {
        # If you use https make sure you disable gzip compression 
        # to be safe against BREACH attack
        
    
        proxy_read_timeout 300; # Some requests take more than 30 seconds.
        proxy_connect_timeout 300; # Some requests take more than 30 seconds.
        proxy_redirect     off;
    
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   Host              $http_host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Frame-Options   SAMEORIGIN;
    
        proxy_pass http://gitlab;
      }
    
      # Enable gzip compression as per rails guide: http://guides.rubyonrails.org/asset_pipeline.html#gzip-compression
      # WARNING: If you are using relative urls do remove the block below
      # See config/application.rb under "Relative url support" for the list of
      # other files that need to be changed for relative url support
      location ~ ^/(assets)/  {
        root /opt/gitlab/embedded/service/gitlab-rails/public;
        # gzip_static on; # to serve pre-gzipped version
        expires max;
        add_header Cache-Control public;
      }
    
      error_page 502 /502.html;
    }
    ```

*  禁用自带 nginx

    ```
    vim /etc/gitlab/gitlab.rb
    ```
    
    加入
    
    ```
    nginx['enable'] = false
    ```
    
* 重启 nginx, 重启gitlab

    ```
    sudo /usr/local/nginx/sbin/nginx -s reload
    sudo gitlab-ctl reconfigure
    ```

* 权限配置
    
    访问会报502。原本是 nginx 用户无法访问gitlab用户的 socket 文件，用户权限配置，因人而异。粗暴地:

    ```
    sudo chmod -R o+x /var/opt/gitlab/gitlab-rails
    ```
