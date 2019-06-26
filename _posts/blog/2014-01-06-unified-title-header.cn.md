---
layout: post_wide
permalink: /cn/posts/unified-title-header
title:  Android 统一的页面头部
description: 本文介绍了使用 Activity 做页面，实现统一的页头的方法
category: blog
---

####需要解决的问题

没有统一的页头处理，导致：

* 各个页面的 layout 文件都需要细碎地包含页头信息，id 的不一致，给管理带来麻烦
* 有可能导致样式不统一
* 样式如果要改动，那必是伤筋动骨
* 各个页面，分头各自处理页头逻辑重复劳动，一些统一的逻辑，比如统一埋点，却又容易出现不一致
* 其他的更多

---

####解决方案

* 基本思路

    *   页头控件形式实现。
    *   一个基类 Activity 使用此控件，公开 `setTitle()` 等方法，处理页头点击返回，数据记录等逻辑。

* 抽象和封装
    1. `HeaderBarBase`: 对应的布局文件为：`base_header_bar_base.xml`。 
        * 处理左中右三个布局关系，用于样式统一。
        * 监听点击事件。监听左中右布局点击，避免实际区域太小无法点击的糟糕的用户体验。
        * 作为基类抽象，可扩展多多个页头：普通页头/特殊页头等。

        `HeaderBarBase.java`

            HeaderBarBase
               |
               +- +getLeftViewContianer()
               +- +getCenterViewContainer();
               +- +getRightViewContainer();
               |
               +- +setLeftOnClickListner();
               +- +setCenterOnClickListner();
               +- +setRightOnClickListner();
    2. `TitleHeaderBar` 继承于 `HeaderBarBase`, 对应的布局文件为：`base_header_bar_title.xml`，处理普通页头 UI 和业务逻辑。

       `TitleHeaderBar.java`

           TitleHeaderBar --> HeaderBarBase
               |
               +- +getLeftImageView();
               +- +getCenterTextView();
               +- +getRightTextView();
* 易用性的实现

    `TitleBaseActivity`, 包含了 `TitleHeaderBar`,  统一处理了页面页头逻辑。对应的布局文件为: `activity_title_base.xml`:

        <?xml version="1.0" encoding="utf-8"?>
        <LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:background="#ffffff"
            android:orientation="vertical" >

            <com.etao.mobile.views.header.TitleHeaderBar
            android:id="@+id/ly_header_bar_title_wrap"
            android:layout_width="match_parent"
            android:layout_height="44dp" >
            </com.etao.mobile.views.header.TitleHeaderBar>

        </LinearLayout>
    * `TitleBaseActivity`的内容为布局文件中`LinearLayout`;
    * `LinearLayout` 包含了一个 `TitleHeaderBar`, 可以统一统一页面返回，点击数据埋点等细化的业务逻辑;
    * 重写 `setContentView()`, 将内容添加到了此 `LinearLayout` 上
    * 直接继承 `TitleBaseActivity` 使用即可, 使用简单:

    `TitleBaseActivity.java`:

        TitleBaseActivity
           |
           +- -mContentViewContainer
           |
           +- -mTitleHeaderBar;     // protected, 子类可根据自身情况处理
           |
           +- -enableDefaultBack(); // 默认为true，点击左侧图标默认行为：返回
           |
           +- -setHeadTitle()       // 设置标题


* 扩展性

    即可继承 `TitleBaseActivity`, 也可以在布局文件中使用 `TitleHeaderBar`, 甚至可以从 `HeaderBarBase` 继承, 实现定制的头部。
