var cube = require('cube-js')
var App = function() {
  this.init();
}
cube.mix(App.prototype, {
  init: function() {
    var toggle = $('.mobile-nav-toggle');
    var mobile_nav = $('.mobile-menu');

    var header = $('#header');
    toggle.on('click', function(e) {
      header.toggleClass('toggle-open');
      mobile_nav.slideToggle('fast');
    });
  }
});


module.exports = App;
