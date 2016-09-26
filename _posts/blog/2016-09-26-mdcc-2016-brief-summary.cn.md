---
layout: post_wide
title: "MDCC 2016 PPT 下载及简单点评"
description: ""
category: blog
---

周六 MDCC 2016 结束，周日我整理了可以拿到的最新的 Slides，昨晚放到了 GitHub 上，MDCC2016 这个组织下了。iOS 会场的也会在这个组织下。

我把这些 Slides 又看了一遍，现在对这些 Slides 做一个简单的介绍，方便大家观看学习。

现在有的 Slides 有：

1. 滴滴国际化 Android 端演进

2. 回归初心，从容器化到组件化

3. 云信 IM 推送保障及网络优化实践

4. 微信Tinker热补丁实践演进之路

5. Fresco, loading image fast

6. 如何开发一款优雅的SDK

9. Android 应用性能优化经验分享

另外的两个场次，到现在我还没能拿到『可公开版本』的 Slides。而上面的 Slides 中，都是历经数次修改的。我想，这也就是大家会有截然不同的反馈的原因吧。

#### Slides 简单点评

1. 滴滴国际化 Android 端演进，两个大点
    * 地图选型
    * 漫游网络

    特别值得参考的是『地图选型』时的调研工作。

2. 回归初心，从容器化到组件化

    可能两年之前，我是完全听不懂『冯老师』这个分享的。最近，深得『冯老师』指点，用 Slide 中他谈到的这些，把一个复杂的项目做了模块化，最明显的效果是，编译时间从以前的 2 分多钟到现在的数秒。

    附上一张『马琳』的图。

    ![](http://ww1.sinaimg.cn/large/599e230bjw1f84sva9z4zj20qo0zkq7s.jpg)

3. 云信 IM 推送保障及网络优化实践

    减少内存占用，电量优化，推送，技术的克制，还有不少优化的小点。内容很多。有视频就好了。

4. 微信 Tinker 热补丁实践演进之路 

    Tencent 组织下第一个开源项目，有幸和大家见证。绍文想前天晚上开源的，说怕会场的 WiFi 不稳定。幸好说服他了。

    官方的视频还没出来，这个是 Jacks 帮忙录制的，在 YouTube 上： https://www.youtube.com/playlist?list=PLmUDvA65lNp28eLBicTEt9oOdpdnGBl9O

5.  Fresco, loading image fast

    王洁同学中文已经没有她的英文流利了，:)。作为 Fresco 文档的译者，也反复看了源码，以为对 Fresco 已经足够了解了。还是补了好多知识。

    对于不能 wrap_content 的事情，如何做到提前知道图片的宽高，我现在的做法是把宽高信息放到 uri 中。

6.  如何开发一款优雅的SDK

    观祥同学的声音有点太小，抱歉各位。

    开发，CI，测试三个方面，尤其 CI 方面的介绍，如果目前还没 CI 的团队，可以立刻按照这个配备搭建一个了。

7.  打造可信赖的 Android 设备 ID

    Slide 做得不错，台风也不错。嗯。

8.  Android 中 Native 的内存泄露检测

    嗯。

9.  Android 应用性能优化经验分享

    对几个工具的讲解很不错，好评。

#### Slides 下载地址

Android: https://github.com/MDCC2016/Android-Session-Slides

iOS: https://github.com/MDCC2016/iOS-Session-Slides

#### 关于视频和其他

视频和『圆桌会议』等其他相关内容的发布，我会在微博，公众号，Deepint 的 Slack 中公布。欢迎关注。
