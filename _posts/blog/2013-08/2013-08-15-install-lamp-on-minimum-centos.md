---
layout: post
title: Install LAMP enviroment on a minimum CentOS
description: A simple guide about installing the LAMP enviroment on a mininum CentOS
category: blog
---

<h2> {{ page.title }} </h2>

I install my system in a virtual machine (Vamre workstation 7), the version I install is CentOS 6.4 64bit.

After the mininum intallation, there is no network, neither the basic software below:

    vim
    wget
    unzip

###set up network

We should setup network first:

The system connect to the host by NAT network. I will use a static IP address: `192.168.154.101`

    vi /etc/sysconfig/network-scripts/ifcfg-eth0 

You will see the config like below:

    DEVICE=eth0
    HWADDR=00:0C:29:C2:A9:5D
    TYPE=Ethernet
    UUID=c652bfb6-a4fd-422c-98b8-a5a42905b971
    ONBOOT=no
    NM_CONTROLLED=yes
    BOOTPROTO=dhcp

You should change the config accroding to your situaion. I use the config blow:

    DEVICE=eth0
    HWADDR=00:0C:29:C2:A9:5D
    TYPE=Ethernet
    UUID=c652bfb6-a4fd-422c-98b8-a5a42905b971
    #ONBOOT=no
    #NM_CONTROLLED=yes
    #BOOTPROTO=dhcp
    
    ONBOOT=yes
    NM_CONTROLLED=no
    BOOTPROTO=static
    
    IPADDR=192.168.154.101
    GATEWAY=192.168.154.2
    NETMASK=255.255.255.0
    DNS1=192.168.154.2
    PEERDNS=yes

More information about the network config you can [turn to here](http://www.centos.org/docs/4/html/rhel-rg-en-4/s1-networkscripts-interfaces.html).

After you change the config, bring up the `Ethernet Interface`, `eth0` for example, which You modified the config just now.

    ifup eth0

Then restart the network service:

    service network restart.

OK, the network is set up by far. You can test it by:
    
    ping google.com


### setup 

    https://raw.github.com/liaohuqiu/centos_setup/master/setup.sh
