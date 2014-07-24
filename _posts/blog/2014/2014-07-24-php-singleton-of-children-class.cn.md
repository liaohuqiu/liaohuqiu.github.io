---
layout: post_wide
title: 'PHP静态延迟绑定: 获取子类的单例'
description: "父类的静态方法getInstance() 获取各个子类的单例"
category: blog
---

在一定的需求场景下，你有一个父类和一些子类，你需要获取这些子类的实例又不想在每个子类中写重复的`getInstance()`方法。

在各种语言中，一般会用一个工具类去做这个实现。但在php5.3之后，会有另外一种方法。

php5.3之后加入的新的特性：静态延迟绑定。这个特性允许在运行时获取静态继承的上下文。

* `get_called_class()` 可以获取被调用的类。
* `static` 关键字用来访问静态继承的上下文。

在这个特性下，可以通过父类的静态方法获取子类的实例:

```php
<?php
abstract class Base
{
    private static $instance;
    public $name;

    public static function getInstance()
    {
        $class = get_called_class();
        if (!self::$instance[$class])
        {
            // new $class() will work too
            self::$instance[$class] = new static();
        }
        return self::$instance[$class];
    }

    public abstract function getName();
}

class A extends Base
{
    public function getName()
    {
        return 'A';
    }
}
class B extends Base
{
    public function getName()
    {
        return 'B';
    }
}
echo A::getInstance()->getName(), "\n";
echo B::getInstance()->getName(), "\n";
```

程序输出:

```bash
A
B
```
