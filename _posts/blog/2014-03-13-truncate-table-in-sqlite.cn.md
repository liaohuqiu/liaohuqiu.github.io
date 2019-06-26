---
layout: post_wide
permalink: /cn/posts/truncate-table-in-sqlite
title: SQLite 清空数据库表
description: SQLite 如何清空数据库表
category: blog
---
Sqlite 不支持`truncate`，可用 `DELETE`代替。

```
DELETE FROM table_name
```

但是效率更高的做法是，drop 掉表，然后重建。
