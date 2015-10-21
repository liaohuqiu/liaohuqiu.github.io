---
layout: post_wide
title: "Nginx proxy_pass: examples for how does nginx proxy_pass map the request"
description: "Some examples for showing how the request URI will be mapped."
keywords: 'proxy_pass nginx, proxy_pass examples, nginx proxypass'
category: blog
---
### 1. about ###

 1. The `proxy_pass` directive sets the address of the proxied server and the URI to which location will be mapped. 

    Here are some examples to show how the request URI will be mapped.
    
    The version of nginx:
    
        nginx version: nginx/1.4.2
    
    The server config:
    
        #server config
        server {
            listen        80;
            server_name   test.com;
        }

### 2. location without regular expression ###
    
 1. If the `proxy_pass` directive is specified without a URI,

        location /app/ {
            proxy_pass      http://192.168.154.102;
        }

        test.com/app/xxxxx =>  http://192.168.154.102/xxxxx

    
 2. If the `proxy_pass` directive is specified with a URI:

        location /app/ {
            proxy_pass      http://192.168.154.102/maped_dir/;
        }

        test.com/app/xxxxx =>  http://192.168.154.102/maped_dir/xxxxx


 3. Forward the requested Host header

    By default, the Host header from the request is not forwarded, but is set based on the proxy_pass statement. To forward the requested Host header, it is necessary to use:

        proxy_set_header Host $host;
    
### 3. location with regular expression ###

1.  If the location is given by regular expression, can not be a URI part in `proxy_pass` directive,  unless there are variables in the directive.

        location  ~ ^/app/(.*)$ {
            #proxy_pass   http://127.0.0.1/some_dir;    #error
            proxy_pass   http://127.0.0.1/some_dir/$1r;    #ok
        }

2. variables in `proxy_pass` directive:

        location ~ ^/app/(.*)$ {
            proxy_pass       http://192.169.154.102:$1;
        }
    
        test.com/app/8081 => http://192.168.154.102:8081

    and:

        location ~ ^/app/(.*)$ {
            proxy_pass       http://192.169.154.102:9999/some_dir/$1;
        }

        test.com/app/request/xxxxx => http://192.168.154.102:9999/some_dir/xxxxx

3.  with a rewrite directive in the location:

    If the rewrite rule is hit, the URI specified in the directive is ignored and the full changed request URI is passed to the server:

        location  /app/ {
            rewrite    ^/app/hit/(.*)$ /hit_page.php?path=$1 break;
            proxy_pass   http://192.168.154.102:9999/some_dir/;
        }

    /app/hit/some/request/?name=xxxxx

    =>  http://192.168.154.102:9999/hit_page.php?path=some/request/&name=xxxxx

    /app/not_hit/some/request/?name=xxxxx  

    => http://192.168.154.102:9999/some_dir/not_hit/some/request/?name=xxxxx

> [`proxy_pass` in nginx wiki](http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass)
