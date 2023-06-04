---
layout: post_wide
permalink: /cn/posts/how-does-android-caculate-the-size-of-child-view/
title: "Android中 View 大小的确定过程"
description: "Android中有 ViewGroup，ViewGroup 可以包含子 View，本文讲解 View 尺寸大小的确定过程"
keywords:   "安卓View大小，安卓 View 计算大小"
category: blog
---

###View and ViewGroup

安卓中有5种基本的 `ViewGroup`:

*   FrameLayout
*   RelativeLayout
*   LinearLayout
*   TableLayout
*   AbsoluteLayout

`ViewGroup`可以添加子 View，在 xml 文件里面，我们可以这样写：

```xml
<RelativeLayout
    android:layout_width="match_parent"
    android:layout_height="100dp" >

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content" />

    <ImageView
        android:layout_width="match_parent"
        android:layout_height="20dp" />

</RelativeLayout>
```

### 子 View 的大小

*   **LayoutParams**

    `LayoutParams` 用来描述一个View在父容器中大小，它包括了高度和宽度两个维度的信息，每个维度的数据类型都是 `int`，取值是下面三种情况之一:
    1.  `FILL_PARENT` / `MATCH_PARENT`, 取值是 `-1`. 

        填充满父容器, **minus padding**.
    2.  `WRAP_CONTENT`, 取值是 `-2`. 
    
        尺寸尽量小，能包住自身的全部内容就行, **plus padding**.
    3.  一个确定的尺寸，大于等于0的一个数值。

###父容器的大小状态
*   **Padding**

    留白。自身内容的大小加上留白就是父容器的内容的真正大小。

*   **MeasureSpec**

    当父容器要确定子 View 的大小的时候，父容器需要告诉子 View 自身的大小状态。当父容器所属的大小状态不同时，对子 View 的尺寸约束是不一样的。父容器大小状态有下面三种情况：

    | parent | child |
    | --- | --- |
    | UNSPECIFIED |父容器对子View没有任何约束，子 View 可以按自身需要，任意大小。|
    | EXACTLY |父容器大小是一个确定的数值，子 View 只能限定在指定大小内。|
    | AT_MOST |父容器本身以及内含的所有子 View 大小不能超过指定大小。|

*   **View 的尺寸大小和尺寸状态**

    尺寸大小的数据类型是 `int`, 8 个字节。

    尺寸大小和尺寸状态在很多时候需要一起传递，为了减少对象的分配，把三种尺寸状态编码到尺寸大小 `int` 变量的最高位2个位中。
    1.  `UNSPECIFIED`

        ```
        +-----------+----------
        | 00xx xxxx | 剩余的7个字节.    0x00 << 30 + value
        +-----------+----------
        ```
    2. `EXACTLY`

        ```
        +-----------+----------
        | 01xx xxxx | 剩余的7个字节.    0x01 << 30 + value
        +-----------+----------
        ```
    3. `AT_MOST`

        ```
        +-----------+----------
        | 10xx xxxx | 剩余的7个字节.    0x10 << 30 + value
        +-----------+----------
        ```

### 子 View 尺寸的最终确定

子 View 有一个期望的尺寸大小，父容器有尺寸大小约束，这两方面的约束协调，用来计算 View 的大小状态。

1.  根据父容器的尺寸状态，以及子 View 的 `LayoutParams`，可以确定子 View 的大小和状态：`MeasureSpec`，并要求子 View 确定自身大小。

    调用子 View 的 `measure()` 方法，子 View 的 `onMeasure()` 方法也会被执行。
2.  子 View 在 `onMeasure()` 方法中，根据父容器给出的尺寸大小和约束，根据自身情况，确定最终的大小。
3.  父容器根据子 View 的确定的大小，最终确定自身大小。

**需要考虑的因素**

*   父容器的尺寸状态:
    1. EXACTLY
    2. AT_MOST
    3. UNSPECIFIED
*   父容器的尺寸大小: `parentSize`
*   父容器的留白:`parentPadding`
    
    父容器真正内容的大小是： `parentSize` - `parentPadding`, 用变量 `parentContentSize` 代替。
*   子 View 的 LayoutParams:
    1.  确定的数值, `childSize`
    2.  MATCH_PARENT
    3.  WRAP_CONTENT

**需要确定的**

*   子 View 的大小状态
*   子 View 的尺寸大小

**尺寸确定的规则**

*   父容器的大小状态处于 `EXACTLY` 状态时, 子容器限定在这个大小。

    | child layout | mode |  size ||
    | --- | --- | --- | --- |
    | 确定的大小   | EXACTLY | childSize |子 View 大小可以是自身大小，后期再做确定。|
    | MATCH_PARENT | EXACTLY | parentContentSize|父容器多大，子 View 就可以多大。大小为父容器大小。|
    | WRAP_CONTENT | AT_MOST | parentContentSize|最大尺寸为父容器尺寸，本身内容不能超过和父容器尺寸。|

*   父容器尺寸处于`AT_MOST`状态时, 子 View 尺寸不能超过这个尺寸。

    | child layout | mode |  size ||
    | --- | --- | --- | --- |
    | 确定的大小   | EXACTLY | childSize |子 View 的大小可以为自身的大小。后期再做确定|
    | MATCH_PARENT | AT_MOST | parentContentSize|父容器大小未确定，但子容器想要和父容器一定大。那么确定子 View 最大可以和父容器一样大。|
    | WRAP_CONTENT | AT_MOST |parentSize| 子 View 需要确定自己的尺寸，最大不超过父容器大小。|

*   父容器处于 `UNSPECIFIED` 状态，需要根据子 View 的最终大小来确定自己状态。

    | child layout | mode |  size ||
    | --- | --- | --- | --- |
    | 确定的大小   | EXACTLY | childSize |子 View 尺寸为一个确定大小.|
    | MATCH_PARENT | UNSPECIFIED |待定|子 view 根据自身情况，确定大小。|
    | WRAP_CONTENT | UNSPECIFIED |待定|子 View 根据自身情况，确定大小。|

