---
layout: post_wide
title: "ListView / GirdView Adpater的getView方法，首项多次调用"
description: "本文解释了getView首项被执行多次的原因，并给出了一些参考解决方案。"
category: blog
---

通过Adapter为`AbslistView`提供内容是一个常见的做法：在ListView或者GridView的Adapter中的`getView()`方法中，加入一行日志，看`getView()`被调用的情况

```java
public View getView(int position, View convertView, ViewGroup parent) {
    Log.d('cube_list', 
        String.format("getView %s, %s", position, convertView == null));
    // 创建
    if (convertView == null) {

    } 
    // 复用
    else {
    }
}
```

###问题表现

对于ListView，我们使用如下的一个xml文件：

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent" >
    
    <ListView
        android:id="@+id/ly_image_list_small"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:divider="@null"
        android:fadingEdge="none"
        android:listSelector="@android:color/transparent"
        android:padding="10dp"
        android:scrollbarStyle="outsideOverlay" />

</RelativeLayout>
```

**getView 方法返回的view含有一个网络图片，下载完成后，会导致重新绘制。**

运行程序，在Logcat中 ***有可能*** 会看到`getView 0`会被打印出很多条。

```
03-15 14:32:41.980    cube_list﹕ getView 0, true
03-15 14:32:41.980    cube_list﹕ getView 1, false
03-15 14:32:41.980    cube_list﹕ getView 2, false
03-15 14:32:41.990    cube_list﹕ getView 3, false
03-15 14:32:41.990    cube_list﹕ getView 4, false
03-15 14:32:41.990    cube_list﹕ getView 0, false
03-15 14:32:41.990    cube_list﹕ getView 1, false
03-15 14:32:41.990    cube_list﹕ getView 2, false
03-15 14:32:41.990    cube_list﹕ getView 3, false
03-15 14:32:41.990    cube_list﹕ getView 4, false
03-15 14:32:42.000    cube_list﹕ getView 0, false
03-15 14:32:42.010    cube_list﹕ getView 1, true
03-15 14:32:42.010    cube_list﹕ getView 2, true
03-15 14:32:42.010    cube_list﹕ getView 3, true
03-15 14:32:42.020    cube_list﹕ getView 4, true
```

**第一页之后，第0项不再被绘制，但GridView 情况却糟糕多了, 滑动的过程，第0项还在不停被绘制。**

---

###原因分析

起因：类似这样的情况，都是加入了列表项之后，列表项自身的一些操作，比如加入图片，导致整个view重新绘制。在重新绘制的过程中，onMeasure方法会创建出列表项来确定大小。

####ListView

在`onMeasure()`时：

1.  如果宽度或者高度的状态为 UNSPECIFIED, 会多次绘制列表首项，直到大小确定为止。
2.  如果高度的状态为AT_MOST, 会绘制多个列表项进行确定大小。

主要代码如下：

```java
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {

    super.onMeasure(widthMeasureSpec, heightMeasureSpec);

    int widthMode = MeasureSpec.getMode(widthMeasureSpec);
    int heightMode = MeasureSpec.getMode(heightMeasureSpec);

    // ViewMode 处于UNSPECIFIED 状态，绘制首项来确定大小
    mItemCount = mAdapter == null ? 0 : mAdapter.getCount();
    if (mItemCount > 0 && (widthMode == MeasureSpec.UNSPECIFIED 
        || heightMode == MeasureSpec.UNSPECIFIED)) {

        // getView(0)
        final View child = obtainView(0, mIsScrap);

        // other code
        }
    }

    // other code

    // AT_MOST 状态，绘制多个列表项以确定高度。
    if (heightMode == MeasureSpec.AT_MOST) {

        // 会调用多个getView，这些view将不会被复用
        heightSize = measureHeightOfChildren(widthMeasureSpec, 0, 
                NO_POSITION, heightSize, -1);
    }

    // other code
}
```

####解决方案：

如果`ListView`大小未决，则会绘制列表项，以确定自身大小。让`ListView`大小处于`EXACTLY`状态即可。

根据 [Android中View大小的确定过程](http://www.liaohuqiu.net/cn/posts/how-does-android-caculate-the-size-of-child-view/)，所描述：

1.  如果ListView父容器大小确定，设置尺寸为 `match_parent` 不会出现此问题。
2.  不管父容器什么状态，`ListView`大小为确定数值不会出现此问题。

---

###GirdView

`GridView`看起来比较无解，每次`onMeasure()`都会导致列表首项被绘制。

```java
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {

    // other code

    mItemCount = mAdapter == null ? 0 : mAdapter.getCount();
    final int count = mItemCount;
    if (count > 0) {

        final View child = obtainView(0, mIsScrap);

        // ...
    }

    // ...
}
```

只要重新确定大小，首项就一定会被重绘，这个是非常险恶的。从`onMeasure`的实现来看，几乎无法避免，只能从业务方入手。

1.  如果是类似九宫格的应用场景，这里有一个解决方案。[Gridview的错误用法及替代方案](http://www.liaohuqiu.net/cn/posts/grid-view-do-not/)

2.  一定有翻屏的需求，可用ListView代替。

3.  釜底抽薪，让列表项不要求重绘。

