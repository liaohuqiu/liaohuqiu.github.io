---
layout: post_wide
title: "红杏的公益代理"
description: ""
category: blog
---

红杏开放了公益代理，专门为开发人员服务。

从今以后更新android sdk，使用Android Studio都会顺利很多。为红杏点赞。同时郑重推荐大家使用红杏。

使用红杏，让获取知识变得不那么困难和艰辛。使用及其方便，节约宝贵时间，创造更多价值。

这个是我的推广链接: http://honx.in/i/VHRiboIaAxADyQus, 你通过这个链接安装购买1个月以上的服务，你我都将获赠10天。

---

### 关于科学上网和资料搜索

1.  使用英文进行资料检索。

    英语是工具，如果你想有更广阔的天地，一定要掌握。

    没有谁一出生就会英语。不会就练习。持之以恒。

    需要我跟你讲一个李白遇到的那个大娘铁杵磨成针的故事么。

1.  对于技术人员来说，建议使用google进行搜索。

    百度的开发工程师都用google查技术资料。嗯。是这样的。

1.  国内的论坛和贴吧，寻找问题和答案较难。需要提问，建议在stackoverflow上提问。

    多在stackoverflow这样的技术社区活跃你将受益匪浅。对了，这个是[我在stackoverflow的profile](http://stackoverflow.com/users/2446397/srain) 。

    **千万不要在qq群提问， 但是可以对某一问题进行交流。除非是专业客服群。** 

### 关于红杏

现在我有2个linode的vps一个在日本，一个在亚特兰大。在使用[红杏][]之前，我一直用他们。

后来用了[红杏][]，但是遗憾的是，[红杏][]只能在chrome使用。虽然这对我来说足够了。但是遇到更新android sdk之类的时候，还是需要借助vpn或者代理。

但是红杏实在是太方便了。我再也不用折腾那些代理配置，整理添加网站名单了。这为我节省出来很多可观的时间。

但是除了推荐给我身边的几个朋友使用，我并没有我大范围推荐给大家使用。

直到[红杏][]推出了公益版: http://blog.honx.in/dev-only ，这是一个http代理，可免费使用，专供开发人员使用。

使用这个代理，你可以很顺畅地做很多事情了:

1. 更新android sdk
2. 顺畅使用Android Studio
3. github push / fetch
4. 等等等等，其他的[更多](http://blog.honx.in/dev-only/)

**真是业界良心**。得知这个消息之后，我往我另外一个账号上充了一年的费用，以示支持。对于良心企业，能做的也只有这么多。

### 郑重推荐使用红杏

在此，我郑重推荐大家使用红杏。节省你的时间，让获取知识的过程变得不那么艰难。

目前[红杏][]按月付费是10元每月。这个已经是低得不能再低的资费。我不知道现在10块钱还可以做些什么事情: 一顿饭？一碗饺子?

每月10元，打开所有原来打不开的网页。[红杏][] 支持2个终端同时在线。如果你有两个电脑，你可以共用一个账号。当然，也可以两人共享。

> 我弟弟还在学校读博，有很强的这个需求，之前都是用我的vpn的。我跟他推荐[红杏][]，说你可以用我的账号。他说不用，自己买，没多少钱，也算是对良心企业的一个支持，做事真体面，这点特别像我。

每个人访问的站点需求不一样，每个人网络情况也不一样，一份大而全的白名单并不能很好解决问题，这也是我使用`Proxy SwitchySharp`遇到的问题。

而[红杏][]对我最大的好处是可以轻松管理需要代理的域名，对于不可访问的域名，智能提示。我不再需要打开chrome的控制台，看到底是哪些域名没法访问了。

我自己有vps，但我已经厌倦管理名单那样琐碎，耗时的事情。使用工具在于节省时间，而不是投入更多时间。

这也就是为什么我没有推荐vpn类或者shadowsocks类产品的原因了。

>  苦苦寻找免费的代理，修改host？那花去的时间，你可以创造更多价值。

### 如何使用红杏的公益代理

公益代理为: http://hx.gy:1080。注意: hostname为`hx.py`, 不要带上`http://`。

1.  github加速

    ```
    git config --global http.proxy http://hx.gy:1080
    ```

    如果要移除, 编辑`~/.gitconfig`

2.  命令行更新android sdk

    ```
    ./android list sdk -u --proxy-host=hx.gy --proxy-port=1080
    ```

3.  GUI更新SDK
    
    打开SDK Manager的设置页, mac 没有入口，需要通过 `cmd + ,` 打开。

    <div class='row'>
        <div class='col-md-6 col-md-offset-3'>
            <img src='http://srain-blog.qiniudn.com/red-apricot/red-apricot-sdk-manager-set-proxy.png' width='100%'/>
        </div>
    </div>

4.  给Android Stuido / Intellij IDEA 配置代理，这样下载gradle或者其他依赖就顺利了。

    打开Preference页面，找到`HTTP Proxy`, 选择`Manual proxy configuration`。 
    
    Host Name: `hx.gy`, Port Number: 1080.

    <div class='row'>
        <div class='col-md-8 col-md-offset-2'>
            <img src='http://srain-blog.qiniudn.com/red-apricot/red-apricot-android-stuido-set-proxy.png' width='100%'/>
        </div>
    </div>

---
[红杏]: http://honx.in/i/VHRiboIaAxADyQus
