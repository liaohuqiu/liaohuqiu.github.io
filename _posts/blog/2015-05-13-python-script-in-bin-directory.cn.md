---
layout: post_wide
permalink: /cn/posts/python-script-in-bin-directory
title: "通过 shell 执行 python 报错: No such file or directory"
description: ""
category: blog
---

#### 问题

有一个 python 的小脚本 [keep-running](https://github.com/liaohuqiu/keep-running)，是用来实现守护进程的，当进程退出之后，会重新启动进程。

这是一个工具脚本，发布到了Pypi: https://pypi.python.org/pypi/keep-running ，安装时只要一个命令：

```
pip install keep-running
```

安装之后，这个脚本会拷贝到 `/usr//bin`。我们期待安装之后，可以通过命令行运行：

```
[huqiu@101 android-gems-middleware]$ keep-running
```

当然，为了可以直接运行，需要在脚本头部加上这样一段，这个是基础知识了：

```
#!/usr/bin/env python
```

实际上，运行之后：

```
[huqiu@101 android-gems-middleware]$ keep-running
: No such file or directory
```

但是可以通过 python 执行：

```
[huqiu@101 android-gems-middleware]$ python keep-running
```

#### 原因

原因是：该脚本文件格式是 dos 格式 而非 unix 格式。

dos格式下，换行符是 CRLF 的问题，使得第一行变成了（CR 的 ascii 码是 015）：

```
#!/usr/bin/env python\015
```

修改成 unix 格式就好了。我刚发布了 [1.0.0](https://github.com/liaohuqiu/keep-running/releases/tag/1.0.0) 解决了这个问题。

#### 修改方法

在 vim 中，查看文件格式，并设置，保存即可

查看

```
:set ff
```

设置

```
:set ff=unix
```
