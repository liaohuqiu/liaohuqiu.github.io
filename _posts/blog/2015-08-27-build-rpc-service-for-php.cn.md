---
layout: post_wide
permalink: /cn/posts/build-rpc-service-for-php
title: "为 PHP 构建 RPC 服务"
description: ""
category: blog
---

本文为 ["2015 年一淘网、腾讯网媒&微博商业联合技术沙龙"](http://wattech.eventdove.com/) Keynote 对应的博客文章。

对应的 Keynote 在 http://www.slideshare.net/HuqiuLiao/build-rpc-for-php

有问题随时交流，欢迎关注我新浪微博: http://weibo.com/liaohuqiu 

本文提到的所有项目和代码都在我的 GitHub: https://github.com/liaohuqiu 同样欢迎关注。

### PHP + RPC

PHP 为了资源格式，用进程方式处理请求，这使得一些和业务系统的状态量无法在 PHP 程序中进行良好的访问。

一些类似实时排行的业务需求，借助缓存实现或者 DB （当然，这时非常错误的做法）都无法很好实现。

对于类似这样系统业务状态量的实时计算更新使用中间件来实现再方便不过了。

现在 ICE， Thrift 等解决方案稍显笨重，开发调试部署并非一件轻松愉快的事情。而类似 YAR 这样的实现，简单但却非高效。

对于 PHP 我们需要一个简单高效，容易开发，容易调试，容易维护和扩展的 RPC 服务。

### Cube PRC

[Cube RPC](http://weibo.com/liaohuqiu) 是基于 TCP/UDP 的半双工的 RPC 协议。简单，高效，容易调试和部署。

```
    +--------+           +--------+
    |        | <-------- |        |
    | Server |           | Client |
    |        | --------> |        |
    +--------+           +--------+
```

本文给出该协议设计时的一些考虑。

* 序列化协议的选择

    选用简单类型的序列化协议，没有选择低效的 JSON， 也没有使用 Google Protobuf。选用了 [BinPack](http://binpack.liaohuqiu.net/)，比 MessagePack 更为简单和高效。

* RPC 协议

    * 消息包含消息头部和消息体，如下

        ```
        +--------------------+ 
        | HEADER + BODY ...  |
        +--------------------+ 
        ```

    * 消息类型

        Query (From client to server)
        Answer (From server to client)
        Welcome (From server to client)
        Close (client to server, or server to client)

    * 调用流程图

    ```
    +--------+      +--------+
    | Server |      | Client |
    +--------+      +--------+
         |               |
         | <-------------|
         |               |
         |  Welcome      |
         | ------------> |
         |               |
         |  Query        |
         | <-------------|
         |               |
         |  Answer       |
         | ------------> |
         |               |
         | <-------------|
         | ------------> |
         |               |
         |  Closed       |
         | <-------------|
         |               |
         |               |
         | ---- X -------|
         |               |
         |               |
         |               |
    ```

    * 调用流程

        * 连接建立，Server 发送 Welcome 消息。Client 收到 Welcome 消息之后才可以发送 `Query`
        * 当 Client 或者 Server 要关闭连接时，发送 Closed 消息，另一方资源清理然后断开链接，己方侦测到链接断开后清理资源。

    * Proxy

        * 在 Server 侧，Proxy 看起来是一个 Client
        * 在 Client 侧，Proxy 看起来却又像一个 Server

### 消息头部

* 数据结构

    ```c
    struct Header {
    	union {
    		char bytes[2];
    		uint16_t u16;
    	} magic;
    	uint8_t version;
    	uint8_t msgType;
        /**
         * only Query and Answer has this field
         */
    	uint32_t bodySize; // little engine
    };
    ```

* 文本表现形式:

    ```
    byte    "C"
    byte    "B"
    byte    version
    byte    message_type
    
    int32   body_size
    ```

* Message Type

    ```
    MESSAGE_TYPE_WELCOME        = 0x01
    MESSAGE_TYPE_CLOSE          = 0x02
    MESSAGE_TYPE_QUERY          = 0x03
    MESSAGE_TYPE_ANSWER         = 0x04
    ```

#### 消息体

* Query

    Query 消息体是一个数组
    
    ```
    int     qid;      // 1
    string  service;  // android-gems
    string  method;   // get_index_data
    dict    params;   // {}
    ```
    
    PHP 代码如下:
    
    ```PHP
    // pack data
    $data = array($qid, $this->service, $method, $params);
    $str = bin_encode($data);
    $data_len = strlen($str);
    
    // pack header
    $header = pack('A2C2V', self::MESSAGE_MAGIC, self::MESSAGE_VER, self::MESSAGE_TYPE_QUERY, $data_len);
    
    // send data
    $buf = $header . $str;
    $ret = socket_write($this->socket, $buf);
    ```

* Answer Body

    ```
    int     qid;        // 1
    integer status;     // 0 for normal response, none-zero for exception
    dict    data;       // {}
    ```

    正常响应下，status 为 0，否则为非零数字，并且 data 需要包含以下字段：
    

    |Key|Value type|description|
    |---|---|---|
    |exception    | string           | exception name|
    |code         | int           | |
    |message      | string           | |
    |raiser       | string           | method*service @proto:host:port|
    |detail       | dict      | |


#### 日志 / 异常 / 调试

日志

```
2015-08-27 12:24:43,692 DEBUG ('127.0.0.1', 33441): message received: proxy.Query((2, 'android-gems', 'index_data', []))
2015-08-27 12:24:43,692 DEBUG handle_normal_servant: proxy.Query((2, 'android-gems', 'index_data', []))
2015-08-27 12:24:43,692 DEBUG ('127.0.0.1', 33441): reply answer: proxy.Answer((2, 0, {'libs': [], 'un_review_count': 1, 'users': []}))
2015-08-27 12:24:43,723 DEBUG ('127.0.0.1', 33441): connection has been closed by client.
2015-08-27 12:24:43,723 DEBUG ('127.0.0.1', 33441): close connection
2015-08-27 12:24:43,723 DEBUG ('127.0.0.1', 33441): answer fiber stop
```

包含异常信息的错误日志

```
2015-08-27 12:25:06,468 DEBUG ('127.0.0.1', 33452): message received: proxy.Query((3, 'android-gems', 'index_data1', []))
2015-08-27 12:25:06,468 DEBUG handle_normal_servant: proxy.Query((3, 'android-gems', 'index_data1', []))
2015-08-27 12:25:06,469 ERROR method index_data1 not found
2015-08-27 12:25:06,469 DEBUG ('127.0.0.1', 33452): reply answer: proxy.Answer((3, 100, {'exception': 'MethodNotFound', 'code': 1, 'raiser': u'android-gems@tcp:0.0.0.0:2099', 'message': u'servant android-gems do no have method index_data1 in adapter android-gems@tcp:0.0.0.0:2099'}))
2015-08-27 12:25:06,491 DEBUG ('127.0.0.1', 33452): connection has been closed by client.
2015-08-27 12:25:06,491 DEBUG ('127.0.0.1', 33452): close connection
2015-08-27 12:25:06,491 DEBUG ('127.0.0.1', 33452): answer fiber stop
```

#### 实现

目前已经有的实现：

* Python:  https://github.com/liaohuqiu/cube-rpc-python

* JAVA，即将开源

* C++，即将开源


#### 现实世界的例子

现实世界中，已经有一些应用了。

比如 [Android-Gems](http://www.android-gems.com/)。

另外，在阿里巴巴内部的一些应用，比如 “阿里巴巴技术协会” 网站，提供了排行，动态，标签等服务。
