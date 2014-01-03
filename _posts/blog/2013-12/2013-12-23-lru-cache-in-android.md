---
layout: post
title: LUR cache in Android
description: 
category: blog
---
<h2> {{ page.title }} </h2>

###LUR cache

LRU cache can manager an set of object. 

* There is a queue in the cache. The recently used object, by get from or put into the cache, will be at the head of the queue.

* It has a capcity limit. When the total size of the object in the queue has exceed the limit, it will remove the eldest objects from the end of the queue till the total of the size of the remaining objects is at or below the limit size.

LRU cache has some interfaces:

    LRU cache
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

1. `sizeOf(K key, V value)` method return the size of each count which will be used to calculate the size of the whole size.
     The default implementions returns 1, which make the LUR cache only manager a limit amount of objects.

2. The method `put(K key, V value) cache the value to the cache and check the size. The object will be at the head of the queue.
3. The method `get(K key)` will return the value for the key if it is exist in the cache. 
     When a value is returned, it will move to the head of the queue.
     If not, method `create(K key)` will be called to create the value. If a the value has been created, it will be put into cache and the limit size will be checked.
4. `entryRemoved` will be call when an object is removed when the new value conrespong value of this key is put into cache
    or the total size of the cache has exceed the limit.

##Implemtations of LUR cache in Android



<p> {{ page.date | date_to_string }} </p>
