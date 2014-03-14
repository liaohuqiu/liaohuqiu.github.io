---
layout: post_wide
title: SQLite使用参考: 唯一索引，分页，清空表
description: ""
category: blog
---

###唯一索引

Sqlite 不支持`truncate`，可用 `DELETE`代替。

```
DELETE FROM table_name
```

但是效率更高的做法是，drop掉表，然后重建。
