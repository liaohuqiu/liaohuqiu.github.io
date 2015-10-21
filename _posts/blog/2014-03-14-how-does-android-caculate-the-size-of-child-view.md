---
layout: post_wide
title: "How Android caculates view size"
description: "How does android caculate the size of view."
category: blog
---

###View and ViewGroup

There are five basic `ViewGroup` in Android:

*   FrameLayout
*   RelativeLayout
*   LinearLayout
*   TableLayout
*   AbsoluteLayout

The `ViewGroup` can contains children views:

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

###How big the child view want to be

*   **LayoutParams**

    We use `LayoutParams` to describe how big a view will be both width and height. For each dimension, its data type is `int` and it can specify one of:
    1.  `FILL_PARENT` / `MATCH_PARENT`, the value is `-1`. 

        Make the view as big as its parent, **minus padding**.
    2.  `WRAP_CONTENT`, the value is `-2`. 
    
        Make the view just be big enough to enclose its content, **plus padding**.
    3.  An exact number, not lower than 0.

###How big the parent view is
*   **Padding**

    The space between the real size and the content of the view.

*   **MeasureSpec**

    When parent view try to figure out the size of its children, it must tell the child the size information of itself.

    The size of child view  will be under different constraint when parent view is in different view mode, there are 3 view modes:

    | parent | child |
    | --- | --- |
    | UNSPECIFIED |The parent has not imposed any constraint on the child. It can be whatever size it wants.|
    | EXACTLY |The parent has determined an exact size for the child. The child is going to be given those bounds regardless of how big it wants to be.|
    | AT_MOST |The child can be as large as it wants up to the specified size.|

*   **size value and size mode**

    The data type of a dimension of size is `int`, the length is 8 bytes.

    For the size vaule and size mode will be passed to child view from parent view, for reducing object allocation.

    The size mode information has been packed into the size value, ine the fist 2 bits in the first byte.
    1.  `UNSPECIFIED`

        ```
        +-----------+----------
        | 00xx xxxx | The other 7 bytes.    0x00 << 30 + value
        +-----------+----------
        ```
    2. `EXACTLY`

        ```
        +-----------+----------
        | 01xx xxxx | The other 7 bytes.    0x01 << 30 + value
        +-----------+----------
        ```
    3. `AT_MOST`

        ```
        +-----------+----------
        | 10xx xxxx | The other 7 bytes.    0x02 << 30 + value
        +-----------+----------
        ```

###How big the child will be

The parent has a size constraint and the children have their desire. So the negotiation begins:

1.  Acroding accroding parent's size constraint and children's LayoutParams, parent view can figure out the view size and view mode of its children.

    Then the parent will reqiure the children view to measure itself, by calling child's `measure()` method.
2.  In the `onMeasure()` method in the child view, acroding the size information given out by its parent, child view will decide the final view size of itself.
3.  Acroding this final size of children views, parent view also can decide its final view size.

**Factors should be taken into consideration:**

*   parent view modes:
    1. EXACTLY
    2. AT_MOST
    3. UNSPECIFIED
*   parent view size: `parentSize`
*   parent padding:`parentPadding`
    
    The content size of parent is `parentSize` - `parentPadding`, name it `parentContentSize`
*   child LayoutParams:
    1.  exact number, `childSize`
    2.  MATCH_PARENT
    3.  WRAP_CONTENT

**What should be settled:**

*   child view mode
*   child view size

**The rule**

*   Parent view is in `EXACTLY` view mode, it has imposed an exact size on its children

    | child layout | mode |  size ||
    | --- | --- | --- | --- |
    | exact size   | EXACTLY | childSize |Child wants a specific size.|
    | MATCH_PARENT | EXACTLY | parentContentSize|Child wants to be parent's size.|
    | WRAP_CONTENT | AT_MOST | parentContentSize|Child wants to determine its own size. It can not be bigger than parent.|

*   Parent view is in `AT_MOST` view mode, it has imposed a **maximum** size on its children.

    | child layout | mode |  size ||
    | --- | --- | --- | --- |
    | exact size   | EXACTLY | childSize |Child wants a specific size|
    | MATCH_PARENT | AT_MOST | parentContentSize|Child wants to be parent's size, but parent's size is not fixed. Constrain child to not be bigger than parent.|
    | WRAP_CONTENT | AT_MOST | parentContentSize|Child wants to determine its own size, but it can not be bigger than parent.|

*   Parent view is in `UNSPECIFIED` view mode, it ask to see how big its children want to be.

    | child layout | mode |  size ||
    | --- | --- | --- | --- |
    | exact size   | EXACTLY | childSize |Child wants a specific size.|
    | MATCH_PARENT | UNSPECIFIED |can not decide yet|Child wants to be parent's size. Child will decide its own size later.|
    | WRAP_CONTENT | UNSPECIFIED |can not decide yet|Child wants to be its own size. Child will decide its own size later.|

