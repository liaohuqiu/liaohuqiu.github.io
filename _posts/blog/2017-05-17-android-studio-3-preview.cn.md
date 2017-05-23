---
layout: post_wide
title: "Android Studio 3 Preview 发布"
description: ""
keywords:   ""
category: blog
---

Google I/O 2017 的第一天，Android Studio 3.0 Preview 发布，这个版本几个很大变化：

#### 支持 Kotlin

Android Studio 3.0 全面支持 Kotlin。Kotlin 也正式纳入了 Android 的开发体系。在 《What's New in Android》的 Keynote 中，演示了 70 ~ 80 行的 Java 代码用一行 Kotlin 代码代替：This is the first line of the code also the last line.

Kotlin 有很多令人激动人心的特性。还没上手的同学，抓紧补课吧。

#### 在 Xml 中支持字体

Target API 是 Android O 时，可直接在 Xml 中支持字体，等了很多年了对吧。如果有  Google Play Services 还同时还支持远程字体，即先下载再使用。

#### 支持 Instant App

Instant App 面向所有人开放了，https://g.co/instantapps ，在新建工程中，直接有 Instant App 工程

#### 其他增强

* Java 8 特性支持，可怜的 Jack。

* Layout Editor，拖拽更容易，更好用: https://developer.android.com/studio/write/layout-editor.html

* 支持 Android Things: https://developer.android.com/things/index.html

* 更新到 IntelliJ 2017.1， IntelliJ 或成最大赢家。

* 构建速度更快：反正他们每次都这么说。

* 发布 Google 自己的 Maven Repository，脱离了 Android SDK Manager，使得 CI 更容易。

* 模拟器支持 OpenGL ES 3.0

* 可在模拟器中直接提交 Bug。冯老师可能会喜欢这个。

* 支持给模拟器设置 HTTP 代理

* 对任意 APK 的调试，分析和 Profile 支持，只要他们是 debuggable，如果你的 APK 含有 C++ 代码，build 环境配置复杂，这个会很有用。特定环境 build 好，然后在 Android Studio 中分析。

* APK Analyzer：对，这个改进了。可分析 Instant App，AAR, 可查看类和方法的 dex bytecode 了。同时，改进了 Layout Inspector。同时，有了 Device File Explorer：轻松查看设备上的文件。

* 全新的 Android Profiler，包含：Network Profiler / Memory Profiler / CPU Profiler，做优化更轻松了。

> 英文原文链接： https://android-developers.googleblog.com/2017/05/android-studio-3-0-canary1.html
