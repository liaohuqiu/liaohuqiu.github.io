---
layout: post
title: 如何起花名
description: to pick an alibaba name
category: blog
js: /js/pick-alibaba-name.js?v=1

---
<h2> {{ page.title }} </h2>

在中国三大互联网巨头BAT中，阿里的文化极具魅力。阿里的三大文化是：`武侠`，`倒立`，`店小二`。作为武侠文化的一部分，每个阿里人都有自己的花名。花名是行走江湖的名号。

花名并不是随便起的，一般要求花名为2个汉字，要有武侠风情，示意积极向上。随着阿里集团的壮大，并且阿里会为离开的员工保留花名。
所以对新入职的同事来说，起一个好的花名越来越难。

当时我想了好些天也没有想到满意的名字。最后，写了一个程序，把3000多个常用汉字随机组合，从中挑让我感到眼前一亮的。

我个人觉得这个方法挺有效的，希望能对大家有帮助。

对了，我的花名是 `无朽`，祝愿你即将开始的阿里生活, 精彩、顺利。

我们阿里巴巴见。

<p class='line'></p>

<div class="row">
<div id='input-box' class="span3">
    <textarea id='input_words' rows="3" placeholder='一个字 / 一些字 / 什么也不用'></textarea>
</div>

<div id='input' class="form-inline span4">
    <label class="radio">
    <input type="radio" name="optionsRadios" id="optionsRadios1" checked=true value="1">在前</label>
    <label class="radio">
    <input type="radio" name="optionsRadios" id="optionsRadios2" value="2">在后</label>
    <button type="submit" class="btn" id='j_id_gen_list'>试试手气</button>
</div>
</div>

<p></p>
<div id='result'>
    <pre><code>路人甲
路人乙</code></pre>
</div>

<p> {{ page.date | date_to_string }} </p>
