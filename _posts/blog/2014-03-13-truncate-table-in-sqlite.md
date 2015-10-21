---
layout: post_wide
title: Truncate talbe in SQLite
description: How to truncate table in Sqlite
category: blog
---
Sqlite doesn't have a `truncate` command, we can use `DELETE` command.

```
DELETE FROM table_name
```
However, it is much more efficient to drop the table and recreate it.
