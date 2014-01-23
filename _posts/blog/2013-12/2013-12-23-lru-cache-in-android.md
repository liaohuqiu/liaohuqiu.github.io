---
layout: post_wide
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

But the memory and the strage space is very limited, we can not take too much of that. Each time a file is writen to storage of a bitmap data is cached into memory, we must check the total size of the cached data and remove the eldest objects if nessery.

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


The `LruCache` has a `LinkedHashmap` inside, which is constructed by

     public LinkedHashMap(int initialCapacity, float loadFactor, boolean accessOrder)

The third parameter allow the `LinkedHashmap` to put the element to the head of the linked list after accessed, both by `get` and `set`.

1. `sizeOf(K key, V value)` method return the size of each count which will be used to calculate the size of the whole size.
> The default implementions returns 1, which make the LRU cache only manager a limit amount of objects.
2. The method `put(K key, V value) cache the value to the cache and check the size.
3. The method `get(K key)` will return the value for the key if it is exist in the cache. 

    When a value is returned, it will move to the head of the queue, this is grantened by the `LinkedHashmap`;

    If the value is not exist, method `create(K key)` will be called to create the value. If a the value is created, it will be put into cache and the limit size will be checked. This will make the code simple.

4. `entryRemoved` will be call when an object is removed when the new value conrespong value of this key is put into cache
    or the total size of the cache has exceed the limit.

We can make a limit cache to store BitmapData:

    int cacheSizeInKB = 1024 * 10; // 10MB
    LruCache<String, Bitmap> cache = new LruCache<String, Bitmap>(cacheSizeInKB) {

        @Override
        protected void entryRemoved(boolean evicted, String key, Bitmap oldValue, Bitmap newValue) {
        }

        /**
         * Measure item size in kilobytes rather than units which is more practical for a bitmap cache
         */
        @Override
        protected int sizeOf(String key, Bitmap value) {
            final int bitmapSize =  value.getByteCount() / 1024;
            return bitmapSize == 0 ? 1 : bitmapSize;
        }
    };

####DiskLurCache




<p> {{ page.date | date_to_string }} </p>
