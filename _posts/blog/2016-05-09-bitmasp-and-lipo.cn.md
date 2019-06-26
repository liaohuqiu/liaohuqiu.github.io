---
layout: post_wide
permalink: /cn/posts/bitmasp-and-lipo/
title: "BitMask 使用参考"
description: ""
category: blog
---

### 为什么要使用 BitMask

在前一篇文章：[Android 中的 Enum 到底占多少内存？该如何用？][enum] 中提到内存占用的问题。

对于 Java 类应用，内存方面需要注意：

1. 不要占用大量内存，否则可用内存少；触发 GC 或 `OutOfMemoryError`；

2. 不要频繁创建对象，频繁内存分配，触发 GC。

对于枚举和常量:

1.  使用枚举，并不会使得对象的创建更加频繁。

2.  枚举类会比常量占用更多的内存，在程序运行期间，如果不卸载枚举类，内存就一直占用着。

    **相对于常量**，枚举占用的内存是较为可观的。

使用常量，可以大量节省内存，在 C 之类的语言中，大量使用 BitMask 来进行状态表示。

在 Android 中，也大量地使用了 BitMask，比如 `android.view.View` 这个类。

### 位操作

在使用 BitMask 前，我们先复习一下基本的位操作。

1. NOT

    ```
    NOT 0000 0001
      = 1111 1110
    ```
    
    比如：
    
    ```java
    int a = 1;
    int b = ~a;
    ```

2. OR

    ```
    OR  0000 0001
        0000 0010
      = 0000 0011
    ```
    
    比如：
    
    ```java
    int a = 1;
    int b = 2;
    int c = a | b;
    ```

3. AND
    
    ```
    AND 0000 0101
        0000 0110
      = 0000 0100
    ```
    
    比如：
    
    ```java
    int a = 5;
    int b = 6;
    int c = a & b;
    ```

### BitMask

我们知道，每一个 bit 可以有两种取值：0 或 1。

BitMask 采用一个数值来记录状态，使用这个数值的每一位来表达一个状态。

使用 BitMask 可用非常少的资源表达非常丰富的状态。

在 Java 中，一个 byte 类型，有 8 位（bit），可以表达 8 个不同的状态，并且这些状态是互不影响的。而 int 类型，则有 32 位，可以表达 32 种状态。

更为重要的是，基于 BitMask 可 **非常简单地** 进行组合状态查询。

#### BitMask 基本操作

假设我们用一个表示状态的数值: `status`，初始值为 0。

```java
byte status = 0;
```

我们定义一个 mask 数值，该数第二位为 1：`0000 0010`。

我们把 1 往左移动 1 位来得到这个数：

```java
byte mask = 0x01 << 1;
```

1.  设置状态

    其他位不管，把第 2 位变为 1 即可。

    ```
        xxxx xxxx
    OR  0000 0010
      = xxxx xx1x
    ```

    代码
        
    ```java
    status |= mask;
    ```

2.  清除状态

    其他位不管，把第 2 位置为 0。

    ```
        xxxx xxxx
    AND 1111 1101
      = xxxx xx0x
    ```

    这实际是对 `status` 和 `mask` 的反码进行逻辑『与』运算：
        
    ```java
    status &= ~mask;
    ```

3.  查询状态

    确定第 2 位是 0 还是 1，和 `mask` 进行逻辑『与』运算：

    ```
        xxxx xxxx
    AND 0000 0010
      = 0000 00x0
    ```

    如果为 1，返回一个大于 0 的值，否则返回 0。

    ```java
    boolean isOn = (status & mask) > 0;
    ```

### 例子

下面结合一个例子来做说明。

> 相关代码在这里： [https://github.com/liaohuqiu/android-BitMaskSample](https://github.com/liaohuqiu/android-BitMaskSample/blob/master/app%2Fsrc%2Fmain%2Fjava%2Fin%2Fsrain%2Fbitmasksample%2Fpeople%2FPoet.java)。

[李白][libo] 是个诗人，生活简单『朴素』：有时候写诗；有时候喝酒；有时候边写诗，边喝酒。

不管是忙于写诗还是忙于喝酒，李白都是在忙碌状态中。

我们用一个字节来表示他的状态，一个字节有 8 位，我们从低位起开始取两位分别代表写诗和喝酒。

```
   writing  ------+
                  |
                  v
     -------+---+---+---+
       x  x |   |   | x |
     -------+---+---+---+
              ^
              |
   drinking --+
```

两个 mask 为：

```java
// 0000 0010
private static final byte STATE_BUSY_IN_WRITING = 0x01 << 1;

// 0000 0100
private static final byte STATE_BUSY_IN_DRINKING = 0x01 << 2;
```

1.  状态设置与清除

    以设置 drinking 状态为例子，设置状态即和 mask 值进行逻辑『或』，清除状态与 mask 的反码进行逻辑『与』运算。

    ```java
    public void setBusyInDrinking(boolean busy) {
        if (busy) {
            mState |= STATE_BUSY_IN_DRINKING;
        } else {
            mState &= ~STATE_BUSY_IN_DRINKING;
        }
    }
    ```


2.  状态查询

    与 mask 进行逻辑『与』运行，判断是否为零即可：

    ```java
    public boolean isBusyInDrinking() {
        return (mState & STATE_BUSY_IN_DRINKING) != 0;
    }
    ```

3. 组合状态查询

    不管是忙于写诗还是忙于饮酒，都称为『李白很忙』，这是一种组合状态。只要处于这两种状态中的一种，即处于组合状态中。

    要进行状态组合，用逻辑『或』运算即可，当进行多个状态组合时，特别方便：

    ```java
    STATE_BUSY_MASK = STATE_BUSY_IN_WRITING | STATE_BUSY_IN_DRINKING
    ```

    判断是否处于组合状态中：

    ```java
    public boolean isBusy() {
        return (mState & STATE_BUSY_MASK) != 0;
    }
    ```

### Android 中的 IntDef

使用 IntDef 注解来声明常量值，定义变量时，加上 IntDef 所定义的声明，编译器会检查赋值是否合法。

声明：

```java
// 最后 8 位 0000 1100
static final int VISIBILITY_MASK = 0x0000000C;

public static final int VISIBLE = 0x00000000;

// 最后 8 位 0000 0100
public static final int INVISIBLE = 0x00000004;

// 最后 8 位 0000 1000
public static final int GONE = 0x00000008;

@IntDef({VISIBLE, INVISIBLE, GONE})
@Retention(RetentionPolicy.SOURCE)
public @interface Visibility {}
```

使用：

```java
public void setVisibility(@Visibility int visibility) {
    setFlags(visibility, VISIBILITY_MASK);
}
```

上面我们看到，代码中采用了最左的 3，4 位来表达 View 的可见性。

### 结论

除了 IntDef，还有 StringDef，有兴趣的同学可以看源码。

在 Android 的代码中有大量的 BitMask 的运用，像 `View`，`MotionEvent`  这样的核心基础类中，需要认真考虑内存的使用，能省则省。

如果你真想完全地掌控内存的使用，追求卓越的品质，想最大限度节省内存，BitMask 是你不错的选择。

同时，我们也应该清楚枚举也不是不能用。

我听到过很多论调，说用『枚举不好，官方也建议别用，因为占用很多内存，效率不高』，这些也都是人云亦云的典型。

实际上，除非你写的是类似 `View` 这样的核心基础类或者超大型应用，否则，如果连枚举这样内存开销都有问题的话，这个项目的问题就真的大了。

[enum]:             http://www.liaohuqiu.net/cn/posts/android-enum-memory-usage/
[libo]:             https://en.wikipedia.org/wiki/Li_Bai
