---
layout: post_wide
title: "Centering List Items Horizontally"
description: 
category: blog
---

There are two simple ways to center list item horizontally.

1. display: inline-block & text-align: center

    ```
    .list-container {
        text-align: center;
        .list-item {
            display: inline-block;
        }
    }
    ```

    It's from [here][1].


2.  width: fit-content & margin: 0 auto;

    ```
    .list-centered {
        margin: 0 auto;
        width: fit-content;
        width: -moz-fit-content;
        width: -webkit-fit-content;

        .list-item {
            float: left;
        }
    }
    ```

    It's from [here][2].

    > Notice: The width of the clildren can not be percentage;


[1]:    https://css-tricks.com/centering-list-items-horizontally-slightly-trickier-than-you-might-think/

[2]:    https://martinwolf.org/2013/04/23/centered-fluid-width-navigation-with-floating-links-thanks-to-fit-content/

