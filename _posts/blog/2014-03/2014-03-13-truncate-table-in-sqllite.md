---
layout: post_wide
title: SQLite清空数据库表
description: SQLite如何清空数据库表
category: blog
---
Sqlite 不支持`truncate`，可用 `DELETE`代替。

```
DELETE FROM table_name
```

但是效率更高的做法是，drop掉表，然后重建。
