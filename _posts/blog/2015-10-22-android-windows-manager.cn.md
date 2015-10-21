---
layout: post_wide
title: "Android 悬浮窗的小结"
description: ""
category: blog
---

[睡不着起不来的万先生](http://weibo.com/2951317192) 的 [Android无需权限显示悬浮窗, 兼谈逆向分析app](http://www.jianshu.com/p/167fd5f47d5c) 对 UC 浏览器的弹窗实现做了详尽的分析。

### 目的

使用 `WindowManager` 在尽可能多的机器上，在任何应用，以及桌面上，显示悬浮窗（System overlay view)，并且这些 View 需要可以接收触摸（点击）和按键事件，点击悬浮窗可以跳转进入到应用。

总结起来:

1.  `WindowManager.LayoutParams.TYPE_TOAST` 不需要申请权限，显示 System overlay view

    `WindowManager.LayoutParams.TYPE_PHONE` 和 `WindowManager.LayoutParams.TYPE_SYSTEM_ALERT` 需要申请 `android.permission.SYSTEM_ALERT_WINDOW` 权限，否则无法弹窗，报错：

    ```
    E/AndroidRuntime: android.view.WindowManager$BadTokenException: Unable to add window android.view.ViewRoot$W@b64b5458 -- permission denied for this window type
    ```

2.  `type` 为 `WindowManager.LayoutParams.TYPE_TOAST` 显示的 System overlay view 不需要权限，即可在任何平台显示。

    但仅在 API level >= 19 时可以达到目的。API level 19 以下因无法接收无法接收触摸（点击)和按键事件，故无法达到目的。

3.  对于 API level < 19 的机器（MIUI除外），想要达到目的，需要:

    1.  要有 `android.permission.SYSTEM_ALERT_WINDOW` 权限

    2.  将 `type` 设置为 `WindowManager.LayoutParams.TYPE_PHONE` 或者 `WindowManager.LayoutParams.TYPE_SYSTEM_ALERT`

4.  MIUI

    我今天晚上借了台MIUI V5 4.2.2实测了一下, 这台机器上UC的快速搜索功能也无法正常使用.

    表现为:
        使用TYPE_PHONE这类需要权限的type时, 只有在app处于前台时能显示悬浮窗, 且能正常接受触摸事件. 如果在应用详情里面授悬浮窗权限, 则工作完全正常.

    Shawon： @tanranran 我测了一下UC在MIUI V5 4.2.2上的表现, 它即便是在授权的情况下悬浮窗也出不来
