---
layout: post_wide
permalink: /cn/posts/memory-and-profile-analysis-in-android/
title:  Android 内存使用分析和程序性能分析
description: 安卓开发做性能优化时，如何分析内存使用？如何查看 app 中方法调用情况，找出性能瓶颈？
category: blog
---

> 这篇文章，内容已经老旧，目前（2016-10-29），Android Studio 已经提供了很好的内存使用工具，且也有像 Leakcanary(https://www.liaohuqiu.com/cn/posts/leak-canary-read-me/) 这样的好用的内存泄漏排查工具了。发展好快。

> 方法调用分析也是。另外，这篇文章的图片之前在 SEA，后来 SAE 扣费规则变化，之前承诺的永久的开发者激励，取消了，我存放图片的应用欠费没注意被删除了。

> 所以这篇文章什么价值不大了，大家大可不看。我留这里，当个念想。

> 目前，图片在七牛，全站 https。

Android 应用的性能分析，优化，需要检查分析内存使用情况和方法调用情况。本文给出进行这两方面分析的工具和方法。

### 内存使用分析
---
##### 1. 分析内存使用
    
虽然 Android 系统的 Dalvik 虚拟机有垃圾回收机制，但因手机内存使用存在不同于普通 P C的更大的限制，内存使用方面的问题，我们更应多加注意。

1. 一些内存使用问题会非常明显，比如内存耗尽（不足）时触发的 `OutOfMemoryError` 可能会使 app 直接崩溃。
    
2. 另有一些内存问题则表现得不那么明显，但他们会让你的 app 以及系统变得越来越慢。

当有以上两种情况之一时，就得看看内存的使用情况了，是否存在：

* 过大的对象，占用内存
* 有些对象一直被创建，从未被释放。

##### 2. 工具

在 Android 的 ADT 中，提供了两种工具可以用来分析内存使用

* 对象分配相关：DDMS 中的 Allocation Tracker。借助这个工具可以查看对象的生成和分配情况, 可了解到对象在何时被创建，但无法了解整个 App 的对象分配情况。

* Heap 使用情况相关：
    1. DDMS 中的 Heap 工具。
    2. hprof 导出工具，在 DDMS 中导出 hprof 文件，在 [Memory Analyzer](http://www.eclipse.org/mat/) 中查看。

    > hprof 文件是 Java 虚拟机的 Heap 快照

##### 3. 查看 Heap 实时情况

<img class="cimage" src="//{{ site.error_s_host }}/img/org/17/70/1/5/60/update-heap-status.png"/>

1.  打开 DDMS，选中应用,点击 Update Heap 按钮
2.  右侧 Hea p标签页，显示了 Heap 使用情况
3.  操作应用，看哪些操作将导致内存用量增大

##### 4. Memeory Analyzer 分析内存使用情况

根据实时的 Heap 使用情情况，我们可以大致判断哪些操作，哪些页面可能存在内存是一共问题，但是具体的问题的需要更进一步的数据。

> Allocation Tracker 提供了对象分配和被引用的详细的信息

> 另外，还提供了一个报告，为我们分析提供参考

> 请在此处下载：[Memeory Analyzer](http://www.eclipse.org/mat/)

我们可以通过 DDMS 导出 hprof 文件，在 Memeory Analyzer 中分析, 如下:

<img class="cimage" src="//{{ site.error_s_host }}/img/org/28/36/67/55/22/dump-hprof.png"/>


1.  打开 DDMS, 选中应用，点击 `Dump HPROF file`, 等待一段时间, 10 几秒甚至更长，保存 hprof 文件。
2.  导出的文件为 Dalvik 虚拟机格式的，需要转成 J2SE 虚拟机格式的，否则 Memeory Analyzer 无法打开

    在 Windows中，cmd：

        cd /d D:\android\adt\adk\tools
        hprof-conv.exe D:\tmp\com.srain.cube.sample.hprof D:\tmp\com.srain.cube.sample-conv.hprof

3.  在 Memeory Analyzer 中打开文件
    打开文件分析的过程中，会提示是否生成分析报告，分析报告会指出哪些对象是可疑的占用内存的对象。

界面展示大致如下:
<img class="cimage"src="//{{ site.error_s_host }}/img/org/8/99/48/55/33/mat-overview.png"/>

点击 Histogram:

<img class="cimage" src="//{{ site.error_s_host }}/img/org/11/78/0/42/66/mat-histogram.png"/>

各对象在列表中，可排序：

* Shallow Heap: 占用的真正的内存大小
* Retained Heap: 对象自身的大小 + 所维护的引用的大小

选中某个对象，List Objects -> with incoming reference / with outcoming reference 可查看引用和被应用的情况。
根据这些，加上搜索，可判断未释放的或者过大的有问题的对象的位置。

Memeory Analyzer 功能强大，[更多用法，点击这里](http://eclipsesource.com/blogs/2013/01/21/10-tips-for-using-the-eclipse-memory-analyzer/)

---

### 方法调用分析

App 不流畅卡顿，和方法执行速度有更直接的关系。
主UI线程上的耗时操作，超过5s，系统就会提示用户，是否终止程序。
在 ListView 中的 `getView()` 方法，一个耗时 10ms 的操作就足够把你的列表卡顿得惨不忍睹。

Android 框架 Debug 类提供了方法，记录方法调用的执行数据到一个 trace 文件，在代码中：

    // 开始 trace文件位置: /sdcard/cube.trace
    Debug.startMethodTracing("cube");

    // ...
    // 其他的代码

    // 停止
    Debug.stopMethodTracing();

在模拟器或者没 SDK 的真机上调试时，直接使用 /sdcard 下的路径可能会有 Permission deny 错误，改用机身内部存储试试。

生成的 trace 文件，通过 adb pull 存到本地。

    adb pull /sdcard/cube.trace D:\tmp\cube.trace

直接在 ADT 的 eclipse 中打开:

<img class="cimage" src="//{{ site.error_s_host }}/img/org/19/98/19/71/81/trace-view-overview.png"/>

上图中：

1. 上部区域(Timeline Panel) 为各线程的时间线上的概况
    * 在区域 1，鼠标为左右箭头状，在放大之后，可拖动缩小尺寸
    * 鼠标放在各线程时间轴区域，比如主线程的 2 区域，鼠标成十字状，左右拖动可以选择关注区域，选择合适的关注区域，松开鼠标，区域将放大。

2. 下部区域(Profile Panel)为方法调用情况, 几个参数介绍如下：
    * cpu time，方法执行的真正的时间
    * real time, cpu time + 其他时间(IO wait, Thread wait)
    * Inc xxx Time, Inc 为 inclusive 缩写，本方法调用时间以及本方法内部所调用的方法(子方法)的总和
    * Excl xxx Time, Excl 为exclusive 的缩写，指的除去子方法，该方法本身执行时间
    * Calls + RecurCalls/Total, 显示父子方法调用次数占比

3.  选中一个方法，在时间线图中会有突出显示。放大时间线图，可直观看出方法执行时间长度；看调用图，可找出该方法被调用的层次关系。

4.  查看 Excl Time 和 Inc Time，分析调用关系，可找出真正耗时的方法，找出性能瓶颈。

<img class="cimage" src="//{{ site.error_s_host }}/img/org/13/42/30/62/45/trace-view-exclusive-time.png"/>

上图中，Excl Time 排名第二的方法 `bytesToHexString` 很可能是有性能问题的。
