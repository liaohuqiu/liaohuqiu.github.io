---
layout: post_wide
title: "Shortcut for arrow keys, move like in vi/vim mode"
description: "Remap arrow keys to vi/vim mode. Shortcut for arrow keys, move them in vim mode."
keywords:   "windows, vim/vi mode, remap arrow key"
category: blog
---

I am used to vim and like to move with <kbd>H</kbd>, <kbd>J</kbd>, <kbd>K</kbd>, <kbd>L</kbd>. 

I would like to avoid switching to the arrow keys when I am in a text field for example.

In all application, I want:

*   <kbd>&larr;</kbd> can also be triggered by <kbd>Alt</kbd> + <kbd>H</kbd>

*   <kbd>&darr;</kbd> can also be triggered by <kbd>Alt</kbd> + <kbd>J</kbd>

*   <kbd>&uarr;</kbd> can also be triggered by <kbd>Alt</kbd> + <kbd>K</kbd>

*   <kbd>&rarr;</kbd> can also be triggered by <kbd>Alt</kbd> + <kbd>L</kbd>


In Mac, this will be easily done by [keyremap4macbook](https://pqrs.org/macosx/keyremap4macbook/), there is a `vi Mode`。

But in windows, this will be a little hard.

I use [Auto hot key](http://www.autohotkey.com/)

And the following scrpit:


```
!h::SendInput,{LEFT}
!j::SendInput,{DOWN}
!k::SendInput,{UP}
!l::SendInput,{RIGHT} 
```


