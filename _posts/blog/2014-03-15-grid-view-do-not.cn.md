---
layout: post_wide
permalink: /cn/posts/grid-view-do-not
title: "Gridview 的错误用法及替代方案"
description: "类似9宫格的页面，使用 GridView，有可能导致首项被多次创建和绘制，本文给出一个替代方案。"
category: blog
---

九宫格是很常见的一种UI表现形式，当然根据实际情况，有可能是4宫格，6宫格之类的。

###常规实现

这样的 `m x n` 的表现形式，很容易让人想起用 GridView。但是数据项又不够多，不够翻页。

有些能够滑动翻页的，是重写 `Gridview` 的 `onMeasure` 方法，设置一个很大的高度，然后外面包一层 `ScrollView`。

* 带来的问题
    1. 这样会导致 `GirdView` 一次把全部列表项都加载完。`GirdView` 设计的 View 复用的初衷就达不到了。
    2. 如果列表项中有一个图片是后加载的，图片加载完后，`ImageView` 会 `requestLayout()`。这将会导致 `GridView`绘制第一项。

        如果总共有 9 项。最坏的情况，首项将会被绘制 9 次甚至更多。

###替代方案

对于这样的应用场景，如果不需要复用 view 也没有翻页的需求，简单绘制每一项就可以了。

1.  从索引 0 开始绘制每一项，计算行列位置。根据行列位置以及行列间距，每项大小确定每个 view 的起始位置。

2.  使用 `RelativeLayout` 做父容器，使用 margin 来偏移每项子元素。

3.  设定每项使用 `RelativeLayout.LayoutParams`，确定每项尺寸大小。尺寸状态都是 `EXACTLY`.

    ---

    简要代码如下：

    ```java
    // 总项数， 每项宽度和长度
    int len = mBlockListAdpater.getCount();
    int w = mBlockListAdpater.getBlockWidth();
    int h = mBlockListAdpater.getBlockHeight();
    int cloumnNum = mBlockListAdpater.getCloumnNum();
    
    // 水平间隔
    int horizontalSpacing = mBlockListAdpater.getHorizontalSpacing();
    
    // 垂直间隔
    int verticalSpacing = mBlockListAdpater.getVerticalSpacing();
    
    for (int i = 0; i < len; i++) {
    
        RelativeLayout.LayoutParams lyp = new RelativeLayout.LayoutParams(w, h);
    
        int row = i / cloumnNum;
        int clo = i % cloumnNum;
    
        int left = 0;
        int top = 0;
    
        // 计算偏移
        if (clo > 0) {
            left = (horizontalSpacing + w) * clo;
        }
        if (row > 0) {
            top = (verticalSpacing + h) * row;
        }
    
        // 用 margin 来偏移
        lyp.setMargins(left, top, 0, 0);
    
        // 创建view
        View view = mBlockListAdpater.getView(mLayoutInflater, i);
        addView(view, lyp);
    }
    ```

在上面代码中，实际创建 view 是在 `BlockListAdapter` 的 `getView()` 完成的，这是和 `ListAdapter` 类似的 Adapter，但是更简单。

* 带来的好处
    1.  简单可依赖，既然不用复用，那么就不用 AbsListView 的复用机制。继承于 `RelativeLayout`，核心函数简单可靠。
    2.  效率提升，不使用复用机制，每个 view 只被创建一次。


###例子

* Adapter

    ```java
    mBlockListAdapter = new BlockListAdapter<ItemInfo>() {
    
        @Override
        public View getView(LayoutInflater layoutInflater, int position) {
            ItemInfo itemInfo = mBlockListAdapter.getItem(position);

            // 创建
            View view =  LayoutInflater.from(getContext()).inflate(R.layout.item_home, null);

            // 业务相关代码
            TextView textView = ((TextView) view.findViewById(R.id.tv_item_home_title));

            ...
            
            return view;
        }
    };
    
    ```

*   ListView

    ```java
    // 设置水平距离和垂直距离，每项大小，列数
    mBlockListAdapter.setSpace(horizontalSpacing, verticalSpacing);
    mBlockListAdapter.setBlockSize(mSize, mSize);
    mBlockListAdapter.setColumnNum(3);

    // 关联 Adapte
    mBlockListView.setAdapter(mBlockListAdapter);

    // 显示数据
    mBlockListAdapter.displayBlocks(mItemInfos);
    ```

###源码

[BlockListAdapter 源码](https://github.com/etao-open-source/cube-sdk/blob/master/core/src/com/srain/cube/views/block/BlockListAdapter.java)

[BlockListView 的源码](https://github.com/etao-open-source/cube-sdk/blob/master/core/src/com/srain/cube/views/block/BlockListView.java)

[例子的源码](https://github.com/etao-open-source/cube-sdk/blob/master/sample-and-tests/src/com/srain/cube/sample/ui/fragment/HomeFragment.java)
