'use strict';
/**
* here is business code for liaohquiu.net
*/
import Header                           from './header.js';

class App {

  run() {
    $(window).on('resize', () => {
      this.onResize();
    });

    $(window).on('scroll', () => {
      this.onScrollChange();
    });

    this.updateSize();

    this.init();

    this.onScrollChange();
  }

  init() {
    var header = new Header();
  }

  onScrollChange() {
    var scroll_top = $(window).scrollTop();
    var scroll_bottom = scroll_top + this.window_height;
  }

  onResize() {
    this.updateSize();
  }

  updateSize() {
    this.window_width = $(window).width();
    this.window_height = $(window).height();
  }
}

$(window).load(function(){
  var app = new App();
  app.run();
});
