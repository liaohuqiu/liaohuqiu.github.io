---
layout: post_wide
title: "setup log center"
description: "some information about how to setting up a log center"
keywords:   "syslog syslogd syslog-ng rsyslog"
category: blog
---

In *inux System, there are some log tools, for example: syslog, rsyslog, syslog-ng, etc..

In our program we can record log to syslog, for example in php:

```php
<?php
$priority = LOG_NOTICE;
$ident = 'srain';

$message = 'some messages@' . date('Y-m-d H:i:s');
openlog($ident, LOG_PID, LOG_LOCAL6);
syslog($priority, $message);
closelog();
```

When we have more than one webserver which will record log, we need a log center to keep all of the log.


###Forwarding 

* syslog

    ```
    *.local6    10.11.2.13  # the port is 514 and using the UDP protocal.
    ```

* rsyslog

    ```
    *.local6    @@10.11.2.13:514    # udp
    *.local6    @10.11.2.13:514     # tcp more reliable than udp
    ```

* syslog-ng

    ```
    description d_loghost { udp("10.11.2.13" port(514)};

    log { source(s_sys); description(d_loghost)};
    ```

###Reciving

*   rsyslog

    ```
    # for udp reception
    $ModLoad imudp
    $UDPServerRun 514
    
    # for tcp reception
    $ModLoad imtcp
    $InputTCPServerRun 514
    ```

*   syslog-ng

    ```
    destination df_wrt0 {
        #  keep log into diffrent files
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

### Preformance

I prefer syslog/rsyslog + syslog-ng. It will be more stable and easy to config.

There were more than 2000 clients to send log to a log center.

