---
layout: post_wide
title: Ultra-Ptr 在eclipse中编译的办法
description: ""
keywords: ""
category: blog
---
[android-Ultra-Pull-To-Refresh](https://github.com/liaohuqiu/android-Ultra-Pull-To-Refresh)发布之后，收到许多反馈说在eclipse中编译不通过，缺少资源文件。

项目包含两个子项目: 

* ptr-lib文件夹中的是类库

* ptr-demo 文件中的是demo

在这两个项目中都有一个libs文件，这两个文件夹是eclipse中需要的依赖包和源码。

1. ptr-lib
    * clog用于调试日志， 直接将libs/clog-{version}.jar 加入到项目中即可。

2. ptr-demo
    * clog用于调试日志， 直接将libs/clog-{version}.jar 加入到项目中即可。
    * support-v4, 直接将 libs/support-v4-{version}.jar 加入到项目中即可，**注意避免重复依赖，已经有了就不用再加了**
    * cube-sdk 这是demo项目的基础框架依赖。这是一个带资源的类库。目前打包成了`apklib`和`aar`两种格式。
        通过maven和gradle(Android Studio/Intellij IDEA)可以很好地使用这两个类库(maven 支持两种格式，gradle目前只支持`apklib`)
        但是很遗憾，eclipse不能使用这两种格式中的任何一种。

### 解决方案

有两种方案:

1. 利用maven插件, 这样，就直接和maven一样了。如果你没有使用过maven，不建议用这种方式，可以尝试，但是中途你会遇到很多问题。

2. 这也是比较简单的方案: 直接将 cube-sdk 项目用eclipse打开，这是一个类库项目，然后在ptr-demo中引用这个项目。

    cube-sdk 项目的源码在这里 https://github.com/etao-open-source/cube-sdk, **`core`文件夹中的内容就是项目源码。**

    **需要 SDK 版本 >= 19**

### 常见问题

*   ClassNotFound

    清理资源，重启eclipse

*   getAllocationByteCount()

    需要版本SDK >= 19

如有问题，请在这里留言。
