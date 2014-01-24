---
layout: post_wide
title:  Using High API level Method Compatibly
description: Using a high API level in method and compatible the low API level system.
category: blog
---
Android 版本更替，新的版本带来新的特性，新的方法。

新的方法带来许多便利，但无法在低版本系统上运行，如果兼容性处理不恰当，APP在低版本系统上，运行时将会crash。

本文以一个具体的例子说明如何在使用高API level的方法时处理好兼容性问题。

例子：**根据给出路径，获取此路径所在分区的总空间大小。**

在[安卓中的文件存储使用参考][1]中提到:
>  获取文件系统用量情况，在API level 9及其以上的系统，可直接调用`File`对象的相关方法，以下需自行计算

#####一般实现
就此需求而言，API level 9及其以上，调用 `File.getTotalSpace()` 即可, 但是在API level 8 以下系统`File`对象并不存在此方法。

如以下方法：

    /**
     * Returns the total size in bytes of the partition containing this path.
     * Returns 0 if this path does not exist.
     * 
     * @param path
     * @return -1 means path is null, 0 means path is not exist.
     */
    public static long getTotalSpace(File path) {
        if (path == null) {
            return -1;
        }
        return path.getTotalSpace();
    }

#####处理无法编译通过
如果`minSdkVersion`设置为8，那么build时候会报以下错误：

    Call requires API level 9 (current min is 8)

为了编译可以通过，可以添加 `@SuppressLint("NewApi")` 或者 `@TargeApi(9)`。

>  用`@TargeApi($API_LEVEL)`显式表明方法的API level要求，而不是`@SuppressLint("NewApi")`;

但是这样只是能编译通过，到了API level8的系统运行，将会引发 `java.lang.NoSuchMethodError`。

#####正确的做法
为了运行时不报错, 需要:

1.  判断运行时版本，在低版本系统不调用此方法
2.  同时为了保证功能的完整性，需要提供低版本功能实现

    如下：

    ```
    /**
     * Returns the total size in bytes of the partition containing this path.
     * Returns 0 if this path does not exist.
     * 
     * @param path
     * @return -1 means path is null, 0 means path is not exist.
     */
    @TargetApi(Build.VERSION_CODES.GINGERBREAD) 
        // using @TargeApi instead of @SuppressLint("NewApi")
    @SuppressWarnings("deprecation")
    public static long getTotalSpace(File path) {
        if (path == null) {
            return -1;
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.GINGERBREAD) {
            return path.getTotalSpace();
        }
        // implements getTotalSpace() in API lower than GINGERBREAD
        else {
            if (!path.exists()) {
                return 0;
            } else {
                final StatFs stats = new StatFs(path.getPath());
                // Using deprecated method in low API level system, 
                // add @SuppressWarnings("description") to suppress the warning
                return (long) stats.getBlockSize() * (long) stats.getBlockCount();
            }
        }
    }
    ```

####总结
在使用高于`minSdkVersion` API level的方法需要:

1. 用`@TargeApi($API_LEVEL)` 使可以编译通过, 不建议使用`@SuppressLint("NewApi")`;
2. 运行时判断API level; 仅在足够高，有此方法的API level系统中，调用此方法;
3. 保证功能完整性，保证低API版本通过其他方法提供功能实现。


[1]: http://www.liaohuqiu.net/storage-in-android/    "安卓文件存储使用参考"
