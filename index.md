---
layout: home
---


<ul class="artical-list">
{% for post in site.categories.blog %}
<li>
<h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
<div class="title-desc">{{ post.description }}</div>
</li>
{% endfor %}
</ul>
