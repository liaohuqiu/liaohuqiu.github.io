---
layout: post_wide
title: "gitlab 启用注册"
description: ""
category: blog
---

gitlab 默认安装是没有注册入口的。

如果要开启注册，需要修改:

```
vim /opt/gitlab/embedded/service/gitlab-rails/config/gitlab.yml
```

设置 `signup_enabled=true`，随后重启。

```
gitlab-ctl restart
```

重启之后，成功生成socket文件，如果不是用内置的nginx服务器，注意文件权限是否匹配。

```
var/opt/gitlab/gitlab-rails/tmp/sockets/gitlab.socket
```
