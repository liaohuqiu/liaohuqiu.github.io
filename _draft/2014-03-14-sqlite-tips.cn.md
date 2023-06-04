---
layout: post_wide
permalink: /cn/posts/sqlite-tips/
title: "SQLite 使用参考: 唯一索引，分页，清空表"
description: "本文使用一个例子讲述 Sqlite 中的索引，分页，和清空表的最佳做法"
keywords:   "sqlite 分页，sqllite 清空表，sqlite 索引"
category: blog
---
###需求
*  Android 中的 Sqlite
*  保存用户看过的书，isbn, title, read_time，多次看记录最后一次看的时间。
*  ListView 时间从新到旧显示，记录可能有很多，有翻页。
*  可清除所有历史记录

###数据库设计
*  id 主键，自增长
*  isbn 唯一键，记录重复，更新 read_time
*  read_time 索引。

```sql
CREATE TABLE s_read_books (
    id integer primary key autoincrement, 
    isbn text not null, 
    title text not null,
    read_time datetime not null, 
    unique (isbn) ON CONFLICT REPLACE
); 
CREATE INDEX s_read_books_time ON s_read_books (read_time);
```

###数据写入
```sql
INSERT INTO s_read_books(code, time, read_time) VALUES ($code, $time, $read_time);
```

数据更新，也用上个语句，重复则更新。

###分页
`limit num, offset` 在 sqlite，还是会全部读出数据，所以分页不用 offset。
`read_time`有索引，分页操作，根据之前的 `read_time` 用做条件筛选。

首次

```sql
SELECT * FROM s_read_books order by read_time desc limit $num_per_page
```

分页

```sql
SELECT * FROM s_read_books where read_time < $last_read_time order by read_time desc limit $num_per_page
```

###清空表

Sqlite 不支持 `truncate`，可用 `DELETE` 代替。

```sql
DELETE FROM s_read_books
```

但是效率更高的做法是，drop 掉表，然后重建。

```sql
DROP TABLE IF EXISTS s_read_books
```
