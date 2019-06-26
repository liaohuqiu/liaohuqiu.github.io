---
layout: post_wide
permalink: /cn/posts/android-maven-local-repository
title: "关于安装Android Maven 本地依赖库"
description: ""
category: blog
---

如果使用gradle方式，类似这样的依赖非常轻松:

```
compile 'com.android.support:appcompat-v7:23.0.1'
```

但是对于Maven来说，这样就比较困难了:

```
<dependency>
  <groupId>com.android.support</groupId>
  <artifactId>appcompat-v7</artifactId>
  <version>23.0.1</version>
  <type>aar</type>
</dependency>
```

因为不管是Maven中央库还是，jcenter，都没有类似的类库了。他们在SDK Manager中的Android Support Repository中，gradle方式可以轻松使用，但是Maven不行。

如果需要在Maven中使用，需要我们自己安装到本地的Maven库。借助这个项目可以较为轻松实现此目的: https://github.com/simpligility/maven-android-sdk-deployer

默认安装，安装所有的API level和support 类库，我从来没成功过。需要SDK Manager把所有的API的和相关的Support库都下载完成，这是一个耗时的事情。

#### 部分安装

如果仅仅需要安装部分的话，可以到各个子项目中安装。比如仅仅需要安装`appcompat-v7`, 这个是由 Android Support Repository 提供的:

```
cd repositories/
mvn install
```

仅仅安装5.0，在SDK Manager中下载完SDK Platform和Source Code之后

```
cd platforms
mvn install -P 5.0
```

#### 修改版本号

如果你下载了5.0的SDK Platform 和 Source Code, 发现`mvn install -P 5.0` 之后 版本是 `5.0.1_r2`, 你需要的是 `5.0_r2`:

修改 Android SDK 目录下的 `platforms/android-21/source.properties` 文件:

```
Pkg.LicenseRef=android-sdk-license
Pkg.Revision=2
Pkg.SourceUrl=https\://dl-ssl.google.com/android/repository/repository-10.xml
Platform.MinToolsRev=22
Platform.Version=5.0.1
```

修改 `Platform.Version` 之后再 `mvn install` 即可。
