---
layout: post
title: LRU cache in Android
description: An introduce to the LRU cache in Android
category: blog
---
<h2> {{ page.title }} </h2>

####LRU cache

LRU cache is very convinient to manager a list of data which has a limit space requirement.

LRU cache managers an object list. Each time a valued is accessed, it is moved to the head of the list. When a value is put into the cache, the value at the end of the list may be evicted.

There are two kinds of LruCache in Android: `LruCache` and `DiskLruCache`, the fisrt can be used to manager an set of objects, the later can be used to manager files.

A senoar that a LruCache can be used is to manager the quota of disk cache and memory cache when loading a network image.

After an image is loaded from the remote server, commonly it will be write to disk for further use. When the image is required to display in the `ImageView` we will decode the bitmap data from this file. The decoding operation is Cpu-time comsumed. To avoid the same image to be decode for multiple time for the bitmap data, the bitmap data will be cached in the memory after the first time it is decoded.

But the memory and the strage space is very limited, we can not take too much of that. Each time a file is writen to storage of a bitmap data is cached into memory, we must check the total size of the cached data and remove the eldest data if nessery.

Here, the `LRU Cache` will make things easy.

#### LruCache

`LruCache` is in the `support V4` package. It is very simple.


    LRU cache
        |
        +- -map, LinkedHashmap
        |
        +- +put(K key, V value)
        |
        +- +get(K key)
        |
        +- -sizeOf(K key, V value)
        |
        +- -entryRemoved(K key,V value)
        |
        +- -create(K key)


It has a `LinkedHashmap` inside, which is constructed by

     public LinkedHashMap(int initialCapacity, float loadFactor, boolean accessOrder)

The third parameter allow the `LinkedHashmap` to put the element to the head of the linked list after accessed, by `get` / `set`.

* There is a queue in the cache. The recently used object, by get from or put into the cache, will be at the head of the queue.

* It has a capcity limit. When the total size of the object in the queue has exceed the limit, it will remove the eldest objects from the end of the queue till the total of the size of the remaining objects is at or below the limit size.

1. `sizeOf(K key, V value)` method return the size of each count which will be used to calculate the size of the whole size.
     The default implementions returns 1, which make the LRU cache only manager a limit amount of objects.

2. The method `put(K key, V value) cache the value to the cache and check the size. The object will be at the head of the queue.
3. The method `get(K key)` will return the value for the key if it is exist in the cache. 
     When a value is returned, it will move to the head of the queue.
     If not, method `create(K key)` will be called to create the value. If a the value has been created, it will be put into cache and the limit size will be checked.
4. `entryRemoved` will be call when an object is removed when the new value conrespong value of this key is put into cache
    or the total size of the cache has exceed the limit.

####DiskLurCache




<p> {{ page.date | date_to_string }} </p>
