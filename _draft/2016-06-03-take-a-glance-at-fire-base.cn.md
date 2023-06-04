---
layout: post_wide
permalink: /cn/posts/take-a-glance-at-fire-base/
title: "Firebase 简介"
description: ""
category: blog
---

上礼拜参加了 I/O 2016，按照以往的惯例，每次 I/O 大会回来后社区都会办一次 I/O Recap 的回顾活动，向本地的开发者讲述 I/O 经历、介绍最新技术。

本文对 Firebase 的功能特性，应用场景做简单介绍，是我在 I/O Recap 分享的大纲。

关于 Firebase，有两个很好的途径可以了解信息，分别是官网的文档和 Youtube 的视频。

> https://firebase.google.com

> https://www.youtube.com/user/Firebase

本文是在反复阅读文档和观看视频后的总结，供大家参考。

### Firebase 解决的问题

创业公司 / 团队面临的挑战：

1. Technical：是否能实现？

2. Product：如何打造用户喜爱的产品？

3. Market：如何推广？

4. Finance：如何盈利？如何生存？

5. Scale：如何面对规模的增长？

**Firebase 旨在打造『无服务器』的 app 开发，助力 app 快速改进，实现精准的推广**。 

### Firebase 功能点

#### 核心功能

Firebase 拥有丰富的功能，其中核心功能是 Analiytics。除了各种报表，Analiytics 有：

1. 和其他功能联通的报表展示

2. 强大的事件支持：完善的默认事件和自定义事件

3. 强大的受众（用户）定义

#### 面向开发者的功能

1. Remote Config

    远程配置，支持根据各种条件返回配置。可做 AB Testing。结合 Analiytics 报表，可快速进行更改迭代。这个是亮点。

2. Cloud Messaging

    > Firebase Cloud Messaging (FCM) is the new version of GCM. It inherits the reliable and scalable GCM infrastructure, plus new features!

    看来国内还是不能用。

3. Crash Reporting

    报表做得很不错。支持自定义日志。

4. Test Lab

    用于真机测试。国内有些替代解决方案。目前按设备时长收费。

5. Authentication

    用户认证，支持多种帐号体系，也支持注册和密码重置，免注册，自定义 UI。开发者不需要自己开发这样的通用系统，结省大量时间。

6. Realtime Database

    数据库支持。同时支持实时分发到订阅。看起来可做聊天了。有存储和连接数限制。

7. Storage
    
    存储支持。实际就是 Google Cloud Storage 的封装。结合 Authentication 实现用户存储。

8.  Hosting

    资源托管，CDN 支持。

Cloud Messaging，Crash Reporting，Test Lab 是 app 开发的标配。 Remote Config，Authentication，Storage，Hosting 则是『无服务器』化的支持。

#### 面向业务增长的功能

1. Notification console

    结合 Analiytics，对指定用户发送 Notification，比如给加入购物车但未付款的用户发送代金券。

2. App Indexing

    将 web 和 app 联系起来，在搜索结果页展示 app 信息，点击即可安装或者打开指定页面。

3. Dynamic Links

    适用于推广，尤其是个性化推广，app 安装后可进入指定页面；也可用于 app 指定内容的分享。结合 Analiytics，效果一目了然。

4. Invite

    和 Dynamic Links 一样，集成之后，用来作类似优惠码邀请这样的功能，结合 Analiytics 进行数据分析。

5. Adwords

    初次可针对特定人群进行广告推广，后续可选用 Analiytics 中的特定人群，比如安装后付费的用户，以提高转化率。

以上几点都是为 app 增长量身定做和功能。

### 应用场景

#### App 快速开发

对于小团队，资源有限，『无服务器』加快了开发速度。Crash Reporting， Test Lab 等功能提高了 app 质量。

[目前 Firebase 支持 React Native 了][react-native]。

#### 基于数据的产品改进

开发集成后可用 Firebase 进行快速的实验和改进。针对不同的用户，Remote Config 给出不同的配置，app 以此提供不同的功能。

通过 Analiytics 可直观地看出效果好坏，改变 Remote Config 的值进行功能的全量开放。

数据真实，速度快，非常高效，而这所有的一切，一个人就可完成。

#### 市场推广

SEO，邀请，分享，广告，定向 Notification 解决了很大一部分的市场推广问题。

[react-native]:      https://firebase.googleblog.com/2015/05/firebase-now-works-with-react-native_40.html
