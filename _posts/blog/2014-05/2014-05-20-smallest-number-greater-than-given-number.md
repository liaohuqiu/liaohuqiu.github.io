---
layout: post_wide
title: "find smallest number greater than given number out of a sorted list"
description: ""
keywords:   "binary serach"
category: blog
tags:   "algorithm"
---

Give out a sort list:

```
60, 80, 100, 120, 160, 320, 480, 640, 720, 1080
```

Find out the smallest number but greater than given number. For example:

```
10 => 80
60 => 80
100 => 100
140 => 160
200 => 320
1080 => 1080
1800 => 1080
```

Simply, we can use for a for loop to archive this, and its complexity is O(n);

Here I use a binary search, whose complexity will be O(logn):

```php
<?php
function bin_search($map, $num)
{
    $l = 0;
    $h = count($map) - 1;

    $f = $num;
    while ($h > $l)
    {
        $m = floor(($h + $l) / 2);
        if ($map[$m] >= $num)
        {
            $h = $m;
        }
        else
        {
            $l = $m;
        }
        if ($h == $l + 1)
        {
            break;
        }
    }
    return $map[$h];
}
function test($num)
{
    $map = array(
        60,
        80,
        100,
        120,
        160,
        320,
        480,
        640,
        720,
        1080,
    );

    printf("%s => %s\n", $num, bin_search($map, $num));
}
test(10);
test(60);
test(100);
test(140);
test(200);
test(1080);
test(1800);
```

The output:

```bash
[huqiu@101 ~]$ php test.php
10 => 80
60 => 80
100 => 100
140 => 160
200 => 320
1080 => 1080
1800 => 1080
```



