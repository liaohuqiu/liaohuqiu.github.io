---
layout: post_wide
title: Install php imagick extension on CentOS
description: setup a vpn server
category: blog
---

1. Download souce code

    ```bash
    wget http://pecl.php.net/get/imagick-3.1.2.tgz
    tar xzfv imagick-3.1.2.tgz 
    cd imagick-3.1.2
    ```

2. Install `ImageMagick-devel` first.

    ```bash
    yum install ImageMagick-devel
    ```

3. Build

    ```bash
    phpize
    ./configure --with-php-config=/usr/local/php/bin/php-config 
    make
    make install
    ```

4.  Copy `imagick.so` to extension directory. 

    If you do not know the path, find it out by (or change it in `php.ini`):

    ```
    php -i | grep "extension_dir"
    ```
    
    Then, edit `php.ini`, add `extension=imagick.so`.

    If you run php in a webserver, restart the it, for example:

    ```
    sudo service httpd restart
    ```

5.  Done.

---
The motto:
    
   * Quick money is not the solution.

   * You must plan ahead.

   * You should see the bigger picture.
