---
layout: post_wide
title: "Android object size in Dalvik"
description: ""
category: blog
---

### size of data

* reference 

    In HotSpot, an object reference is 4 bytes in 32 bit JVM, 8 bytes in 64 bit JVM with `-UseCompressedOops` and 4 bytes with `+UseCompressedOops`. In Dalvik, reference is always 4 bytes.

* primitive data type

    The size of the primitive data type is fixd, as following:

    |Data type          | 32 bit JVM | 64 bit -UseCompressedOops | 64bit +UseCompressedOops |
    |---|---|---|---|
    |Object reference   | 4 | 4 | 8 |
    |boolean            | 1 | 1 | 1 |
    |byte               | 1 | 1 | 1 |
    |char               | 2 | 2 | 2 |
    |short              | 2 | 2 | 2 |
    |int                | 4 | 4 | 4 |
    |float              | 4 | 4 | 4 |
    |long               | 8 | 8 | 8 |
    |double             | 8 | 8 | 8 |

    But the size of the primitive type data is very diffrent in Dalvik. 

    The size of a primitive data type is not the same when it is a field of object or a variable, from when it is an element in Array.

    |Data type          | Size as field / variable | Size in Array | 32 bit JVM | 64 bit - | 64bit + |
    |---|---|---|---|---|---|
    |Object reference   | 4 | 4 | 4 | 4 | 8 |
    |boolean            | 4 | 1 | 1 | 1 | 1 |
    |byte               | 4 | 1 | 1 | 1 | 1 |
    |char               | 4 | 2 | 2 | 2 | 2 |
    |short              | 4 | 2 | 2 | 2 | 2 |
    |int                | 4 | 4 | 4 | 4 | 4 |
    |float              | 4 | 4 | 4 | 4 | 4 |
    |long               | 8 | 8 | 8 | 8 | 8 |
    |double             | 8 | 8 | 8 | 8 | 8 |

### Size of object

*   Alignment

    In Dalvik, **the boundary alignment of an object is also 8 bytes**. 

*   Overhead of Object

    In HotSpot, as we know, the overhead of object is 8 bytes in 32 bit JVM, and 16 bytes in 64 bit JVM without `UseCompressedOops` and 12 bytes with `+UseCompressedOops`. The data size is as following:

    In Dalvik, this is diffrent. The memory of an object looks like:

    ```
    +---------------------+----------------------+----------+
    |overheade of Object  | overhead of dlmalloc |   data   |
    +---------------------+----------------------+----------+
    |   8 bytes           |  4 or 8 bytes        |          |
    +---------------------+----------------------+----------+
    ```

    There is another overhead for dlmalloc, which will take 4 or 8 bytes.

    So an empty object will take 16bytes, 12 bytes for overhead, 4 bytes for padding.

    Here are some examples:

    ```java
    class EmptyClass {
    }
    ```

    Total size: 8 (Object overhead) + 4 (dlmalloc)  = 12 bytes. For 8 byte alignment, the final total size is 16 bytes.

    ```java
    class Integer {
        int value;  // 4 bytes
    }
    ```

    The total size is: 8 + 4 + 4 (int) = 16 bytes.

    ```java
    static class HashMapEntry<K, V> {
        final K key;                // 4 bytes
        final int hash;             // 4 bytes
        V value;                    // 4 bytes
        HashMapEntry<K, V> next;    // 4 bytes
    }
    ```

    The total size: 8 + 4 + 4 * 4 = 28 bytes. Total aligned is 32 bytes.

### Size of Array

The memory layout of Array looks like:

```
+---------------------+----------------------+----------+---------+------+
|overheade of Object  | overhead of dlmalloc |   size   | padding | data |
+---------------------+----------------------+----------+---------+------+
|   8 bytes           |  4 or 8 bytes        |  4 bytes | 4 bytes |      |
+---------------------+----------------------+----------+---------+------+
```

The alignment is also 8 bytes.

So `byte[0]` will take: 8 + 4 + 4 + 4 = 20 bytes. The final size after aligned is 24 bytes.

`byte[0]` ~ `byte[4]` are all 24 bytes.

`char[0] will also take 24 bytes. And from `char[0]` to `char[2]`, ther are all 24 bytes.


#### String

String is defined as below:

```java
class String {
    private final char[] value; // 4 bytes

    private final int offset;   // 4 bytes

    private final int count;    // 4 bytes

    private int hashCode;       // 4 bytes
}
```

Total size: 8 + 4 + 4 * 4 = 28 bytes. Total aligned is 32 bytes, which is exlcude the retained memory of char array(at least 24 bytes).

So even an empty String, it will still take at least 32 bytes of shadow heap and 24 bytes of retained heap.

#### References

http://stackoverflow.com/questions/14738786/how-are-java-objects-laid-out-in-memory-on-android

http://stackoverflow.com/questions/9009544/android-dalvik-get-the-size-of-an-object

https://speakerdeck.com/romainguy/android-memories

http://www.slideshare.net/SOURCEConference/forensic-memory-analysis-of-androids-dalvik-virtual-machine

http://stackoverflow.com/questions/10824677/is-dalvik-even-more-memory-hungry-than-hotspot-in-terms-of-object-sizes/
