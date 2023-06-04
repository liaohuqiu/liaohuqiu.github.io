---
layout: post_wide
permalink: /cn/posts/ssh-public-key-auto-login/
title: "ssh public key认证免密码登录"
description: "利用ssh 公钥认证实现免密码登录服务器"
keywords:   "ssh-keygen, ssh public key, 免登录"
category: blog
---

ssh 登录可以使用公钥认证(ssh public key authentication)。

将客户端机器的ssh public key添加到服务器的 `~/.ssh/authorized_keys` 文件中，可实现ssh的免密码登录。

这样做使得登录服务器更加安全和快捷。


### 客户端生成公钥和私钥

生成一个名为test的公钥和私钥对，密码留空不输入。具体的说明请看这里: [ssh-keygen 基本用法](http://www.liaohuqiu.com/cn/posts/ssh-keygen-abc/)

```
[huqiu@101 ~]$ cd .ssh/
[huqiu@101 .ssh]$ ssh-keygen -t rsa -f test -C "test-key"
Generating public/private rsa key pair.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
```

查看公钥内容

```
[huqiu@101 .ssh]$ cat test.pub
ssh-rsa
AAAAB3NzaC1yc2EAAAABIwAAAQEAogyXOlD77fWF0bTm0r2HrRf8SKPKWjSv4pZKPZfBHOSZI8B0EDGr5/dpsMCPHUcZBt9v5BgJvLao/znBabap6TWt1yuStDh2rnzXY5uTFah0AiMlnQ7DhjkcctdLfLErz1V2jFTXEC2oGOanLoObpHV+LyeXkn/+i0VekT3QiULSkpzK/gsCtaLmaHLbGxv4GGGAoHtTZrfw09hGo47AeiyxzczcBa7TPXSATVPtCStWk+jzMcIyTyxcE7ORIsClN5xNLnbXiEQF5jOcP0qbjAmOH256E565VFh2WC8srjadfUm6jZLEiE5w7lp2/3rRynAsnF0zjEONE9aPUPhiNw==
test-key
```

### 配置公钥到服务器

将公钥内容添加到服务器的`~/.ssh/authorized_keys` 文件中.


### alias 实现命令快速登陆

做好配置之后，通过ssh可以直接登录了。对经常登录的服务器，可以将ssh登录命令的alias加到 `~/.bash_profile`文件中。

```bash
$ cat ~/.bash_profile | grep 101
alias to-101='ssh huqiu@192.168.154.101'
```

登录的时候:

```bash
$ to-101
```

### 无法登录一般的原因

*   客户端的私钥和公钥文件位置必须位于 `~/.ssh` 下。

*   确保双方 ~/.ssh 目录，父目录，公钥私钥，`authorized_keys` 文件的权限对当前用户至少要有执行权限，对其他用户最多只能有执行权限。

    **注意git登录，要求对公钥和私钥以及config文件，其他用户不能有任何权限。**

*   服务器端 `~/.ssh/authorized_keys` 文件名确保没错 :).


### ssh-copy-id

`ssh-copy-id` 是一个小脚本，你可以用这个小脚本完成以上工作。这个脚本在linux系统上一般都有。
