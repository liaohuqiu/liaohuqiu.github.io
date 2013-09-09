---
layout: post
title: Setup PPTP
description: setup a vpn server
category: blog
---
<h2> {{ page.title }} </h2>


After a lot of tries, I set up a vpn server on my linode via which I can cross the fucking `GFW`.

Here is a shell script. It is too late tonight, I will reorganize this post in the other day.

    yum install ppp

    wget http://poptop.sourceforge.net/yum/stable/packages/pptpd-1.3.4-2.el6.x86_64.rpm
    rpm -ihv pptpd-1.3.4-2.el6.x86_64.rpm
    rm -rf *.rpm

    rm -rf /etc/pptpd.conf
    rm -rf /etc/ppp
    mkdir -p /etc/ppp

    echo "option /etc/ppp/options.pptpd" >> /etc/pptpd.conf
    echo "localip 10.0.0.1" >> /etc/pptpd.conf
    echo "remoteip 10.0.0.10-100" >> /etc/pptpd.conf

    echo "ms-dns 8.8.8.8" >> /etc/ppp/options.pptpd
    echo "ms-dns 8.8.4.4" >> /etc/ppp/options.pptpd

    pass=`openssl rand 6 -base64`
    if [ "$1" != "" ]
    then pass=$1
    fi
    echo "vpn pptpd ${pass} *" >> /etc/ppp/chap-secrets

    function config_iptables()
    {
        # Reset/Flush iptables
        iptables -F
        iptables -X
        iptables -t nat -F
        iptables -t nat -X
        iptables -t mangle -F
        iptables -t mangle -X
        iptables -P INPUT ACCEPT
        iptables -P FORWARD ACCEPT
        iptables -P OUTPUT ACCEPT
        # Flush end

        iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

        iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE


        iptables -A INPUT -i eth0 -p tcp --dport 1723 -j ACCEPT
        iptables -A INPUT -i eth0 -p gre -j ACCEPT

        # Allow localhost traffic
        iptables -A INPUT -i lo   -m state --state NEW  -j ACCEPT
        iptables -A OUTPUT -o lo   -m state --state NEW  -j ACCEPT

        # Allow server and internal network to go anyway
        iptables -A INPUT  -s 10.0.0.0/24   -m state --state NEW  -j ACCEPT
        iptables -A INPUT  -s 199.101.100.10   -m state --state NEW  -j ACCEPT
        iptables -A OUTPUT  -m state --state NEW  -j ACCEPT

        # Allow ssh
        iptables -A INPUT -p tcp --dport ssh -j ACCEPT

        service iptables save
        service iptables restart
    }

    chkconfig pptpd on
    service pptpd start

    ip=`/sbin/ifconfig eth0 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}'`
    echo "===================================="
    echo " VPN INSTALLATION COMPLETE"
    echo "===================================="
    echo " "
    echo "VPN hostname/ip: ${ip}"
    echo "VPN type: PPTP"
    echo "VPN username: vpn"
    echo "VPN password: ${pass}"
    echo " "


Some reference:

[http://www.photonvps.com/billing/knowledgebase.php?action=displayarticle&id=58](http://www.photonvps.com/billing/knowledgebase.php?action=displayarticle&id=58)
[http://serverfault.com/questions/466030/pptp-iptables-routing-issue](http://serverfault.com/questions/466030/pptp-iptables-routing-issue)
[http://safesrv.net/setup-pptp-and-freeradius-on-centos-5/](http://safesrv.net/setup-pptp-and-freeradius-on-centos-5/)

TODO: iptables
