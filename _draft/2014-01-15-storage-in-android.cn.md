---
layout: post_wide
permalink: /cn/posts/storage-in-android/
title:  Android 存储使用参考
description: 本文介绍了安卓使用存储时会遇到的一些问题，以及处理参考。
category: blog
---
#### 可能遇到的问题
Android 系统自身自带有存储，另外也可以通过 SD 卡来扩充存储空间。
前者空间较小，后者空间大，但后者不一定可用。
开发应用，处理本地数据存取时，可能会遇到这些问题：

1.  需要判断 SD 卡是否可用: 占用过多机身内部存储，容易招致用户反感，优先将数据存放于 SD 卡;
2.  应用数据存放路径，同其他应用应该保持一致，应用卸载时，清除数据:
    * 标新立异在 SD 卡根目录建一个目录，招致用户反感
    * 用户卸载应用后，残留目录或者数据在用户机器上，招致用户反感

3.  需要判断两者的可用空间: SD 卡存在时，可用空间反而小于机身内部存储，这时应该选用机身存储;
4.  数据安全性，本应用数据不愿意被其他应用读写;
5.  图片缓存等，不应该被扫描加入到用户相册等媒体库中去。

---
####基本操作

1.  使用外部存储，需要的权限，在`AndoridManifest.xml`中:

        <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
        <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />

    >   从 API 19 / Andorid 4.4 / KITKAT 开始，不再需要显式声明这两个权限，除非要读写其他应用的应用数据(`$appDataDir`)

2.  判断 sd 卡可用：

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

---
#### 存储的用量情况
*   根据系统用户不同，所能占用的存储空间大小也有不同
    >   在 API level 9 及其以上时，`File` 对象的 `getFreeSpace()` 方法获取系统 root 用户可用空间；

    >   `getUsableSpace()` 取非 root 用户可用空间

*   当有多个存储可用时获取磁盘用量，根据当前系统情况选用合适的存储。
*   根据系统存储用量，合理设定 app 所用的空间大小；运行时，也可做动态调整。

*   在 API level 9 及其以上的系统，可直接调用 `File` 对象的相关方法，以下需自行计算:
    
    ```
    @TargetApi(VERSION_CODES.GINGERBREAD)
    public static long getUsableSpace(File path) {
        if (path == null) {
            return -1;
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.GINGERBREAD) {
            return path.getUsableSpace();
        } else {
            if (!path.exists()) {
                return 0;
            } else {
                final StatFs stats = new StatFs(path.getPath());
                return (long) stats.getBlockSize() * (long) stats.getAvailableBlocks();
            }
        }
    }
    ```

---
####路径的规律

一般地，通过 `Context` 和 `Environment` 相关的方法获取文件存取的路径。

通过这两个类可获取各种路径，如图：

```
    ($rootDir)
+- /data                -> Environment.getDataDirectory()
|   |
|   |   ($appDataDir)
|   +- data/com.srain.cube.sample
|       |
|       |   ($filesDir)
|       +- files            -> Context.getFilesDir() / Context.getFileStreamPath("")
|       |       |
|       |       +- file1    -> Context.getFileStreamPath("file1")
|       |   ($cacheDir)
|       +- cache            -> Context.getCacheDir()
|       |
|       +- app_$name        ->(Context.getDir(String name, int mode)
|
|   ($rootDir)
+- /storage/sdcard0     -> Environment.getExternalStorageDirectory()
    |                       / Environment.getExternalStoragePublicDirectory("")
    |
    +- dir1             -> Environment.getExternalStoragePublicDirectory("dir1")
    |
    |   ($appDataDir)
    +- Andorid/data/com.srain.cube.sample
        |
        |   ($filesDir)
        +- files        -> Context.getExternalFilesDir("")
        |   |
        |   +- file1    -> Context.getExternalFilesDir("file1")
        |   +- Music    -> Context.getExternalFilesDir(Environment.Music);
        |   +- Picture  -> ... Environment.Picture
        |   +- ...
        |
        |   ($cacheDir)
        +- cache        -> Context.getExternalCacheDir()
        |
        +- ???

```

---
####各个路径的特性
下面介绍这些路径的特性以及使用中需要注意的细节:

1.  根目录(`$rootDir`)：
    * 内部存储路径： `/data`, 通过 `Environment.getDataDirectory()` 获取
    * 外部存储路径： `/storage/sdcard0` (也有类似 /mnt/ 这样的），通过 `Environment.getExternalStorageDirectory()` 获取
        
        示例:

        ```
        Environment.getDataDirectory(): 
                /data

        Environment.getExternalStorageDirectory(): 
                /storage/sdcard0
        ```
    ---
2.  应用数据目录(`$appDataDir`)
    * 内部储存: `$appDataDir = $rootDir/data/$packageName`, 
    * 外部存储: `$appDataDir = $rootDir/Andorid/data/$packageName`

    ***在这些目录下的数据，在 app 卸载之后，会被系统删除，我们应将应用的数据放于这两个目录中。***

    ---
3. 外部存储中，公开的数据目录。
    这些目录将不会随着应用的删除而被系统删除，请斟酌使用:

    ```
    Environment.getExternalStorageDirectory(): 
        /storage/sdcard0

    // 同 $rootDir
    Environment.getExternalStoragePublicDirectory(""): 
        /storage/sdcard0

    Environment.getExternalStoragePublicDirectory("folder1"): 
        /storage/sdcard0/folder1
    ```

    ---
4.  应用数据目录下的目录

    **一般的在 $appDataDir 下，会有两个目录**：

    1. 数据缓存：`$cacheDir = $appDataDir/cache`:  
        * 内部存储：`Context.getCacheDir()`, 机身内存不足时，文件会被删除
        * 外部存储：`Context.getExternalCacheDir()`

            外部存储没有实时监控，当空间不足时，文件不会实时被删除，可能返回空对象

            示例:

            ```
            Context.getCacheDir(): 
                    /data/data/com.srain.cube.sample/cache

            Context.getExternalCacheDir(): 
                    /storage/sdcard0/Android/data/com.srain.cube.sample/cache
            ```
    2. 文件目录 `$filesDir = $appDataDir/files`:  
        * 内部存储：通过 `Context.getFilesDir()` 获取

            `Context.getFileStreamPath(String name)`返回以`name`为文件名的文件对象，`name` 为空，则返回 `$filesDir` 本身

            示例:

            ```
            Context.getFilesDir(): 
                    /data/data/com.srain.cube.sample/files

            Context.getFileStreamPath(""):
                    /data/data/com.srain.cube.sample/files

            Context.getFileStreamPath("file1"):
                    /data/data/com.srain.cube.sample/files/file1
            ```
        * 外部存储：通过 `Context.getExternalFilesDir(String type)`, `type` 为空字符串时获取.

            `type` 系统指定了几种类型:

            ```
            Environment.DIRECTORY_MUSIC
            Environment.DIRECTORY_PICTURES
            ...
            ```

            示例:

            ```
            Context.getExternalFilesDir(""): 
                    /storage/sdcard0/Android/data/com.srain.cube.sample/files

            Context.getExternalFilesDir(Environment.DIRECTORY_MUSIC)
                    /storage/sdcard0/Android/data/com.srain.cube.sample/files/Music
            ```

        ---
    4.  `$cacheDir / $filesDir` 安全性

        在内部存储中，`$cacheDir`, `$filesDir`是 app 安全的，其他应用无法读取本应用的数据，而外部存储则不是。

        在外部存储中，这两个文件夹其他应用程序也可访问。

        ***在外部存储中，`$filesDir`中的媒体文件，不会被当做媒体扫描出来，加到媒体库中。***

        ---
    5.  `$cacheDir / $filesDir` 同级目录

        在内部存储中：通过 `Context.getDir(String name, int mode)`可获取和 `$filesDir` / `$cacheDir` 同级的目录

        目录的命名规则为 `app_ + name`, 通过 mode 可控制此目录为 app 私有还是其他 app 可读写。

        示例:

        ```
        Context.getDir("dir1", MODE_PRIVATE):
                Context.getDir: /data/data/com.srain.cube.sample/app_dir1
        ```

        ---
    6.  **特别注意, 对于外部存储，获取 `$cacheDir` 或者 `$filesDir` 及其下的路径**

        在 API level 8 以下，或者空间不足，相关的方法获路径为空时，需要自己构造。

        ```
        @TargetApi(VERSION_CODES.FROYO)
        public static File getExternalCacheDir(Context context) {

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.FROYO)) {
                File path = context.getExternalCacheDir();

                // In some case, even the sd card is mounted,
                // getExternalCacheDir will return null
                // may be it is nearly full.
                if (path != null) {
                    return path;
                }
            }

            // Before Froyo or the path is null,
            // we need to construct the external cache folder ourselves
            final String cacheDir = "/Android/data/" + context.getPackageName() + "/cache/";
            return new File(Environment.getExternalStorageDirectory().getPath() + cacheDir);
        }
        ```

---
####相关代码：
[https://github.com/liaohuqiu/cube-sdk/blob/master/core/src/com/srain/cube/file/FileUtil.java](https://github.com/liaohuqiu/cube-sdk/blob/master/core/src/com/srain/cube/file/FileUtil.java)
