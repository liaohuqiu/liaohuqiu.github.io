---
layout: post_wide
title: "日志中心：统一日志服务器"
description: "统一日志服务器配置"
keywords:   "syslog syslogd syslog-ng rsyslog"
category: blog
---

在 *iux 系统上，有 syslog, rsyslog, syslog-ng 几种程序记录日志。

我们可以在php中这样记录日志:

```php
<?php
$priority = LOG_NOTICE;
$ident = 'srain';

$message = 'some messages@' . date('Y-m-d H:i:s');
openlog($ident, LOG_PID, LOG_LOCAL6);
syslog($priority, $message);
closelog();
```

我们在各个web前端输出日志。然后把日志统一输出到一个日志服务器上，便于使用。

在产生日志的机器上，我们配置好日志转发，在日志中心服务器，收集这些日志。

可以通过tcp协议和udp协议进行日志转发。

###转发配置

* syslog

    ```
    *.local6    10.11.2.13  # 默认 514 udp转发
    ```

* rsyslog

    ```
    *.local6    @@10.11.2.13:514    # udp
    *.local6    @10.11.2.13:514     # tcp 更稳定
    ```

* syslog-ng

    ```
    description d_loghost { udp("10.11.2.13" port(514)};

    log { source(s_sys); description(d_loghost)};
    ```

###接收配置

*   rsyslog

    ```
    # 接收udp
    $ModLoad imudp
    $UDPServerRun 514
    
    # 接收tcp
    $ModLoad imtcp
    $InputTCPServerRun 514
    ```

*   syslog-ng

    ```
    destination df_wrt0 {
        # 不同的ident 不同的文件
        file("/var/log/$PROGRAM-$YEAR$MONTH$DAY"
                template("$FULLDATE $SOURCEIP-$HOST[$PID]: $MSG\n")
                template_escape(yes)
            );
    };

    source s_net {
        udp(ip(0.0.0.0) port(514));
        tcp(ip(0.0.0.0) port(514));
    };

    log { source(s_net); description(df_wrt0)};
    ```

### 性能

syslog + syslog-ng。曾经有2000+的web往一台日志服务器上汇总。
