---
layout: post_wide
title: "Make GIF Snapshot for Android APP"
description: ""
keywords: "Make GIF Snapshot for Android APP"
category: blog
---

Recently, a lot of friends asked me how to make the GIF snapshots for an anroid APP, like the pictures here: https://github.com/liaohuqiu/android-Ultra-Pull-To-Refresh

Here I will give out 2 methods:

1.  [Licecap][] + [Genymotion][]

    [Licecap][] can capture the screen easily, it is also very easy to use.

    Your can run your app in [Genymotion][], then use [Licecap][] to reocord the screen.


2.  `adb shell` + [ezgif.com][]

    If your app can not run in [Genymotion][], you can choose this sloution.

    We can use `adb shell` to record the snapshots in `mp4` format on the device which API level is greater than 19, then convert it into `GIF` on [ezgif.com][].

    1. Reocord screen and pull the movie

        ```
        adb shell screenrecord --bit-rate 8000000  /sdcard/tmp-movie.mp4
        adb pull /sdcard/tmp-movie.mp4 ~/tmp/
        ```

        Click [Here][adb-shell] to read more about `adb shell`.

    2. Convert to GIF

        Once we have the movie, wo can use [ezgif.com][] to convert it into GIF

        [ezgif.com][] has a lot of awesome features, it can convert movies into GIF and also can edit and optmize the image.

>   By the way, I really like [ezgif.com][] and I've made a donate for it, hope you will like this website.

[Licecap]:          https://github.com/lepht/licecap
[Genymotion]:       https://www.genymotion.com/
[ezgif.com]:        http://ezgif.com/
[adb-shell]:        http://developer.android.com/tools/help/shell.html#screenrecord
