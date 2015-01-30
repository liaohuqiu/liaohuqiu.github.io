---
layout: post_wide
title: "我眼中的下拉刷新"
description: ""
category: blog
---

### 背景

在APP交互中，下拉刷新是非常常见的一种交互方式。在使用APP的时候，这也成为了一种潜意识的操作了。

下拉刷新最早在iOS中出现，iOS的视图渲染机制完成这种效果是非常简单的。

但Android的视图呈现形式，实现这一效果就需要稍微麻烦一些了。

两三年之前，Android 的类库打包，对自定义组件的支持是很弱的。`res-auto` 这样的xml布局属性命名空间是在[SDK Tool Version 17 中才支持的](http://android-developers.blogspot.com/2012/03/updated-sdk-tools-and-adt-revision-17.html)，那是2012年3月的事情。

对于有资源的类库，早先的打包形式是apklib格式。

apklib 格式的类库使用 [maven-android-plugin][] 生成。使用apklib格式的类库，需要借助maven。所以对于使用eclipse的开发者来说，这又增加了一道门槛。这使得apklib一直没有流行起来。

aar格式是在 Google I/O 2013 才提出的。[maven-android-plugin][] 3.7 版本开始支持aar格式。Android Studio 1.0的发布和流行，标志着apklib格式将要退出历史舞台。

在带资源的的类库不能被很好支持的时代，自定义组件的封装和实现也受到了极大的限制。[Android-PullToRefresh]() 的实现便是这一限制的一种体现。

为了支持常用的几种View: `ListView`, `GridView`, `ScrollView`, `ViewPager`，该项目为这些View都做了适配。

然由于设计的缺陷，每种View都要做相应的适配, 缺乏定制性和扩展性，现在这个项目不再维护了。

这个项目的流行，对Android UI的表现是有一定影响的，和iOS 上各种新颖美妙的样式相比，Android 的样式总是显得较为逊色。

### 回归简单

对于常用`ListView` 有一种包含下拉刷新和加载更多的实现。这个实现是给`ListView`加了一个`Header View`，同时集成了加载更多功能。

且不说把这两个功能合并在一起在设计上的缺陷，用Header View来实现下拉刷新，在UI体验上就是大打折扣的。

最为朴素直观的想法和认知，下拉刷新的样式布局应该是这样的:


```
               +--------------------+
               |  +--------------+  |
               |  | Header View  |  |
               |  +--------------+  |
               |  +--------------+  |  <----- PtrFrameLayout
               |  |              |  |
               |  |              |  |
               |  |              |  |
               |  | Content View |  |
               |  |              |  |
               |  |              |  |
               |  |              |  |
               |  |              |  |
               |  |              |  |
               |  +--------------+  |
               +--------------------+
               
```

1.  外部是一个框架(`PtrFrameLayout`), 内含 Header View 和 Content View。需要支持通用布局属性 Padding 和 Margin。

2.  Header View 是头部，展示刷新相关动画。默认会有一些头部，用户可以自定义头部。

3.  Content View 是内容，比如`ListView`, `ScrollView`等。用户可以加入任意的View。

4.  在xml文件中，可以方便指定Header View 和 Content View，也可以通过Java代码指定。

### 交互

Header View 和 Content View 的位置关系如下图:

```
       +--------------+                            
       | Header View  |   
       +--------------+                +--------------+                   
    +--------------------+          +--| Header View  |--+        +--------------------+     
    |  +--------------+  |          |  +--------------+  |        |                    |    
    |  |              |  |          |  +--------------+  |        |  +--------------+  |    
  --|--|--------------|--|---    ---|--|--------------|--|---  ---|--| Header View  |--|--
    |  |              |  |          |  |              |  |        |  +--------------+  |    
    |  | Content View |  |          |  |              |  |        |  +--------------+  |    
    |  |              |  |          |  | Content View |  |        |  |              |  |    
    |  |              |  |          |  |              |  |        |  |              |  |    
    |  |              |  |          |  |              |  |        |  |              |  |    
    |  |              |  |          |  |              |  |        |  | Content View |  |    
    |  |              |  |          |  |              |  |        |  |              |  |    
    |  |              |  |          |  |              |  |        |  |              |  |    
    |  +--------------+  |          |  |              |  |        |  |              |  |    
    +--------------------+          +--|--------------|--+        +--|--------------|--+    
                                       +--------------+              |              |       
                                                                     |              |       
                                                                     +--------------+       
 
             位置1                          位置2                         位置3
            初始状态                     未达刷新高度                  达到刷新高度

```

#### 位置关系

手指触摸屏幕往下拉动，Header View 和 Content View 也往下移动。

在往下移动的过程中，Content View 上边界距离 `PtrFrameLayout` 上边界的距离，我们称为**下拉距离`(Offset)`**。这是一个大于等于0的值。

下拉距离达到一定距离之后，释放， 将会触发刷新。这个距离我们称为**刷新距离`(Offset to Refresh)`** ；

在往下移动的过程中，Header View 和 Content View 的位置关系如上图所示:

1.  位置1， 初始状态。Header View 在 `PtrFrameLayout` 界面之外。

2.  随着下拉，Header View 和 Content View 慢慢往下移动，到达位置2。

    在位置2，释放，Content View 回到初始位置。不会触发刷新操作。

3.  继续下拉，Content View 头部越过刷新线, 从位置2到到达位置3。在位置3，释放将会触发刷新。


#### 下拉刷新和释放刷新

*   下拉刷新`(PullToRefresh)`

    如果设置为下拉刷新，从位置2到位置3的过程，一旦达到刷新距离，即开始刷新操作。

*   释放刷新`(ReleaseToRefresh)`

    如果设置为释放刷新，从位置2到位置3的过程，不触发刷新操作，释放触发刷新操作。

    如果从位置3往上推，回到位置2，释放，将不会触发刷新操作。

#### 刷新时保持头部 `(KeepHeaderWhileRefresh)`

在刷新时，会显示Header View，Header View上显示loading 动画，提示用户用户正在加载数据。

这个时候的下拉距离，我们称为**刷新时保持头部的距离`(Offset To Keep Header While Loading)`**，这个距离一般是头部的高度。

*   如果不设置刷新时保持头部。不管下拉刷新还是释放刷新，释放之后，回归到初始位置。

*   如果设置刷新时保持头部，如果释放时下拉距离大于`刷新时保持头部的距离`，会滑动到`刷新时保持头部的距离`，并保持位置不动。

    刷新完成之后，回归到头部位置。在刷新数据过程中: 
    
    *   如果下拉使得距离超过`刷新时保持头部的距离`, 释放后，会继续回归到`刷新时保持头部的距离`；刷新完成后，回归初始位置。
    *   如果上推使得距离小于`刷新时保持头部的距离`, 释放后，位置不动。刷新完成之后，回归初始位置。

---
Android-PullToRefresh:  https://github.com/chrisbanes/Android-PullToRefresh
maven-android-plugin:   https://code.google.com/p/maven-android-plugin
