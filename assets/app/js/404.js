webpackJsonp([3],[function(e,t,n){(function(e){!function(){function t(){function t(){o++;var i=o%6+1;console.log(i);var u=new Array(i+1).join(". ");return e("#_j_tip").html(u),r&&o>a?void n():void setTimeout(t,s)}function n(){var t=r.url;e("#_j_finding").hide(),r.succ?location.href=t:e("#_j_no_found").fadeIn()}var r,i=location.href,o=0,s=250,a=3e3/s;setTimeout(t,s);var u={url:i};i="http://cimage.sinaapp.com/ajax/find_page_for_gh_page.php",e.post(i,u,function(e){r=e.data},"json")}t()}()}).call(t,n(1))}]);
//# sourceMappingURL=404.js.map