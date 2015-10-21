---
layout: post_wide
title: "根据字符串获取资源id"
description: "android根据字符串获取资源id的多种方式"
category: blog
---

一般地，我们给一个`ImageView`设置一个图片可能会采用以下代码:

```java
int resId = R.drawable.icon;
imageView.setImageResource(resId);
```

有时我们有动态设置图片资源的需要，这是需要根据给定字符串获取指定资源的id，比如给出`icon`, 找到本地资源id，如下代码:

```java
function getResId(String name) {
}
```

Android提供这样的方法: [Resources.getIdentifier()](http://developer.android.com/reference/android/content/res/Resources.html#getIdentifier(java.lang.String,%20java.lang.String,%20java.lang.String))

使用方法如下:

```java
function getResId(String name, Context context) {
    Resources r = context.getResources();
    int id = r.getIdentifier("icon", "drawable", "in.srain.cube.sample");
    return id;
}
```
对于这个方法，官方不推荐:

> use of this function is discouraged. It is much more efficient to retrieve resources by identifier than by name.

在Nenus 5上，100,000次调用大概花费8500ms。另外，这个方法，需要一个`Context`的引用。

### 更好的做法
---

实际我们需要获取的是`R.drawable` 中一个变量，可以用反射:

```java
public static int getResId(String variableName, Class<?> c) {
    try {
        Field idField = c.getDeclaredField(variableName);
        return idField.getInt(idField);
    } catch (Exception e) {
        e.printStackTrace();
        return -1;
    }
}
```
[源码在这里](https://github.com/etao-open-source/cube-sdk/blob/b573b16108e4d6d776e15ef5ac999cb88e63a27e/core/src/in/srain/cube/util/ResourceMan.java)

使用方法:

```java
int id = ResourceMan.getResId("icon", R.drawable.class);
```

Nenus 5, 100,000次，大概是1700ms。这个方法快多了，也不需要带入Context.

---

当然，如果你足够大胆，你可以这样:

```java
function getResId(String name) {
    if ("icon".equals(name)) {
        return R.drawable.icon;
    }
    return -1;
}
```

但是这样的方法，维护起来简直是一个噩梦。
