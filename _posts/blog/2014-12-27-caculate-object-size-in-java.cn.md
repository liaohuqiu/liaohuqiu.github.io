---
layout: post_wide
permalink: /cn/posts/caculate-object-size-in-java/
title: "JAVA 对象大小"
description: ""
category: blog
---

#### 对象内存大小度量

在做内存优化时，需要知道每个对象占用的内存的大小，

一个实例化的对象在内存中需要存储的信息包括：

1. 对象的头部（对象的GC信息，hash值，类定义引用等）
2. 对象的成员变量: 包括基本数据类型和引用。 如成员变量是一个引用, 引用了其他对象，被引用的对象内存另外计算。

如下一个简单的类的定义:

```java
class MyClass {
    int a;
    Object object;
}
```

实例化一个对象:

```java
MyClass myClass = new MyClass();
```

对象大小分为:

1. 自身的大小（Shadow heap size）
2. 所引用的对象的大小（Retained heap size）。

`myClass` 实例创建出来之后，在内存中所占的大小就是 `myClass` 自身大小（Shadow heap size）。包括类的头部大小以及一个int的大小和一个引用的大小。

`myClass` 中`object` 成员变量是一个对象引用，这个被引用的对象也占一定大小。`myClass` 实例所维护的引用的对象所占的大小，称为 `myClass` 实例的 Retained heap size。

本文讨论的是对象自身的大小，即 Shadow heap size。Retained heap size 递归计算即可得。

#### 度量工具

对象大小的计算可用` java.lang.instrument.Instrumentation` 或者 dump 内存之后用 memory analyzer 分析。 这是一份示例代码[java-object-size](https://github.com/liaohuqiu/java-object-size)

#### 基本数据类型大小

基本数据类型大小如下: [From WIKI](http://en.wikibooks.org/wiki/Java_Programming/Primitive_Types)

|type|size(bits)| bytes|
|---|---|---|
|boolean|8|1|
|byte|8|1|
|char|16|2|
|short|16|2|
|int|32|4|
|long|64|8|
|float|32|4|
|double|64|8|

#### 引用的大小

在 32 位的 JVM 上，一个对象引用占用 4 个字节；在 64 位上，占用 8 个字节。通过 `java -d64 -version` 可确定是否是 64 位的 JVM。

使用 8 个字节是为了能够管理大于 4G 的内存，如果你的程序不需要访问大于 4G 的内存，

可通过 `-XX:+UseCompressedOops` 选项，开启指针压缩。从 `Java 1.6.0_23` 起，这个选项默认是开的。可通过 `jinfo -flag UseCompressedOops <pid>` 查看。

```
localhost:~ srain$ jinfo -flag UseCompressedOops 13133
-XX:+UseCompressedOops
```

#### 对象头部的大小

对象头，结构如下[(来源)](http://mail.openjdk.java.net/pipermail/hotspot-runtime-dev/2008-May/000147.html):

```
+------------------+------------------+------------------ +---------------+
|    mark word     |   klass pointer  |  array size (opt) |    padding    |
+------------------+------------------+-------------------+---------------+
```

每个对象都有一个 mark work 头部，以及一个引用（klass pointer），指向类的信息。在 32 位 JVM 上，mark word 4 个字节，整个头部有 8 字节大小。

在未开启 `UseCompressedOops` 的 64 位 JVM 上，对象头有 16 字节大小，即 8 字节的 mark word 和 8 字节的引用。

在开启 `UseCompressedOops` 的 64 位机器上，引用成了 4 字节，一共 12 字节。 按照 8 位对齐，实际占用 16 字节。

#### 对象的内存布局

1.  每个对象的内存占用按 8 字节对齐

2.  空对象和类实例成员变量

    空对象，指的非 inner-class，没有实例属性的类。`Object` 类或者直接继承 `Object` 没有添加任何实例成员的类。

    空对象的不包含任何成员变量，其大小即对象头大小:  
    * 在 32 位 JVM 上，占用 8 字节；
    * 在未开启 `UseCompressedOops` 的 64 位 JVM 上，16 字节。（感谢评论区的 [@SingleCool][SingleCool] 纠正）
    * 在开启 `UseCompressedOops` 的 64 位 JVM 上，12 + 4 = 16；

3.  对象实例成员重排序

    实例成员变量紧随对象头。每个成员变量都尽量使本身的大小在内存中尽量对齐。

    比如 int 按 4 位对齐，long 按 8 位对齐。为了内存紧凑，实例成员在内存中的排列和声明的顺序可能不一致，实际会按以下顺序排序:
    1. doubles and longs
    2. ints and floats
    3. shorts and chars
    4. booleans and bytes
    5. references
    
    这样做可尽量节省空间。

    如:

    ```java
    class MyClass {
        byte a;
        int c;
        boolean d;
        long e;
        Object f;        
    }
    ```

    未重排之前:

    ```
         32 bit                    64bit +UseCompressedOops

    [HEADER:  8 bytes]  8           [HEADER: 12 bytes] 12
    [a:       1 byte ]  9           [a:       1 byte ] 13
    [padding: 3 bytes] 12           [padding: 3 bytes] 16
    [c:       4 bytes] 16           [c:       4 bytes] 20
    [d:       1 byte ] 17           [d:       1 byte ] 21
    [padding: 7 bytes] 24           [padding: 3 bytes] 24
    [e:       8 bytes] 32           [e:       8 bytes] 32
    [f:       4 bytes] 36           [f:       4 bytes] 36
    [padding: 4 bytes] 40           [padding: 4 bytes] 40
    ```

    重新排列之后：

    ```
        32 bit                      64bit +UseCompressedOops

    [HEADER:  8 bytes]  8           [HEADER: 12 bytes] 12
    [e:       8 bytes] 16           [e:       8 bytes] 20
    [c:       4 bytes] 20           [c:       4 bytes] 24
    [a:       1 byte ] 21           [a:       1 byte ] 25
    [d:       1 byte ] 22           [d:       1 byte ] 26
    [padding: 2 bytes] 24           [padding: 2 bytes] 28
    [f:       4 bytes] 28           [f:       4 bytes] 32
    [padding: 4 bytes] 32
    ```

4.  父类和子类的实例成员

    父类和子类的成员变量分开存放，先是父类的实例成员。父类实例成员变量结束之后，按4位对齐，随后接着子类实例成员变量。

    ```java
    class A {
        byte a;
    }

    class B extends A {
        byte b;
    }
    ```
    内存结构如下:

    ```
        32 bit                  64bit +UseCompressedOops

    [HEADER:  8 bytes]  8       [HEADER: 12 bytes] 12
    [a:       1 byte ]  9       [a:       1 byte ] 13
    [padding: 3 bytes] 12       [padding: 3 bytes] 16
    [b:       1 byte ] 13       [b:       1 byte ] 17
    [padding: 3 bytes] 16       [padding: 7 bytes] 24
    ```

    如果子类首个成员变量是 long 或者 double 等 8 字节数据类型，而父类结束时没有 8 位对齐。会把子类的小于 8 字节的实例成员先排列，直到能 8 字节对齐。

    ```
    class A {
        byte a;
    }

    class B extends A{
        long b;
        short c;  
        byte d;
    }
    ```
    内存结构如下:

    ```
        32 bit                  64bit +UseCompressedOops

    [HEADER:  8 bytes]  8       [HEADER:  8 bytes] 12
    [a:       1 byte ]  9       [a:       1 byte ] 13
    [padding: 3 bytes] 12       [padding: 3 bytes] 16
    [c:       2 bytes] 14       [b:       8 bytes] 24
    [d:       1 byte ] 15       [c:       4 byte ] 28
    [padding: 1 byte ] 16       [d:       1 byte ] 29
    [b:       8 bytes] 24       [padding: 3 bytes] 32
    ```

    上面的示例中，在 32 位的 JVM 上，B 的 2 个实例成员 c, d 被提前了。

5.  非静态的内部类，有一个隐藏的对外部类的引用。

#### 数组的内存占用大小

数组也是对象，故有对象的头部，另外数组还有一个记录数组长度的 int 类型，随后是每一个数组的元素：基本数据类型或者引用。8 字节对齐。

* 32 位的机器上

    byte[0] 8 字节的对象头部，4 字节的 int 长度, 12 字节，对齐后是 16 字节，实际 byte[0] ~ byte[4] 都是 16 字节。

* 64 位+UseCompressedOops

    byte[0] 是 16 字节大小，byte[1] ~ byte[8] 24 字节大小。

* 64 位-UseCompressedOops

    byte[0], 16 字节头部，4 字节的 int 长度信息，20 字节，对齐后 24 字节。byte[0] ~ byte[4] 都是 24 字节。


#### 字符串大小

|Field  | Type    |64 bit -UseCompressedOops| 64 bit +UseCompressedOops| 32 bit|
|---|---|---|---|---|
|HEADER |         | 16 |12|8|
|value  |char[]   | 8  |4|4|
|offset |int      | 4  |4|4|
|count  |int      | 4  |4|4|
|hash   |int      | 4  |4|4|
|PADDING|         | 4  |4|0|
|TOTAL  |         | 40 |32|24|

不计算 value 引用的 Retained heap size, 字符串本身就需要 24 ~ 40 字节大小。

#### 参考资料
---

http://www.codeinstructions.com/2008/12/java-objects-memory-structure.html

http://btoddb-java-sizing.blogspot.com/2012/01/object-sizes.html

http://stackoverflow.com/questions/2120437/object-vs-byte0-as-lock

[SingleCool]:       https://disqus.com/by/singlecool/
