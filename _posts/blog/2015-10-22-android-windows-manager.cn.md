---
layout: post_wide
title: "Android 悬浮窗的小结"
description: ""
category: blog
---

[睡不着起不来的万先生](http://weibo.com/2951317192) 的 [Android无需权限显示悬浮窗, 兼谈逆向分析app](http://www.jianshu.com/p/167fd5f47d5c) 对 UC 浏览器的弹窗实现做了详尽的分析。

我看了顺手做了个小 [Demo][] ，发布之后收到反馈说并非所有机型都可以显示悬浮窗。[睡不着起不来的万先生][] 也收到了类似的反馈，并第一时间(凌晨2，3点)做了研究并给出了一个结论。我资质愚钝，在他之后，继续花了很多时间，想把这个事情弄清楚，现在算弄明白了，这里小结一下。

### 目的

[Demo][] 和 UC 浏览器的目的都是使用 `WindowManager` 在尽可能多的机器上，在任何应用中（包括在桌面时），显示悬浮窗（System Overlay View)，并且这些 View 需要可以接收触摸（点击）和按键事件，点击悬浮窗可以跳转进入到应用。

### 总结

总结起来:

1.  使用 `type` 值为 `WindowManager.LayoutParams.TYPE_PHONE` 和 `WindowManager.LayoutParams.TYPE_SYSTEM_ALERT` 需要申请 `android.permission.SYSTEM_ALERT_WINDOW` 权限，否则无法显示，报错：

    ```
    E/AndroidRuntime: android.view.WindowManager$BadTokenException: Unable to add window android.view.ViewRoot$W@b64b5458 -- permission denied for this window type
    ```

2.  `type` 值为 `WindowManager.LayoutParams.TYPE_TOAST` 显示的 System overlay view 不需要权限，即可在任何平台显示。

    但仅在 API level >= 19 时可以达到目的。API level 19 以下因无法接收无法接收触摸（点击)和按键事件，故无法达到目的。

3.  对于 API level < 19 的机器（MIUI除外），想要达到目的，需要:

    1.  要有 `android.permission.SYSTEM_ALERT_WINDOW` 权限

    2.  将 `type` 设置为 `WindowManager.LayoutParams.TYPE_PHONE` 或者 `WindowManager.LayoutParams.TYPE_SYSTEM_ALERT`

4.  MIUI V5

    在给悬浮窗权限之后，表现同 3 。但是，不给悬浮窗权限时，应用在前台时，却**可以**显示。这点非常不一样。

### 最后


*   为什么采用 `TYPE_TOAST`

    API level 19 之后，`TYPE_SYSTEM_ALERT` 就可以达到 `TYPE_SYSTEM_ALERT` 效果（即可以达到**目的**）。

    但在 API level 23 (Android 6.0) 上，悬浮窗权限也单独弄出来了，需要到单独开启，这个处理和现在 Smartisan 还有小米类似。

    故采用 `TYPE_TOAST` 能让用不开启悬浮窗权限的情况下，也能显示。为的就是尽量少请求权限。

*   为什么 API level 19 之后 `TYPE_TOAST` 可以接受事件

    `PhoneWindowManager.adjustWindowParamsLw()`，API level 19 后做了调整。

    > 当我们使用 `TYPE_TOAST`, Android 会偷偷给我们加上 `FLAG_NOT_FOCUSABLE` 和 `FLAG_NOT_TOUCHABLE` , 4.0.1 开始, 会额外再去掉 `FLAG_WATCH_OUTSIDE_TOUCH`。 这样真的是什么事件都没了。

    >  而4.4开始, `TYPE_TOAST被移除了`。所以从 4.4 开始, 使用 `TYPE_TOAST` 的同时还可以接收触摸事件和按键事件了, 而4.4以前只能显示出来, 不能交互。

    > 来自[睡不着起不来的万先生][] 的 [Android悬浮窗使用TYPE_TOAST的小结](http://www.jianshu.com/p/634cd056b90c)

*   争取做到极致

    在弹窗这个事情上，UC 也算做得挺极致了。

    发现问题，[睡不着起不来的万先生][] 第一时间探求真相，并本着认真负责的态度立刻更新了博客。

    我也修改了 [Demo][] 将 API level 兼容到了 9 。 为此还专门做了 `ClipboardManager` 的兼容。

    由于手头没机器，幸得群里 [脉脉不嘚語][] [付国征][] 等朋友的帮助，期间也一直和 [睡不着起不来的万先生][] 一直交流。

    现在这个问题，我们已经最大的能力，给弄清楚了。谢谢上面提到的几个朋友的帮助。
    
    非常感谢，尤其是 [睡不着起不来的万先生][]。

---
[睡不着起不来的万先生]:        http://weibo.com/2951317192
[Demo]:     https://github.com/liaohuqiu/android-UCToast
[脉脉不嘚語]:    http://weibo.com/u/2319578217
[付国征]:     http://weibo.com/u/1649198280
