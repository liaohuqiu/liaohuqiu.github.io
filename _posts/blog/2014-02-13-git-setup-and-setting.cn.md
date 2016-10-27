---
layout: post_wide
title: "命令行下的git配置问题: 多个 sshkey, 多个用户身份, git alias"
description:  'git 使用多个 sshkey；git 实用设置'
tag:
    - git
category: blog
---

##ssh key
#####生成sshkey
```
cd ~/.ssh/
ssh-keygen -t rsa -C "changeme@xxx.com" -f filename
```
如果没有指定 `f` 选项或者 `f` 选项为空，生成的私钥和公钥为: `id_rsa`, `id_rsa.pub`.

#####添加 sshkey
    ssh-add ~/.ssh/xxx

#####列出所有的 sshkey
    ssh-add -l

#####执行 `ssh-add` 可能会遇到的问题:
<p class="alert alert-error">Could not open a connection to your authentication agent.</p>

解决办法:
   
    eval `ssh-agent -s`

#####机器重启又得重新添加 sshkey，如何永久添加 sshkey
把 sshkey 私钥的路径加入到 `~/.ssh/config`, 如下：

```
$ vim ~/.ssh/config

IdentityFile ~/.ssh/gitHubKey
IdentityFile ~/.ssh/xxx
```

##git config
#####全局配置和项目配置

全局配置信息在: `~/.gitconfig`。

项目配置在项目目录下的： `./.git/config`。

`git config --global` 操作全局配置, 不带 `--global` 选项的话，会尝试相对于当前目录的： `./git/config`, 找不到的话，报错。

#####为各个项目单独配置`user.name` 和 `user.email`

你可能会在不同的几个项目中工作，各个项目的用户名可能不同，为了保证日志的准确性和提交时无误，最好对各个项目设置 `user.name` 和 `user.email`


```
# for global setting
git config --global user.name xxx
git config --global user.email xxx@xxx.com

# for repository
git config user.name xxxx
git config user.email xxxx@xxx.com
```

##git alias

使用快捷命令能带来很方便，输入命令更加快速，`git lg` 这个短命令配置，将日志图形化方式展现：


```
#git st => git status
git config --global alias.st 'status'

#git co => git checkout
git config --global alias.co 'checkout'

#git lg to view commit log like network graph
git config --global alias.lg "log --all --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%ci) %C(bold blue)<%an>%Creset' --abbrev-commit"
```
