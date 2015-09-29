---
layout: post_wide
title: "React Native: Android 的打包"
description: ""
category: blog
---

[上一篇文章][last-post]提到了 React Native 的环境配置和基本的开发调试。本文介绍 React Native 中的资源打包，重点介绍使用 react-native-gradle 插件进行 Android APP 的打包。

### 关于打包

* 打包目的

    除了热部署，我们知道，APP 运行的时候不应再从 Debug Server 获取资源。分发应用时 js 资源应该被打包到 APP 中。

    另外对外发布的安装包，资源中的业务代码的混淆也是必须的。

* React Native 打包方式

    目前 iOS 应用可用 `react-native bundle` 命令进行打包，同时对 Android 的支持工作也已经开始了。但在目前 npm 中最新的版本(0.11.4)暂时还不支持。[最新的代码中][latest-bundle]看似已经支持了，但还没最终发布。等正式发布支持了，我另写一篇文章介绍使用 `react-native bundle` 命令进行打包。

    目前对于 Android 的 React Native 应用，可用 react-native-gradle 插件进行打包。该插件灵活配置打包参数，使用 Gradle Task 将资源打包到资源文件夹。

    但[官方计划使用 `react-native bundle` 命令进行打包，并且有放弃对 Gradle 插件支持的倾向][recommended-way]。

    都使用 `react-native bundle` 进行打包，对开发人员来说，只要掌握一套打包命令即可。但是对于 Android 的开发者来说，插件方式似乎更符合平时的开发习惯。各位自行取舍。

> React Native 开发目前非常活跃，代码变迭频繁，本文所讨论的代码版本为: https://github.com/facebook/react-native/tree/0ff3a421c9adbe4137e07e158c9812062b34ea5a

> 本文中目前所指的时间为: 2015年09月28日20点，太平洋时间；中国2015年09月29日11点。

### react-native-gradle 插件

* 编译插件

    借助插件 react-native-gradle：[com.facebook.react:gradleplugin:1.0.+][gradleplugin] 可完成混淆及资源打包。
    
    然而这个插件并没有发布到 JCenter 或者 Maven Centry。需要自己编译，然后发布到本地 Maven 库。源码在 [react-native-gradle](https://github.com/facebook/react-native/tree/0ff3a421c9adbe4137e07e158c9812062b34ea5a/react-native-gradle) 目录下。按照[文档][gradleplugin-doc] 编译安装：
    
    ```bash
    mac-2:react-native-gradle srain$ gradle build install
    ```
    
    结果是测试用例报错，这个问题，官方一直没修复，且置之不理。[给出的解释][recommended-way]前面提到了。
    
    我们可跳过测试用例，直接安装。虽然官方提供的测试用例本身有问题，无法进行测试，但我`亲测可用`。
    
    > 题外话，对于给出的解释，显得非常不讲究，目前整个项目处于高度活跃中，文档和实际功能严重脱节，很多不一致的地方。
    > 看来任何团队都会面临项目压力，变得节奏不再优雅啊，所谓的理想团队都是瞬时态。
    
    跳过测试用例，直接安装:
    
    ```bash
    mac-2:react-native-gradle srain$ gradle install
    ```
    
    安装完成：
    
    ```bash
    mac-2:react-native-gradle srain$ ll ~/.m2/repository/com/facebook/react/gradleplugin/
    total 8
    drwxr-xr-x  5 srain  staff  170 Sep 28 15:10 1.0.0-SNAPSHOT
    -rw-r--r--  1 srain  staff  326 Sep 28 15:10 maven-metadata-local.xml
    ```

*  在项目中使用

    `build.gradle` 配置如下:
    
    ```groovy
    buildscript {
        repositories {
            mavenLocal()    // 本地依赖
            jcenter()
        }
        dependencies {
            classpath 'com.android.tools.build:gradle:1.3.0'
            classpath 'com.facebook.react:gradleplugin:1.0.+'   // 插件依赖
        }
    }
    ```
    
    `app/build.gradle`:
    
    ```groovy

    apply plugin: 'com.facebook.react'

    react {
        bundleFileName "index.android.bundle"   // assets 目录下 js 文件名
        bundlePath "/index.android.bundle"      // js 路径
        jsRoot "../"                            // js 源文件位置
        packagerHost "localhost:8081"           // debug server 地址
        packagerCommand "./node_modules/react-native/packager/packager.sh"  // 打包命令地址
    
        devParams {
            skip true
            dev true
            inlineSourceMap false
            minify false
            runModule true
        }
        releaseParams {
            skip false
            dev false
            inlineSourceMap false
            minify true
            runModule true
        }
    }
    ```

*   配置说明

    上面 react 项中的配置已经在注释中说明。其中，`packagerCommand` [官方给出的文档描述有误][gradleplugin-doc]。

    `devParams` 和 `releaseParams` 分别 debug 版本和 release 版本的参数。它们各有五个参数：

    * `skip` 参数为 `true` 则跳过从本地资源加载，从 Debug Server 请求资源。为 false 时从打包资源，运行时，从本地加载。

    * 其他四个参数通过 url 传给 Debug Server

        比如: `http://localhost:8081/index.android.bundle?dev=true&inlineSourceMap=true&minify=false&runModule=true`

        参数意义如下：

        * dev: 等同于全局变量 `__DEV__`, React Native 核心类库的开发选项。

        * minify: 混淆。

        * inlineSourceMap: 是否加入 source map。默认为 `false`。

        * runModule: 默认为 `true`，是否在最后以 `require(XXX)` 的形式加入 module 的入口点。如:

            ```
            require("AwesomeProject/index.android.js");
            ```

        > 参数的英文说明文档在: https://github.com/facebook/react-native/blob/master/packager/README.md

*   打包

    每次打包，插件都会根据配置，决定是否打包以及以怎样的配置打包资源。

### Demo

    这里是一个 Demo: https://github.com/liaohuqiu/ReactNativeTestGradlePlugin。
    
    Demo 主要演示了 build.gradle 的配置，用 Android Stuido 打开即可运行，不要修改 Dev Setting 中的 Debug Server，因为资源都已经打包，不再在从 Debug Server 下载。可以解开 debug.apk 看 assets 目录下的文件。
    
    其中包含了一个编译安装 react-native-gradle 到本地 Maven 库的脚本，运行即可。

### `react-native bundle` 命令简介

命令用法如下:

```bash
mac-2:AwesomeProject srain$ react-native bundle --help
Usage: react-native bundle [options]

Options:
  --dev     sets DEV flag to true，同插件配置的 dev 
  --minify  minify js bundle，同插件配置的 minify
  --root        add another root(s) to be used in bundling in this project
  --assetRoots      specify the root directories of app assets
  --out     specify the output file， 输出文件的位置
  --url     specify the bundle file url，js bundle 路径
```

对 iOS 打包时：

```bash
react-native bundle --minify
```

---

本文写于旅途，从洛杉矶到旧金山的 greyhound 大巴车上。时间仓促，水平有限，如有谬误，还请纠正，原始文档在[这里]()

有问题欢迎留言或在微博上和我交流: http://weibo.com/liaohuqiu

---

[last-post]:            http://www.liaohuqiu.net/cn/posts/react-native-1/
[recommended-way]:      https://github.com/facebook/react-native/issues/2786
[gradleplugin]:         https://github.com/facebook/react-native/tree/0ff3a421c9adbe4137e07e158c9812062b34ea5a/react-native-gradle%2FREADME.md
[gradleplugin-doc]:     https://github.com/facebook/react-native/tree/0ff3a421c9adbe4137e07e158c9812062b34ea5a/react-native-gradle%2FREADME.md
[latest-bundle]:        https://github.com/facebook/react-native/tree/0ff3a421c9adbe4137e07e158c9812062b34ea5a/local-cli%2Fbundle.js
