---
layout: post_wide
title: "ssh-agent 转发"
description: ""
keywords:   ""
category: blog
---

1. 你需要在多个服务器之间工作，通过 ssh key，你可以从本机登录这几个服务器。你登录到一个其中一个服务器 A，你想从 A 到另一个服务器 B，但服务器 B 上没有 A 的公钥，无法直接从 A 登录到 B。

2. 你本机使用 ssh key 访问 GitHub 或者其他基于 ssh 认证的服务器，比如 Gitlab。你在本地提交代码，你可以登录服务器，你想在服务器上更新代码。

这样的场景，可以使用 ssh-agent。

1. ssh 登录时，加入 `-A` 选项，开启转发。你可以通过设置 `alias ssh='ssh -A'` 来实现；

2. 启动 ssh-agent，并通过 ssh-add 加入要转发的 key。通过 `ssh-add -l` 查看有哪些 key 已经加入。

    **key 的数量不能过多，ssh 会依次尝试使用这里的每一个 key，如果 key 数量过多，会达到最大尝试次数，认证失败。**

你可直接使用将以下的脚本，加入到你的 ~/.bash_profile 中，在 `add_ssh_keys` 这个函数中，加入你要转发的 key，重新载入 ~/.bash_profile 即可。

```bash
function add_ssh_keys() {
    # Will load ~/.ssh/id_rsa
    /usr/bin/ssh-add
    # You also can add the other keys here
    # For example: /usr/bin/ssh-add
}

SSH_ENV="$HOME/.ssh/environment"
function _start_agent {
    echo "Initialising new SSH agent..."
    /usr/bin/ssh-agent | sed 's/^echo/#echo/' > "${SSH_ENV}"
    echo succeeded
    chmod 600 "${SSH_ENV}"
    . "${SSH_ENV}" > /dev/null
    add_ssh_keys
}

function start_ssh_agent() {
    # Source SSH settings, if applicable
    if [ -f "${SSH_ENV}" ]; then
        . "${SSH_ENV}" > /dev/null
        #ps ${SSH_AGENT_PID} doesn't work under cywgin
        ps -ef | grep ${SSH_AGENT_PID} | grep ssh-agent$ > /dev/null || {
            _start_agent;
        }
    else
        _start_agent;
    fi
}

function set_alias() {
    alias ll='ls -l'
    alias ssh='ssh -A'
}

start_ssh_agent
set_alias
```

> ssh-agent 有风险，使用使用谨慎。

> https://heipei.github.io/2015/02/26/SSH-Agent-Forwarding-considered-harmful/

> http://rabexc.org/posts/pitfalls-of-ssh-agents
