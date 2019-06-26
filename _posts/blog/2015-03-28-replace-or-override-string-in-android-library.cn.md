---
layout: post_wide
permalink: /cn/posts/replace-or-override-string-in-android-library
title: "重定义/覆盖Android类库中的文字，颜色等资源"
description: ""
category: blog
---

收到一份邮件，咨询如果自定义[android-Ultra-Pull-To-Refresh](https://github.com/liaohuqiu/android-Ultra-Pull-To-Refresh`)的文字提示：

> Hi, 

>   I'm using your library and I find it very useful but I have a (stupid) problem: I've imported the library using gradle and all is working perfectly but I'm unable to change the strings that appear on the header view:

>    * Updating...

>    * Updated

>    * Pull down to Refresh

>    * etc...

>   Is the a function or something to localize these strings ?

目前在类库中内置了英文和中文两种提示文字。如果需要其他的语言或者需要修改的话，要自定义文字覆盖掉类库中默认值。

和这个场景类似，我们在使用其他一些涉及UI样式的类库时，有时也希望可以自定义UI样式，比如:

1.  如果使用的类库中的一些文案我们需要做汉化，或者做一些修改；
2.  一些配色和应用的配色不太一致。

我们只要在应用项目的values目录中定义相应的值就可以了。如要实现多语言，那么在其他各个语言资源目录分别定义即可。

在应用和类库查找资源时，按以下流程进行:

1.  先按照语言查找应用中有无资源定义
2.  如果没有，采用类库中的同语言资源配置。
3.  如果当前语言没有，则采用应用的默认配置。
4.  如果应用默认配置没有资源配置定义，则使用类库的默认语言配置。
