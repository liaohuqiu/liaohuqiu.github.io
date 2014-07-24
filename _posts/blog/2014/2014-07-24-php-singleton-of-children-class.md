---
layout: post_wide
title: "PHP: singleton of children class"
description: "Get singleton of children class by a static method in parent class"
category: blog
---

As of `PHP 5.3`, there is a new feature: [Late static binding](http://php.net/manual/en/language.oop5.late-static-bindings.php) which enables you get the final called class in a static inheritance.

> This feature was named "late static bindings" with an internal perspective in mind. "Late binding" comes from the fact that static:: will not be resolved using the class where the method is defined but it will rather be computed using runtime information. It was also called a "static binding" as it can be used for (but is not limited to) static method calls.


In runtime:

* `get_called_class()` can retrieve a string with the name of the called class.
* `static` will introduce the scope.

With this feature, we can implement getting singleton of children class by a static method in parent class:

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

The output will be:

```bash
A
B
```
