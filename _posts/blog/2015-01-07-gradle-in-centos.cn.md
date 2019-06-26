---
layout: post_wide
permalink: /cn/posts/gradle-in-centos
title: "CentOS的gradle构建环境"
description: ""
category: blog
---

在CentOS下，用gradle进行编译打包，配合定时任务或者push webhook可以实现定时自动打包或者push后自动打包。

### 准备 JDK

这个比较简单，安装JRE和JDK。直接安装devel版本的openjdk即可。

```bash
sudo yum install -y java-1.7.0-openjdk-devel.x86_64
```

yum 安装完成之后，`JAVA_HOME` 环境变量可不设置。
如果一定要设置的话，先[查看安装路径]:

```
update-alternatives --display java

...
 slave unpack200.1.gz: /usr/share/man/man1/unpack200-java-1.7.0-openjdk.1.gz
 Current 'best' version is /usr/lib/jvm/jre-1.7.0-openjdk.x86_64/bin/java.
```

编辑 `~/.bash_prifile`

```
vim ~/.bash_prifile
export JAVA_HOME='/usr/lib/jvm/jre-1.7.0-openjdk.x86_64/'
```

至此，JDK准备完毕。

### 准备Android-SDK

1. 下载`SDK Tools Only`: http://developer.android.com/sdk/index.html

2. 解压后，设置`ANDROID_HOME`

    ```
    [huqiu@127 android-sdk-linux]$ ls -l
    total 32
    drwxrwxr-x  2 huqiu huqiu 4096 Dec 18 00:10 add-ons
    drwxrwxr-x 10 huqiu huqiu 4096 Jan  6 14:07 build-tools
    drwxrwxr-x 24 huqiu huqiu 4096 Jan  6 13:43 docs
    drwxrwxr-x 18 huqiu huqiu 4096 Jan  6 13:45 platforms
    drwxrwxr-x  4 huqiu huqiu 4096 Jan  6 14:07 platform-tools
    -rw-rw-r--  1 huqiu huqiu 1158 Jan  6 13:42 SDK Readme.txt
    drwxrwxr-x  2 huqiu huqiu 4096 Jan  6 14:07 temp
    drwxrwxr-x  8 huqiu huqiu 4096 Jan  6 14:07 tools
    [huqiu@127 android-sdk-linux]$ pwd
    /data1/android-sdk-linux
    [huqiu@127 android-sdk-linux]$ cat ~/.bash_profile
    ```

    更新 `~/.bash_prifile`

    ```
    export ANDROID_HOME='/data1/android-sdk-linux'
    ```

3.  安装所需的API level的SDK和Build Tools，全部安装耗时时间很长，所占空间也很大。参考: [2]

    查看所有安装

    ```
    android list sdk --all

    Packages available for installation or update: 124
       1- Android SDK Tools, revision 24.0.2
       2- Android SDK Platform-tools, revision 21
       3- Android SDK Build-tools, revision 21.1.2
       4- Android SDK Build-tools, revision 21.1.1
       5- Android SDK Build-tools, revision 21.1
       6- Android SDK Build-tools, revision 21.0.2
       7- Android SDK Build-tools, revision 21.0.1
       8- Android SDK Build-tools, revision 21
       9- Android SDK Build-tools, revision 20
      10- Android SDK Build-tools, revision 19.1
      11- Android SDK Build-tools, revision 19.0.3
      12- Android SDK Build-tools, revision 19.0.2
      13- Android SDK Build-tools, revision 19.0.1
      14- Android SDK Build-tools, revision 19
      15- Android SDK Build-tools, revision 18.1.1
      16- Android SDK Build-tools, revision 18.1
      17- Android SDK Build-tools, revision 18.0.1
      18- Android SDK Build-tools, revision 17
      19- Documentation for Android SDK, API 21, revision 1
      20- SDK Platform Android 5.0.1, API 21, revision 2
      21- SDK Platform Android 4.4W.2, API 20, revision 2
      22- SDK Platform Android 4.4.2, API 19, revision 4
      ....
    ```

    安装需要安装的包, 假设我需要的是API Level 19的SDK，用21.1.1的Build Tools 进行编译:

    ```
    android update sdk -u -a -t 4,22
    ```

4.  安装各种依赖:

    ```
    sudo yum install -y compat-libstdc++-296.i686
    sudo yum install -y compat-libstdc++-33.i686
    sudo yum install -y zlib.i686
    sudo yum install -y libstdc++.so.6
    ```

### 安装完成

至此已经完成安装了。

建议项目内置gradle。安装完成之后，进行build:

```
./gradlew build
```

[查看安装路径]:   http://serverfault.com/questions/50883/what-is-the-value-of-java-home-for-centos
[2]: http://stackoverflow.com/questions/17963508/how-to-install-android-sdk-build-tools-on-the-command-line
