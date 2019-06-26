---
layout: post_wide
permalink: /cn/posts/setup-web-prorxy-by-ssh-tunnel
title: "简单的ssh隧道实现代理上网"
description: ""
category: blog
---

现在连google也不能访问了。

如果你有国外的服务器或者vps，(现在亚马逊云主机第一年免费)，你可以自己搭建代理服务。

但是vpn (pptp / openvpn) 架设和管理还是相对复杂的, 部分运营商还有限制。

除非你有手机用代理等需要，一定要vpn，如果是web上网的话用ssh隧道代理本地端口，简单，效果好。

#### 本地代理

```bash
ssh -N -D 127.0.0.1:端口 用户名@服务器
```

比如:

```bash
ssh -N -D 127.0.0.1:3128 xxx@xx.x.xx.xx
```

如果是window，可用用cgywin模拟命令行，后者putty等软件实现。


#### 设置

chrome 为例, 安装一个代理扩展，比如[Proxy SwitchySharp](https://chrome.google.com/webstore/detail/proxy-switchysharp/dpplabbmogkhghncfbfdeeokoefdjegm?)

安装之后:

<div class='row'>
    <div class='col-md-offset-4 col-md-4'>
        <img src='/assets/img/proxy-switchy-sharp.png'/>
    </div>
</div>

配置代理

<div class='row'>
    <div class='col-md-offset-2 col-md-8'>
        <img src='/assets/img/proxy-set-socks-v5.png'/>
    </div>
</div>

设置自动代理, 可以使用我的规则文件: [switch-sharp-rule](https://github.com/liaohuqiu/proxy/blob/master/switch-sharp-rule)

<div class='row'>
    <div class='col-md-offset-2 col-md-8'>
        <img src='/assets/img/proxy-auto-swith-online-list.png'/>
    </div>
</div>







