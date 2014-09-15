---
layout: post_wide
title: "ssh-keygen 基本用法"
description: "介绍ssh-kengen的生成密钥的基本用法"
category: blog
---

在用户目录的home目录下，有一个`.ssh`的目录，和当前用户ssh配置认证相关的文件，几乎都在这个目录下。

> 使用 `ssh-keygen` 时，请先进入到 `~/.ssh` 目录，不存在的话，请先创建。并且保证 `~/.ssh` 以及所有父目录的权限不能大于 `700`

###生成的文件名和文件位置

使用 `ssh-kengen` 会在~/.ssh/目录下生成两个文件，不指定文件名和密钥类型的时候，默认生成的两个文件是：

*   `id_rsa`
*   `id_rsa.pub`

第一个是私钥文件，第二个是公钥文件。

生成ssh key的时候，可以通过 `-f` 选项指定生成文件的文件名，如下:

```bash
$ ssh-keygen -t rsa -f test -C "test key"
```

结果是:

```bash
[huqiu@101 .ssh]$ ll test*
-rw------- 1 huqiu huqiu 1675 Sep 15 13:24 test
-rw-r--r-- 1 huqiu huqiu  390 Sep 15 13:24 test.pub
```

上面`-C`选项是公钥文件最后的备注:

```bash
[huqiu@101 .ssh]$ cat test.pub
ssh-rsa
AAAAB3NzaC1yc2EAAAABIwAAAQEAlgjiMw7AskxbvpQY9rmZPQxQBzh9laxFvbaini2EgmQkNsXBA9WJOXn2YBJauoiVsdUKBWA97avjsobrTxsCYvFr1yQQvTfTlbqlqGNIhQc/3HjTl2pIkClpDWvBrRN+jpyESS4MNbfOL1qjT4c/QhGvj6U6HrN6kUyn58oyyJpTzOLG74AZELJ2Led57QvTw1yJXZuAMWioR0A3BGd25fdocLX3ebux6ya8AsloOVYfsAqGlggrARe6FXjLfMH4a/nxaAdiDYVXU/Vr1ybK9P7SfyEDGJi3JtgiPUlA6vPxUCE+9IJPQaqqeqCGzrJ6G/XO7om1v9YLLG/H/ZN2tQ== test key
```
