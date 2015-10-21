---
layout: post_wide
title: "ISO 8601 in Bash, Java, PHP, Python"
description: ""
category: blog
---

Here is https://en.wikipedia.org/wiki/ISO_8601,  what we want is `2015-07-17T17:47:18+08:00`.

### BASH

format:

```bash
date +"%Y-%m-%dT%H:%M:%S%:z"
```

http://www.cyberciti.biz/faq/linux-unix-formatting-dates-for-display/

### PHP

It is easy!

```php
$time = time();
$time_str = date('c', $time);
```

The parsing is also easy.

```php
$time = strtotime($time_str);
```

http://php.net/manual/en/function.date.php

### Java

Java is verbose.

Format:

```java
/**
 * Transform Date to ISO 8601 string.
 */
public static String fromDate(final Date date) {
    String formatted = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ").format(date);
    return formatted.substring(0, 22) + ":" + formatted.substring(22);
}
```

Parse:

```java
/**
 * Transform ISO 8601 string to Date.
 */
public static Date toDate(final String iso8601string) throws ParseException {
    String s = iso8601string.replace("Z", "+00:00");
    try {
        s = s.substring(0, 22) + s.substring(23);  // to get rid of the ":"
    } catch (IndexOutOfBoundsException e) {
        throw new ParseException("Invalid length", 0);
    }
    SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");
    Date date = df.parse(s);
    return date;
}
```

http://stackoverflow.com/questions/2201925/converting-iso-8601-compliant-string-to-java-util-date

### Python

Format, oh no.

About parsing, you may need these:  

https://pypi.python.org/pypi/iso8601
