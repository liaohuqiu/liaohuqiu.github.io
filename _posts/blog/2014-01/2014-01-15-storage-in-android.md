---
layout: post_wide
title:  Some Useful Tips in Using Stotage in Andorid
description: 
             <ul>
             <li>Som usefule tips</li>
             <li>安卓使用存储时会遇到的一些问题，以及处理参考</li>
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
    * 标新立异在sd卡根目录建一个目录，招致用户反感
    * 用户卸载应用后，残留目录或者数据在用户机器上，招致用户反感

3.  需要判断两者的可用空间: sd卡存在时，可用空间反而小于机身内部存储，这时应该选用机身存储;
4.  数据安全性，本应用数据不愿意被其他应用读写;
5.  图片缓存等，不应该被扫描加入到用户相册等媒体库中去。

####基本操作
---

1.  使用外部存储，需要的权限，在`AndoridManifest.xml`中:

        <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
        <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />

    从API 19 / Andorid 4.4 / KITKAT开始，不再需要显示声明这两个权限，除非要读写其他应用的应用数据(`$appDataDir`)

2.  判断sd卡可用：

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

####路径的规律

一般地，通过`Context` 和 `Environment`相关的方法获取文件存取的路径。

通过这两个类可获取各种路径，如图：

```
   +- /data                -> Environment.getDataDirectory()
   |   |
   |   +- data/com.srain.cube.sample
   |       |
   |       +- files            -> Context.getFilesDir() / Context.getFileStreamPath("")
   |       |       |
   |       |       +- file1    -> Context.getFileStreamPath("file1")
   |       +- cache            -> Context.getCacheDir()
   |       |
   |       +- app_$name        ->(Context.getDir(String name, int mode)
   |
   +- /storage/sdcard0     -> Environment.getExternalStorageDirectory()
       |                       / Environment.getExternalStoragePublicDirectory("")
       |
       +- dir1             -> Environment.getExternalStoragePublicDirectory("dir1")
       |
       +- Andorid/data/com.srain.cube.sample
           |
           +- files        -> Context.getExternalFilesDir("")
           |   |
           |   +- file1    -> Context.getExternalFilesDir("file1")
           |   +- Music    -> Context.getExternalFilesDir(Environment.Music);
           |   +- Picture  -> ... Environment.Picture
           |   +- ...
           |
           +- cache        -> Context.getExternalCacheDir()
           |
           +- ???
   
```

---
下面介绍这些路径的特性以及使用中需要注意的细节:

1.  根目录(`$rootDir`)：

    * 一般说来，内部存储路径: `/data`, 通过`Environment.getDataDirectory()` 获取
    * 外部存储路径： `/storage/sdcard0` (也有类似 /mnt/ 这样的）,通过`Environment.getExternalStorageDirectory()`获取
        
        ```
        Environment.getDataDirectory(): 
                /data

        Environment.getExternalStorageDirectory(): 
                /storage/sdcard0
        ```

2.  应用数据目录(`$appDataDir`)，

    * 内部储存：  `$appDataDir = $rootDir/data/$packageName`, 
    * 外部存储:   `$appDataDir = $rootDir/Andorid/data/$packageName`

    在这些目录下的数据，在app卸载之后，会被系统删除，我们应将应用的数据放于这两个目录下面。

    > 在API level 8 以下，或者在外部存储空间不足，相关的方法获取$appDataDir下的相关路径为空时，需要自己构造.

    **一般的在$appDataDir下，会有两个目录**：

    1.  数据缓存：`$cacheDir = $appDataDir/cache`:  
        * 内部存储：`Context.getCacheDir()`, 机身内存不足时，文件会被删除
        * 外部存储: `Context.getExternalCacheDir()`, 外部存储没有实时监控，当空间不足时，文件不会实时被删除，可能返回空对象
            
        ```
        Context.getCacheDir(): 
                /data/data/com.srain.cube.sample/cache

        Context.getExternalCacheDir(): 
                /storage/sdcard0/Android/data/com.srain.cube.sample/cache
        ```

    2. 文件目录 `$filesDir = $appDataDir/files`:  
        * 内部存储：通过`Context.getFilesDir()` 获取

          `Context.getFileStreamPath(String name)`返回以`name`为文件名的文件对象，`name`为空，则返回 `$filesDir` 本身

        ```
        Context.getFilesDir(): 
                /data/data/com.srain.cube.sample/files

        Context.getFileStreamPath(""):
                /data/data/com.srain.cube.sample/files

        Context.getFileStreamPath("file1"):
                /data/data/com.srain.cube.sample/files/file1
        ```

        * 外部存储：通过`Context.getExternalFilesDir(String type)`, `type`为空字符串时获取.

            `type`系统指定了几种类型:

        ```
        Environment.DIRECTORY_MUSIC
        Environment.DIRECTORY_PICTURES
        ...
        ```

        ```
        Context.getExternalCacheDirs(): 
                /storage/sdcard0/Android/data/com.srain.cube.sample/files

        Context.getExternalFilesDir(Environment.DIRECTORY_MUSIC)
                /storage/sdcard0/Android/data/com.srain.cube.sample/files/Music
        ```

    3.  在内部存储中，`$cacheDir`, `$filesDir`是app安全的，其他应用无法读取本应用的数据，而外部存储则不是。

        在外部存储中，这两个文件夹其他应用程序也可访问。

        在外部存储中，`$filesDir`中的媒体文件，不会被当做媒体扫描出来，加到媒体库中。

    4.  在内部存储中：通过 `Context.getDir(String name, int mode)`可获取和 `$filesDir` / `$cacheDir` 同级的目录

        通过mode可控制此目录为app私有还是其他app可读写。

        目录的命名规则为 `app_ + name`:

        ```
        Context.getDir("dir1", MODE_PRIVATE):
                Context.getDir: /data/data/com.srain.cube.sample/app_dir1
        ```
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
#### 磁盘用量
机身存储在空间不足时会删除一些文件，外部存储

---

<p> {{ page.date | date_to_string }} </p>
