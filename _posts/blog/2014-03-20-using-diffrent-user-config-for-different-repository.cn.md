---
layout: post_wide
permalink: /cn/posts/using-diffrent-user-config-for-different-repository/
title: "git: 提交前强制检查各个项目用户名邮箱设置"
description: "为各个项目单独设置用户名和邮箱，并在提交前强制检查。"
category: blog
---

### 保证提交日志的准确性

在提交时，`user.name`, `user.email`会进入日志。这些信息，是追踪代码变更的关键。

我们公司为了保证这些信息的准确性，在push时，强制检查，如果`user.name`和`user.email`信息不正确，则拒绝push。

**全局配置**

如果我们工作中只涉及一个git服务器，用一个全局配置就可以搞定了：

```bash
git config --global user.name "huqiu.lhq"
git config --global user.email "huqiu.lhq@alibaba-inc.com"
```

###工作在多个git项目

但是我们可能同时工作在多个项目中，公司内部用自有的git管理项目，我们在github上还有自己的项目。

对于使用不同的用户身份，需要设置不用的sshkey，具体的配置可以看这里：[多个sshkey配置](/cn/posts/git-setup-and-setting/)

这个时候，对于`user.name`和`user.email`我们不能采用全局的配置。而是要对各个项目单独配置。

**项目配置**

```bash
git config user.name "huqiu.lhq"
git config user.email "huqiu.lhq@alibaba-inc.com"
```

###忘记了做配置

对于项目配置，有时我们会忘记在`git init`或者`git clone`之后，配置`user.name`以及`user.email`。

如果有全局配置，则使用全局配置。如果没全局配置，报错。

```bash
[huqiu@srain test]$ git ci -a -m 'commit for testing no user.name empty'

*** Please tell me who you are.

Run

git config --global user.email "you@example.com"
git config --global user.name "Your Name"

to set your account's default identity.
Omit --global to set the identity only in this repository.

fatal: empty ident name (for <huqiu@srain.localhost>) not allowed
```

报错能够及时纠正我们的错误，最糟糕的情况是：

*  **没有项目单独配置，提交的时候，自动采用全局配置。在发现问题之后需要对日志进行修复。**

### 强制检查

强制检查可以在服务器端push的时候检查，也可以在客户端进行检查，这里介绍使用`pre-commit</code>钩子进行检查。

全局钩子的配置，可以参见这里: [git全局钩子](http://srain.test.com/cn/posts/git-global-hooks/)

**如何确定配置正确**

1. 确定没有全局配置
2. 确定有项目配置

**pre-commit hook**

```bash
global_email=$(git config --global user.email)
global_name=$(git config --global user.name)

repository_email=$(git config user.email)
repository_name=$(git config user.name)

if [ -z "$repository_email" ] || [ -z "$repository_name" ] || [ -n "$global_email" ] || [ -n "$global_name" ]; then
    # user.email is empty
    echo "ERROR: [pre-commit hook] Aborting commit because user.email or user.name is missing. Configure them for this repository. Make sure not to configure globally."
    exit 1
else  
    # user.email is not empty
    exit 0
fi 
```

### 直接可用的代码

上面谈到的：

*   [pre-commit 的源码](https://github.com/liaohuqiu/work-anywhere/blob/master/sample/git-template/hooks/pre-commit)

自动设置全局钩子的脚本(其中包含了这个强制检查的pre-commit钩子)，并对git做一些易用配置：

*   [update-git-config.sh](https://github.com/liaohuqiu/work-anywhere/blob/master/tools/update-git-config.sh)
