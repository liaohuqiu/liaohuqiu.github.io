---
layout: post_wide
permalink: /cn/posts/git-global-hooks/
title: git 全局钩子
description: git全局钩子的配置
category: blog
---


###钩子文件在项目目录下
[ git 的钩子](http://git-scm.com/book/en/Customizing-Git-Git-Hooks)放在 git 项目下的 `.git/hooks` 目录。

```bash
ls -l .git/hooks
```

如果我们所有项目都需要一个通用的钩子，那么我们需要在所有的项目中都放置钩子文件。挨个复制显然不是一个可行的方案。

###模板目录
我们可用模板目录来解决这个问题。

在 `git init` 或者 `git clone`时，如果指定有模板目录，会使用拷贝模板目录下的文件到 `.git/` 目录下。

```bash
git init --template "path-to-template-dir"
git clone --template "path-to-template-dir"
```

好了，那么解决方案就是：把统一的钩子文件放到模板目录，然后在 `git init` / `git clone` 时候指定模板目录？

不行，这样还是太麻烦了。

###模板目录写入全局配置
模板目录固定在一个地方，我们可以把模板目录写入全局配置。

```
# 定义模板目录，模板目录下的钩子目录
template_dir=$HOME/.git-templates
tempalte_hooks_dir=$template_dir/hooks

# 拷贝全局钩子文件目录到模板目录下
mkdir -p $template_dir
cp -rf $root_dir/sample/git-template/hooks/ $template_dir/

# 修改模板目录下钩子目录权限
chmod -R a+x $tempalte_hooks_dir

# 设置全局模板目录
git config --global init.templatedir $template_dir
```

在 `git init` 或者 `git clone` 时，会自动拷贝钩子文件到项目的钩子目录。
已有项目，执行 `git init` 重新初始化项目即可。

###直接可用的脚本

上面那段脚本，来自我的 github：[https://github.com/liaohuqiu/work-anywhere/blob/master/tools/update-git-config.sh](https://github.com/liaohuqiu/work-anywhere/blob/master/tools/update-git-config.sh)

将你需要的钩子文件放在 `sample/git-templete/hooks`文件夹下即可。
