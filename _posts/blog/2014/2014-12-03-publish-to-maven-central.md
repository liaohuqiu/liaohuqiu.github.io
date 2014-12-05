---
layout: post_wide
title: aar vs apklib
description: ""
keywords: ""
category: blog
---

Using `android-maven-plugin`, maven can use both `apklib` and `aar` format.

But gradle only can use `aar` foramt.

Eclipse can use maven plugin to work with `apklib` and `aar`. But I can not work that out. I did that before.

Using `android-maven-plugin`, maven can generate apklib and aar format. But the files in `libs` will be packed. I don't know how to exclude that. I was not sure weather the `aar` war right or not.

Using gradle, it's easy to generate `aar` and apklib.

So I use gradle to package library project into aar and apklib.
