---
layout: post_wide
title: 'Fail2Ban: whois is taking up 100% of the cpu'
description: ""
category: blog
---

Today I noticed that one of my linode has been in 100% usage of CPU from May 31.

I login in to it, use `htop` to check what is going on:

<img src='//ww3.sinaimg.cn/large/599e230bjw1f2p5ap0vw6j21yc07ojt2.jpg'/>

As we can seen, whois is taking up most of the cpu, and I've never used this command before.

So I use `ps` to figure out which process started `whois`:

```
[huqiu@*** ~]$ ps -ef | grep whois
root     25775  2649  0 Mar31 ?        00:00:00 sh -c printf %b "Subject: [Fail2Ban] SSH: banned 118.220.255.157 from `uname -n`?Date: `LC_TIME=C date -u +"%a, %d %h %Y %T +0000"`?From: Fail2Ban <fail2ban@example.com>?To: you@example.com\n?Hi,\n?The IP 118.220.255.157 has just been banned by Fail2Ban after?5 attempts against SSH.\n\n?Here is more information about 118.220.255.157:\n?`/usr/bin/whois 118.220.255.157 || echo missing whois program`\n?Regards,\n?Fail2Ban" | /usr/sbin/sendmail -f
fail2ban@example.com you@example.com
root     25776 25775  0 Mar31 ?        00:00:00 sh -c printf %b "Subject: [Fail2Ban] SSH: banned 118.220.255.157 from `uname -n`?Date: `LC_TIME=C date -u +"%a, %d %h %Y %T +0000"`?From: Fail2Ban <fail2ban@example.com>?To: you@example.com\n?Hi,\n?The IP 118.220.255.157 has just been banned by Fail2Ban after?5 attempts against SSH.\n\n?Here is more information about 118.220.255.157:\n?`/usr/bin/whois 118.220.255.157 || echo missing whois program`\n?Regards,\n?Fail2Ban" | /usr/sbin/sendmail -f
fail2ban@example.com you@example.com
root     25782 25776  0 Mar31 ?        00:00:00 sh -c printf %b "Subject: [Fail2Ban] SSH: banned 118.220.255.157 from `uname -n`?Date: `LC_TIME=C date -u +"%a, %d %h %Y %T +0000"`?From: Fail2Ban <fail2ban@example.com>?To: you@example.com\n?Hi,\n?The IP 118.220.255.157 has just been banned by Fail2Ban after?5 attempts against SSH.\n\n?Here is more information about 118.220.255.157:\n?`/usr/bin/whois 118.220.255.157 || echo missing whois program`\n?Regards,\n?Fail2Ban" | /usr/sbin/sendmail -f
fail2ban@example.com you@example.com
root     25783 25782 99 Mar31 ?        7-06:42:01 /usr/bin/whois 118.220.255.157
huqiu    32576 29742  0 03:37 pts/3    00:00:00 grep whois
```

It is very clear that Fail2Ban are trying to collecting some information and send the alarm email. (Ops, I did not config the right email address.)

I kill the process, and everything is working normally. I am search this on Google then I got this link which described the same issue:

http://unix.stackexchange.com/questions/165053/why-would-whois-take-up-100-of-the-cpu
