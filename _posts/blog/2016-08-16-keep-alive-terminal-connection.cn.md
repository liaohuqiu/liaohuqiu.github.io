---
layout: post_wide
title: "命令行终端保持连接"
description: "不要使用 iTerm2 的 Send ASCII code when idle"
category: blog
---

### 服务器希望断开闲置连接

为了控制 ssh 的连接数，服务器希望断开一段时间无操作的连接，可在 `/etc/ssh/sshd_config` 中配置：

```
# Disable TCPKeepAlive and use ClientAliveInterval instead to prevent TCP Spoofing attacks
TCPKeepAlive no
ClientAliveInterval 60
ClientAliveCountMax 3
```

如在指定时间内没收到客户端响应，连接断开。

### 客户端希望保持连接

如果你正在不同的服务器上，开了好几个窗口，分别切换到不同的目录下，机械键盘敲得啪啪作响。这个时候，同事过来讨论问题，讨论完后，你喝了口水，看了看屏幕，恢复了思路，手指重回键盘，开始继续敲入熟悉的命令，结果：

```
Write failed broken pipe
```

**看来，你需要重新连接了**。

##### iTerm2

iTerm2 中有一个选项： `When idle, send ASCII code 0 every 10 seconds`，其中，ASCII code 和时间可指定。

通过这个配置，可以达到保持连接的目的，但同时也带来一些副作用，比如：

* 一些命令行输出中会有不期待出现的字符；
* 或者，**VI / Vim 中会插入一些不想要的内容**。

##### 正确的做法

正确的做法是，通过配置 `ServerAliveInterval` 来实现，在 `~/.ssh/config` 中加入：

```
ServerAliveInterval=1
```

数值根据实际情况做调整。

当然，各个服务器的配置不一样，你也可以做差异化的配置，以减少不必要的发包：

```
Host *hostname.com
   ServerAliveInterval 60
```

另外，如果你是第一次配置 `~/.ssh/config`，请注意该文件的权限，否则配置将不起作用：

```
chmod 600 ~/.ssh/config
```

好了，这样问题就完美解决了，**Enjoy!**
