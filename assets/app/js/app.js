webpackJsonp([1],[
/* 0 */
/*!************************!*\
  !*** ./src/js/blog.js ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';
	/**
	* here is business code for liaohquiu.net
	*/
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _header = __webpack_require__(/*! ./header.js */ 2);
	
	var _header2 = _interopRequireDefault(_header);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var App = function () {
	  function App() {
	    _classCallCheck(this, App);
	  }
	
	  _createClass(App, [{
	    key: 'run',
	    value: function run() {
	      var _this = this;
	
	      $(window).on('resize', function () {
	        _this.onResize();
	      });
	
	      $(window).on('scroll', function () {
	        _this.onScrollChange();
	      });
	
	      this.updateSize();
	
	      this.init();
	
	      this.onScrollChange();
	    }
	  }, {
	    key: 'init',
	    value: function init() {
	      var header = new _header2.default();
	    }
	  }, {
	    key: 'onScrollChange',
	    value: function onScrollChange() {
	      var scroll_top = $(window).scrollTop();
	      var scroll_bottom = scroll_top + this.window_height;
	    }
	  }, {
	    key: 'onResize',
	    value: function onResize() {
	      this.updateSize();
	    }
	  }, {
	    key: 'updateSize',
	    value: function updateSize() {
	      this.window_width = $(window).width();
	      this.window_height = $(window).height();
	    }
	  }]);
	
	  return App;
	}();
	
	$(window).load(function () {
	  var app = new App();
	  app.run();
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ 1)))

/***/ },
/* 1 */,
/* 2 */
/*!**************************!*\
  !*** ./src/js/header.js ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';
	
	var cube = __webpack_require__(/*! cube-js */ 3);
	var App = function App() {
	  this.init();
	};
	cube.mix(App.prototype, {
	  init: function init() {
	    var toggle = $('.mobile-nav-toggle');
	    var mobile_nav = $('.mobile-menu');
	
	    var header = $('#header');
	    toggle.on('click', function (e) {
	      header.toggleClass('toggle-open');
	      mobile_nav.slideToggle('fast');
	    });
	  }
	});
	
	module.exports = App;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ 1)))

/***/ }
]);
//# sourceMappingURL=app.js.map