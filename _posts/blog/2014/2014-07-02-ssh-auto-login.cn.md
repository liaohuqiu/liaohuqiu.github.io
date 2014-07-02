---
layout: post_wide
title: ssh + expect 自动登录服务器
description: "mac下 ssh自动登录"
category: blog
---

secureCRT 记住用户名和密码的功能确实方便，如果你不愿意付费，也不想用破解，你就得另外想一些办法了。

ssh + expect 自动输入密码登录服务器的方式很多人都很熟悉，在mac或者 linux系统用这样的方式登录服务器确实很方便。我将这个方法做了整理，方便大家使用。

在配置好之后，你要登录只需要一个命令即可，比如你有一个服务器，你登录的时候只要：

```bash
$ to-101
```

`to-101` 是你自己设置的一个短命令。

#####下载和安装

工具的地址在这里：https://github.com/liaohuqiu/ssh-auto-login

fork或者下载之后，目录结构是这样的

```bash
ssh-auto-login/
 ├── files
 ├── base.sh
 ├── install.sh
 ├── install_shortcut.sh
```

配置方法：

```bash
source install_shortcut.sh to-101 192.168.154.101 用户名 密码
```

其中:

* to-101 是你自己指定的登录命令

这样直接输入 `to-101` 就可以登录了。

##### 注意

>  配置完后生成一个auto-gen 目录，这里保存着用户名和密码，请注意账号安全。
