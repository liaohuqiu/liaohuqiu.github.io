---
layout: post_wide
title: Some tips for git setup and git config
description:  'some tips related to ssh key; git global config and repository
config; git alias'
tag:
    - git
category: blog
---

#the ssh key
#####generate ssh key
```
cd ~/.ssh/
ssh-keygen -t rsa -C "changeme@xxx.com" -f filename
```
If the options `f` is not input, the file name of the public/pirvate rsa key pair files will be: id_rsa, id_rsa.pub.

#####add ssh key
    ssh-add ~/.ssh/xxx

#####list all added ssh key
    ssh-add -l

#####you may run into this error when try `ssh-add`:
<p class="alert alert-error">Could not open a connection to your authentication agent.</p>
   
    eval `ssh-agent -s`

#####add ssh key permanently
Add the key path to `~/.ssh/config`

```
$ vim ~/.ssh/config

IdentityFile ~/.ssh/gitHubKey
IdentityFile ~/.ssh/xxx
```

#git config
#####global config & repository config

The global setting is stored in `~/.gitconfig`

The config of repository is stored in `./.git/config`, in the repository directory.

`git config --global` will use global config, without `--global` options will use try to use the config file `./git/config` in current directory.

#####config user name & user email for every repository

You may work with multiple repositories, so it is a good practice to config user information for every repository.

```
# for global setting
git config --global user.name xxx
git config --global user.email xxx@xxx.com

# for repository
git config user.name xxxx
git config user.email xxxx@xxx.com
```

#####git alias

Setup alias for convenience.

```
#git st => git status
git config --global alias.st 'status'

#git co => git checkout
git config --global alias.co 'checkout'

#git lg to view commit log like network graph
git config --global alias.lg "log --all --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%ci) %C(bold blue)<%an>%Creset' --abbrev-commit"

#... 
# whatever you like
```
