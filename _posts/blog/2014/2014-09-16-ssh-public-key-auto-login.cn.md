---
layout: post_wide
title: "ssh public key实现免登录"
description: "ssh public key免登录"
category: blog
---

ssh 登录可以使用公钥认证(ssh public key authentication)。将客户端机器的ssh public key添加到服务器的 `~/.ssh/authorized_keys` 文件中，可实现ssh的免密码登录。这样做使得登录服务器更加安全和快捷。
