---
layout: post_wide
title:  Solution for Loading Image in Android
description: 
category: blog
---
<h2> {{ page.title }} </h2>

#### pre

A common work flow to load image from network:

    +-----------------------+
    |  Start to load        |
    +---------+-------------+
            |
            v
    +-----------------------+
    | Found in local cache  |
    +-------+---------------+
            |
        N --+--- Y ------------+
        |                      |
        v                      |
    +-----------------------+  |
    | Fetch from network    |  |
    +-------+---------------+  |
            |                  |
            v                  |
    +-----------------------+  |
    | Store to local cache  |  |
    +-------+---------------+  |
            |                  |
            v                  |
    +-----------------------+  |
    | Draw in ImageView     |<-+
    +-------+---------------+

---
#### Local Cache

1. Quota

2. Memory Cache

3. File Cache

> Reuse

---
#### Size and Format Control

* When from network

* When from local cache

> The image data in local cache is reused for a smaller size.

* Support `.webp` format.

---
#### Cross Thread

1. `Handler` and `LoadImageHandler`

2. Thread Pool

3. Task Schedule



---

<p> {{ page.date | date_to_string }} </p>
