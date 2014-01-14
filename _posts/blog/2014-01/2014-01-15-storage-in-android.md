---
layout: post_wide
title:  Some Useful Tips in Using Stotage in Andorid
description: 
             <ul>
             <li>安卓开发做性能优化时，如何分析内存使用？如何查看app中方法调用情况，找出性能瓶颈？
             </ul>
category: blog
---
<h2> {{ page.title }} </h2>

####可能遇到的问题
android系统自身自带有存储，另外也可以通过sd卡来扩充存储空间。前者好比pc中的硬盘，后者好移动硬盘。
前者空间较小，后者空间大，但后者不一定可用。
开发应用，处理本地数据存取时，可能会遇到这些问题：

1.  需要判断sd卡是否可用: 占用过多机身内部存储，容易招致用户反感，优先将数据存放于sd卡;
2.  应用数据存放路径，同其他应用应该保持一致，应用卸载时，清除数据:
    * 标新立异在sd卡根目录建一个目录，只能招致用户反感
    * 用户卸载应用后，残留目录或者数据在用户机器上，等用户边清理边骂娘？

3.  需要判断两者的可用空间: sd卡存在时，可用空间反而小于机身内部存储，这时应该选用机身存储;

####sd卡可用性

    /**
     * Check if the primary "external" storage device is available.
     * 
     * @return
     */
    public static boolean hasSDCardMounted() {
        String state = Environment.getExternalStorageState();
        if (state != null && state.equals(Environment.MEDIA_MOUNTED)) {
            return true;
        } else {
            return false;
        }
    }

####路径统一，用法统计
---

<p> {{ page.date | date_to_string }} </p>
