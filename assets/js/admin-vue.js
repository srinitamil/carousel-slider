webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MaterialRipple; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var MaterialRipple = function () {
	/**
  * Class constructor for Ripple MDL component.
  * Implements MDL component design pattern defined at:
  * https://github.com/jasonmayes/mdl-component-design-pattern
  *
  * @constructor
  * @param {HTMLElement} element The element that will be upgraded.
  */
	function MaterialRipple(element) {
		_classCallCheck(this, MaterialRipple);

		this.element_ = element;

		/**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
		this.Constant_ = {
			INITIAL_SCALE: 'scale(0.0001, 0.0001)',
			INITIAL_SIZE: '1px',
			INITIAL_OPACITY: '0.4',
			FINAL_OPACITY: '0',
			FINAL_SCALE: ''
		};

		/**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
		this.CssClasses_ = {
			RIPPLE_CENTER: 'mdl-ripple--center',
			RIPPLE_EFFECT_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
			RIPPLE: 'mdl-ripple',
			IS_ANIMATING: 'is-animating',
			IS_VISIBLE: 'is-visible'
		};

		// Initialize instance.
		this.init();
	}

	/**
  * Handle mouse / finger down on element.
  *
  * @param {Event} event The event that fired.
  * @private
  */


	_createClass(MaterialRipple, [{
		key: 'downHandler_',
		value: function downHandler_(event) {
			if (!this.rippleElement_.style.width && !this.rippleElement_.style.height) {
				var rect = this.element_.getBoundingClientRect();
				this.boundHeight = rect.height;
				this.boundWidth = rect.width;
				this.rippleSize_ = Math.sqrt(rect.width * rect.width + rect.height * rect.height) * 2 + 2;
				this.rippleElement_.style.width = this.rippleSize_ + 'px';
				this.rippleElement_.style.height = this.rippleSize_ + 'px';
			}

			this.rippleElement_.classList.add(this.CssClasses_.IS_VISIBLE);

			if (event.type === 'mousedown' && this.ignoringMouseDown_) {
				this.ignoringMouseDown_ = false;
			} else {
				if (event.type === 'touchstart') {
					this.ignoringMouseDown_ = true;
				}
				var frameCount = this.getFrameCount();
				if (frameCount > 0) {
					return;
				}
				this.setFrameCount(1);
				var bound = event.currentTarget.getBoundingClientRect();
				var x = void 0;
				var y = void 0;
				// Check if we are handling a keyboard click.
				if (event.clientX === 0 && event.clientY === 0) {
					x = Math.round(bound.width / 2);
					y = Math.round(bound.height / 2);
				} else {
					var clientX = event.clientX !== undefined ? event.clientX : event.touches[0].clientX;
					var clientY = event.clientY !== undefined ? event.clientY : event.touches[0].clientY;
					x = Math.round(clientX - bound.left);
					y = Math.round(clientY - bound.top);
				}
				this.setRippleXY(x, y);
				this.setRippleStyles(true);
				window.requestAnimationFrame(this.animFrameHandler.bind(this));
			}
		}
	}, {
		key: 'upHandler_',


		/**
   * Handle mouse / finger up on element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
		value: function upHandler_(event) {
			// Don't fire for the artificial "mouseup" generated by a double-click.
			if (event && event.detail !== 2) {
				// Allow a repaint to occur before removing this class, so the animation
				// shows for tap events, which seem to trigger a mouseup too soon after
				// mousedown.
				window.setTimeout(function () {
					this.rippleElement_.classList.remove(this.CssClasses_.IS_VISIBLE);
				}.bind(this), 0);
			}
		}
	}, {
		key: 'init',


		/**
   * Initialize element.
   */
		value: function init() {
			if (this.element_) {
				var recentering = this.element_.classList.contains(this.CssClasses_.RIPPLE_CENTER);
				if (!this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT_IGNORE_EVENTS)) {
					this.rippleElement_ = this.element_.querySelector('.' + this.CssClasses_.RIPPLE);
					this.frameCount_ = 0;
					this.rippleSize_ = 0;
					this.x_ = 0;
					this.y_ = 0;

					// Touch start produces a compat mouse down event, which would cause a
					// second ripples. To avoid that, we use this property to ignore the first
					// mouse down after a touch start.
					this.ignoringMouseDown_ = false;

					this.boundDownHandler = this.downHandler_.bind(this);
					this.element_.addEventListener('mousedown', this.boundDownHandler);
					this.element_.addEventListener('touchstart', this.boundDownHandler);

					this.boundUpHandler = this.upHandler_.bind(this);
					this.element_.addEventListener('mouseup', this.boundUpHandler);
					this.element_.addEventListener('mouseleave', this.boundUpHandler);
					this.element_.addEventListener('touchend', this.boundUpHandler);
					this.element_.addEventListener('blur', this.boundUpHandler);

					/**
      * Getter for frameCount_.
      * @return {number} the frame count.
      */
					this.getFrameCount = function () {
						return this.frameCount_;
					};

					/**
      * Setter for frameCount_.
      * @param {number} fC the frame count.
      */
					this.setFrameCount = function (fC) {
						this.frameCount_ = fC;
					};

					/**
      * Getter for rippleElement_.
      * @return {Element} the ripple element.
      */
					this.getRippleElement = function () {
						return this.rippleElement_;
					};

					/**
      * Sets the ripple X and Y coordinates.
      * @param  {number} newX the new X coordinate
      * @param  {number} newY the new Y coordinate
      */
					this.setRippleXY = function (newX, newY) {
						this.x_ = newX;
						this.y_ = newY;
					};

					/**
      * Sets the ripple styles.
      * @param  {boolean} start whether or not this is the start frame.
      */
					this.setRippleStyles = function (start) {
						if (this.rippleElement_ !== null) {
							var transformString = void 0;
							var scale = void 0;
							var size = void 0;
							var offset = 'translate(' + this.x_ + 'px, ' + this.y_ + 'px)';

							if (start) {
								scale = this.Constant_.INITIAL_SCALE;
								size = this.Constant_.INITIAL_SIZE;
							} else {
								scale = this.Constant_.FINAL_SCALE;
								size = this.rippleSize_ + 'px';
								if (recentering) {
									offset = 'translate(' + this.boundWidth / 2 + 'px, ' + this.boundHeight / 2 + 'px)';
								}
							}

							transformString = 'translate(-50%, -50%) ' + offset + scale;

							this.rippleElement_.style.webkitTransform = transformString;
							this.rippleElement_.style.msTransform = transformString;
							this.rippleElement_.style.transform = transformString;

							if (start) {
								this.rippleElement_.classList.remove(this.CssClasses_.IS_ANIMATING);
							} else {
								this.rippleElement_.classList.add(this.CssClasses_.IS_ANIMATING);
							}
						}
					};

					/**
      * Handles an animation frame.
      */
					this.animFrameHandler = function () {
						if (this.frameCount_-- > 0) {
							window.requestAnimationFrame(this.animFrameHandler.bind(this));
						} else {
							this.setRippleStyles(false);
						}
					};
				}
			}
		}
	}]);

	return MaterialRipple;
}();



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return carousel; });
var carousel = {
	props: {
		options: { type: Object, required: true }
	},
	computed: {
		outer_classes: function outer_classes() {
			var classes = ['carousel-slider-outer'];
			classes.push('carousel-slider-' + this.options.id);
			classes.push('carousel-slider-' + this.options.type);

			return classes;
		},
		slider_id: function slider_id() {
			return 'id-' + this.options.id;
		},
		slider_classes: function slider_classes() {
			var classes = ['owl-carousel', 'carousel-slider'];
			// Arrow position
			classes.push('arrows-' + this.options.arrow_position);
			// Dot position
			classes.push('dots-' + this.options.dots_position);
			// Dots shape
			classes.push('dots-' + this.options.dots_shape);
			// arrow_visibility
			if ('always' === this.options.arrow_visibility) {
				classes.push('arrows-visible-always');
			} else if ('never' === this.options.arrow_visibility) {
				classes.push('arrows-hidden');
			} else {
				classes.push('arrows-visible-hover');
			}
			// dots_visibility
			if ('always' === this.options.dots_visibility) {
				classes.push('dots-visible-always');
			} else if ('never' === this.options.dots_visibility) {
				classes.push('dots-hidden');
			} else {
				classes.push('dots-visible-hover');
			}

			return classes;
		},
		owl_options: function owl_options() {
			return {
				stagePadding: this.options.stage_padding,
				nav: this.options.arrow_nav,
				dots: this.options.dot_nav,
				margin: this.options.item_spacing,
				loop: this.options.infinity_loop,
				autoplay: this.options.autoplay,
				autoplayTimeout: this.options.autoplay_timeout,
				autoplaySpeed: this.options.autoplay_speed,
				autoplayHoverPause: this.options.autoplay_pause,
				slideBy: this.options.arrow_steps,
				lazyLoad: this.options.lazy_load_image,
				autoWidth: this.options.auto_width,
				responsive: {
					0: { items: this.options.items_mobile },
					480: { items: this.options.items_mobile_landscape },
					768: { items: this.options.items_tablet },
					980: { items: this.options.items_desktop_small },
					1200: { items: this.options.items_desktop },
					1500: { items: this.options.items_desktop_large }
				},
				navText: ['<svg class="carousel-slider-nav-icon" viewBox="0 0 20 20"><path d="M14 5l-5 5 5 5-1 2-7-7 7-7z"></path></svg>', '<svg class="carousel-slider-nav-icon" viewBox="0 0 20 20"><path d="M6 15l5-5-5-5 1-2 7 7-7 7z"></path></svg>']
			};
		}
	},
	methods: {
		initCarousel: function initCarousel() {
			var slider = window.jQuery(this.$el).find("[data-carousel_slider]");
			slider.owlCarousel(this.owl_options);
		},
		rebuildCarousel: function rebuildCarousel() {
			var slider = window.jQuery(this.$el).find("[data-carousel_slider]");
			slider.owlCarousel('destroy');
			setTimeout(function (options) {
				slider.owlCarousel(options);
			}, 1000, this.owl_options);
		}
	}
};



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_ColorPicker_vue__ = __webpack_require__(31);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_cbcbfcea_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_ColorPicker_vue__ = __webpack_require__(102);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(101)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-cbcbfcea"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_ColorPicker_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_cbcbfcea_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_ColorPicker_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/admin/components/fields/ColorPicker.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-cbcbfcea", Component.options)
  } else {
    hotAPI.reload("data-v-cbcbfcea", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MaterialButton; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var MaterialButton = function () {

	/**
  * Class constructor for Button MDL component.
  * Implements MDL component design pattern defined at:
  * https://github.com/jasonmayes/mdl-component-design-pattern
  *
  * @param {HTMLElement} element The element that will be upgraded.
  */
	function MaterialButton(element) {
		_classCallCheck(this, MaterialButton);

		this.element_ = element;

		/**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
		this.Constant_ = {
			// None for now.
		};

		/**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
		this.CssClasses_ = {
			RIPPLE_EFFECT: 'mdl-js-ripple-effect',
			RIPPLE_CONTAINER: 'mdl-button__ripple-container',
			RIPPLE: 'mdl-ripple'
		};

		// Initialize instance.
		this.init();
	}

	/**
  * Handle blur of element.
  *
  * @param {Event} event The event that fired.
  * @private
  */


	_createClass(MaterialButton, [{
		key: 'blurHandler_',
		value: function blurHandler_(event) {
			if (event) {
				this.element_.blur();
			}
		}
	}, {
		key: 'disable',


		// Public methods.

		/**
   * Disable button.
   *
   * @public
   */
		value: function disable() {
			this.element_.disabled = true;
		}
	}, {
		key: 'enable',


		/**
   * Enable button.
   *
   * @public
   */
		value: function enable() {
			this.element_.disabled = false;
		}
	}, {
		key: 'init',


		/**
   * Initialize element.
   */
		value: function init() {
			if (this.element_) {
				if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
					var rippleContainer = document.createElement('span');
					rippleContainer.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
					this.rippleElement_ = document.createElement('span');
					this.rippleElement_.classList.add(this.CssClasses_.RIPPLE);
					rippleContainer.appendChild(this.rippleElement_);
					this.boundRippleBlurHandler = this.blurHandler_.bind(this);
					this.rippleElement_.addEventListener('mouseup', this.boundRippleBlurHandler);
					this.element_.appendChild(rippleContainer);
				}
				this.boundButtonBlurHandler = this.blurHandler_.bind(this);
				this.element_.addEventListener('mouseup', this.boundButtonBlurHandler);
				this.element_.addEventListener('mouseleave', this.boundButtonBlurHandler);
			}
		}
	}]);

	return MaterialButton;
}();



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlButton_vue__ = __webpack_require__(18);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8ac316ce_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlButton_vue__ = __webpack_require__(67);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(66)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlButton_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8ac316ce_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlButton_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/material-design-lite/button/mdlButton.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-8ac316ce", Component.options)
  } else {
    hotAPI.reload("data-v-8ac316ce", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__material_design_lite_snackbar_mdlSnackbar_vue__ = __webpack_require__(48);
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
	name: 'App',
	components: { mdlSnackbar: __WEBPACK_IMPORTED_MODULE_0__material_design_lite_snackbar_mdlSnackbar_vue__["a" /* default */] }
});

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MaterialSnackbar_js__ = __webpack_require__(50);
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
	name: "mdlSnackbar",
	model: {
		prop: 'options',
		event: 'queued'
	},
	props: {
		alignStart: { type: Boolean, default: false },
		options: { type: Object },
		event: { type: String, default: 'show-snackbar' },
		eventSource: {
			type: Object,
			required: false,
			default: function _default() {
				return this.$root;
			}
		}
	},
	data: function data() {
		return {
			mdlSnackbar: undefined
		};
	},

	computed: {
		getClasses: function getClasses() {
			return {
				'mdl-snackbar--align-start': this.alignStart
			};
		}
	},
	watch: {
		options: function options(newOptions) {
			if (newOptions && newOptions.message) {
				this.show(newOptions);
			}
		}
	},
	mounted: function mounted() {
		this.mdlSnackbar = new __WEBPACK_IMPORTED_MODULE_0__MaterialSnackbar_js__["a" /* MaterialSnackbar */](this.$el);

		// Show initial message
		if (this.options && this.options.message) {
			this.show(this.options);
		}

		// if event specified use it, else if no snack prop then use default.
		this.eventSource.$on(this.event, this.show);
	},

	methods: {
		show: function show(options) {
			this.mdlSnackbar.show(options);
		}
	}
});

/***/ }),
/* 11 */,
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_ListTable_vue__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_CopyToClipboard_vue__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__material_design_lite_button_mdlFab_vue__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__material_design_lite_modal_mdlModal_vue__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__material_design_lite_radio_mdlRadio_vue__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__material_design_lite_spinner_mdlSpinner_vue__ = __webpack_require__(20);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//








/* harmony default export */ __webpack_exports__["a"] = ({
	name: "Home",
	components: { ListTable: __WEBPACK_IMPORTED_MODULE_0__components_ListTable_vue__["a" /* default */], mdlFab: __WEBPACK_IMPORTED_MODULE_2__material_design_lite_button_mdlFab_vue__["a" /* default */], mdlModal: __WEBPACK_IMPORTED_MODULE_3__material_design_lite_modal_mdlModal_vue__["a" /* default */], mdlRadio: __WEBPACK_IMPORTED_MODULE_4__material_design_lite_radio_mdlRadio_vue__["a" /* default */], CopyToClipboard: __WEBPACK_IMPORTED_MODULE_1__components_CopyToClipboard_vue__["a" /* default */], mdlSpinner: __WEBPACK_IMPORTED_MODULE_5__material_design_lite_spinner_mdlSpinner_vue__["a" /* default */] },
	data: function data() {
		return {
			loading: true,
			modalActive: false,
			sliderTypes: {},
			sliderType: 'image-carousel',
			postStatus: 'publish',
			rows: [],
			columns: [],
			actions: [],
			bulkActions: [],
			counts: {}
		};
	},
	mounted: function mounted() {
		var settings = window.carouselSliderSettings;
		this.sliderTypes = settings.sliderTypes;
		this.columns = settings.columns;
		this.actions = settings.actions.publish;
		this.bulkActions = settings.bulkActions.publish;
		this.counts = settings.countSliders;
		this.getItems();
	},

	methods: {
		shortcode: function shortcode(item) {
			return '[carousel_slide id=\'' + item.id + '\']';
		},
		openModal: function openModal() {
			this.modalActive = true;
		},
		closeModal: function closeModal() {
			this.modalActive = false;
		},
		changeStatus: function changeStatus(status) {
			var settings = window.carouselSliderSettings;
			this.postStatus = status;
			if ('trash' === this.postStatus) {
				this.actions = settings.actions.trash;
				this.bulkActions = settings.bulkActions.trash;
			} else {
				this.actions = settings.actions.publish;
				this.bulkActions = settings.bulkActions.publish;
			}
			this.getItems();
		},
		getItems: function getItems() {
			var $ = window.jQuery,
			    self = this;
			self.loading = true;
			$.ajax({
				url: carouselSliderSettings.root + '/sliders',
				method: 'GET',
				data: {
					per_page: 20,
					post_status: self.postStatus
				},
				success: function success(response) {
					if (response.data) {
						self.rows = response.data;
					}
					self.loading = false;
				},
				error: function error() {
					self.rows = [];
					self.loading = false;
				}
			});
		},
		trashItem: function trashItem(item) {
			var $ = window.jQuery,
			    self = this;
			self.loading = true;
			$.ajax({
				url: carouselSliderSettings.root + '/sliders/' + item.id,
				method: 'DELETE',
				data: {
					force: false
				},
				success: function success() {
					self.$delete(self.rows, self.rows.indexOf(item));
					self.counts.publish -= 1;
					self.counts.trash += 1;
					self.loading = false;
				},
				error: function error() {
					self.loading = false;
				}
			});
		},
		restoreItem: function restoreItem(item) {
			var $ = window.jQuery,
			    self = this;
			self.loading = true;
			$.ajax({
				url: ajaxurl,
				method: 'POST',
				data: {
					action: 'carousel_slider_restore_slider',
					id: item.id
				},
				success: function success() {
					self.$delete(self.rows, self.rows.indexOf(item));
					self.counts.publish += 1;
					self.counts.trash -= 1;
					self.loading = false;
				},
				error: function error() {
					self.loading = false;
				}
			});
		},
		deleteItem: function deleteItem(item) {
			var $ = window.jQuery,
			    self = this;
			self.loading = true;
			$.ajax({
				url: carouselSliderSettings.root + '/sliders/' + item.id,
				method: 'DELETE',
				data: {
					force: true
				},
				success: function success() {
					self.$delete(self.rows, self.rows.indexOf(item));
					self.counts.trash -= 1;
					self.loading = false;
				},
				error: function error() {
					self.loading = false;
				}
			});
		},
		onActionClick: function onActionClick(action, row) {
			if ('edit' === action) {
				window.location.href = "#/" + row.id;
			} else if ('trash' === action) {
				if (confirm('Are you sure to move this item to trash?')) {
					this.trashItem(row);
				}
			} else if ('restore' === action) {
				if (confirm('Are you sure to restore this item?')) {
					this.restoreItem(row);
				}
			} else if ('delete' === action) {
				if (confirm('Are you sure to delete this item permanently?')) {
					this.deleteItem(row);
				}
			}
		},
		onBulkAction: function onBulkAction(action, items) {
			if ('trash' === action) {
				if (confirm('Are you sure to trash all selected items?')) {
					this.trashItems(items);
				}
			} else if ('delete' === action) {
				if (confirm('Are you sure to delete all selected items permanently?')) {
					this.deleteItems(items);
				}
			} else if ('restore' === action) {
				if (confirm('Are you sure to restore all selected items?')) {
					this.restoreItems(items);
				}
			}
		},
		trashItems: function trashItems(items) {
			var $ = window.jQuery,
			    self = this;
			self.loading = true;
			$.ajax({
				url: ajaxurl,
				method: 'POST',
				data: {
					action: 'carousel_slider_delete_sliders',
					ids: items,
					force: false
				},
				success: function success(response) {
					if (response.status.success) {
						self.counts.publish -= response.status.success;
						self.counts.trash += response.status.success;
					}
					self.getItems();
				},
				error: function error() {
					self.loading = false;
				}
			});
		},
		deleteItems: function deleteItems(items) {
			var $ = window.jQuery,
			    self = this;
			self.loading = true;
			$.ajax({
				url: ajaxurl,
				method: 'POST',
				data: {
					action: 'carousel_slider_delete_sliders',
					ids: items,
					force: true
				},
				success: function success(response) {
					if (response.status.success) {
						self.counts.trash -= response.status.success;
					}
					self.getItems();
				},
				error: function error() {
					self.loading = false;
				}
			});
		},
		restoreItems: function restoreItems(items) {
			var $ = window.jQuery,
			    self = this;
			self.loading = true;
			$.ajax({
				url: ajaxurl,
				method: 'POST',
				data: {
					action: 'carousel_slider_restore_sliders',
					ids: items
				},
				success: function success(response) {
					if (response.status.success) {
						self.counts.publish += response.status.success;
						self.counts.trash -= response.status.success;
					}
					self.getItems();
				},
				error: function error() {
					self.loading = false;
				}
			});
		}
	}
});

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({

	name: 'ListTable',

	props: {
		columns: {
			type: Array,
			required: true,
			default: function _default() {
				return [];
			}
		},
		rows: {
			type: Array, // String, Number, Boolean, Function, Object, Array
			required: true,
			default: function _default() {
				return [];
			}
		},
		index: {
			type: String,
			default: 'id'
		},
		showCb: {
			type: Boolean,
			default: true
		},
		loading: {
			type: Boolean,
			default: false
		},
		actionColumn: {
			type: String,
			default: ''
		},
		actions: {
			type: Array,
			required: false,
			default: []
		},
		bulkActions: {
			type: Array,
			required: false,
			default: []
		},
		tableClass: {
			type: String,
			default: 'wp-list-table widefat fixed striped'
		},
		notFound: {
			type: String,
			default: 'No items found.'
		},
		totalItems: {
			type: Number,
			default: 0
		},
		totalPages: {
			type: Number,
			default: 1
		},
		perPage: {
			type: Number,
			default: 20
		},
		currentPage: {
			type: Number,
			default: 1
		},
		sortBy: {
			type: String,
			default: null
		},
		sortOrder: {
			type: String,
			default: "asc"
		}
	},

	data: function data() {
		return {
			bulkLocal: '-1',
			checkedItems: []
		};
	},


	computed: {
		hasActions: function hasActions() {
			return this.actions.length > 0;
		},
		hasBulkActions: function hasBulkActions() {
			return this.bulkActions.length > 0;
		},
		itemsTotal: function itemsTotal() {
			return this.totalItems || this.rows.length;
		},
		hasPagination: function hasPagination() {
			return this.itemsTotal > this.perPage;
		},
		disableFirst: function disableFirst() {
			return this.currentPage === 1 || this.currentPage === 2;
		},
		disablePrev: function disablePrev() {
			return this.currentPage === 1;
		},
		disableNext: function disableNext() {
			return this.currentPage === this.totalPages;
		},
		disableLast: function disableLast() {
			return this.currentPage === this.totalPages || this.currentPage === this.totalPages - 1;
		},
		colspan: function colspan() {
			var columns = Object.keys(this.columns).length;

			if (this.showCb) {
				columns += 1;
			}

			return columns;
		},


		selectAll: {

			get: function get() {
				if (!this.rows.length) {
					return false;
				}

				return this.rows ? this.checkedItems.length === this.rows.length : false;
			},

			set: function set(value) {
				var selected = [],
				    self = this;

				if (value) {
					this.rows.forEach(function (item) {
						if (item[self.index] !== undefined) {
							selected.push(item[self.index]);
						} else {
							selected.push(item.id);
						}
					});
				}

				this.checkedItems = selected;
			}
		}
	},

	methods: {
		getHeadColumnClass: function getHeadColumnClass(key, value) {
			return ['manage-column', 'manage-' + key, { 'column-primary': this.actionColumn === key }, { 'sortable': this.isSortable(value) }, { 'sorted': this.isSorted(key) }, { 'asc': this.isSorted(key) && this.sortOrder === 'asc' }, { 'desc': this.isSorted(key) && this.sortOrder === 'desc' }];
		},
		getBodyColumnClass: function getBodyColumnClass(key) {
			return ['manage-column', 'manage-' + key, { 'column-primary': this.actionColumn === key }];
		},
		hideActionSeparator: function hideActionSeparator(action) {
			return action === this.actions[this.actions.length - 1].key;
		},
		actionClicked: function actionClicked(action, row) {
			this.$emit('action:click', action, row);
		},
		goToPage: function goToPage(page) {
			this.$emit('pagination', page);
		},
		goToCustomPage: function goToCustomPage(event) {
			var page = parseInt(event.target.value);

			if (!isNaN(page) && page > 0 && page <= this.totalPages) {
				this.$emit('pagination', page);
			}
		},
		handleBulkAction: function handleBulkAction() {
			if (this.bulkLocal === '-1') {
				return;
			}

			this.$emit('bulk:click', this.bulkLocal, this.checkedItems);
		},
		isSortable: function isSortable(column) {
			return column.hasOwnProperty('sortable') && column.sortable === true;
		},
		isSorted: function isSorted(column) {
			return column === this.sortBy;
		},
		handleSortBy: function handleSortBy(column) {
			var order = this.sortOrder === 'asc' ? 'desc' : 'asc';

			this.$emit('sort', column, order);
		}
	}
});

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
	name: "CopyToClipboard",
	props: {
		value: { type: String, default: '' }
	},
	data: function data() {
		return {
			beforeCopy: 'Copy to clipboard',
			afterCopy: 'Copied'
		};
	},

	methods: {
		clickInput: function clickInput() {
			var input = this.$el.querySelector('.mdl-copy-to-clipboard__input');
			var value = this.value;

			input.select();
			document.execCommand("copy");
			alert("Copied: " + value);
		},
		clickIcon: function clickIcon() {
			var tooltip = this.$el.querySelector('.mdl-copy-to-clipboard__tooltip');
			var input = this.$el.querySelector('.mdl-copy-to-clipboard__input');

			input.select();
			document.execCommand("copy");
			tooltip.innerHTML = this.afterCopy;
			setTimeout(function (el) {
				tooltip.innerHTML = el.beforeCopy;
			}, 3000, this);
		}
	}
});

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlFab_vue__ = __webpack_require__(16);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_73c508b0_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlFab_vue__ = __webpack_require__(63);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(62)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlFab_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_73c508b0_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlFab_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/material-design-lite/button/mdlFab.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-73c508b0", Component.options)
  } else {
    hotAPI.reload("data-v-73c508b0", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MaterialButton_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ripple_MaterialRipple_js__ = __webpack_require__(1);
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
	name: "mdlFab",
	props: {
		ripple: { type: Boolean, default: true },
		colored: { type: Boolean, default: true },
		disabled: { type: Boolean, default: false },
		mini: { type: Boolean, default: false }
	},
	data: function data() {
		return {};
	},

	computed: {
		getClasses: function getClasses() {
			return {
				'mdl-button--colored': this.colored,
				'mdl-js-ripple-effect': this.ripple,
				'mdl-button--mini-fab': this.mini
			};
		}
	},
	mounted: function mounted() {
		new __WEBPACK_IMPORTED_MODULE_0__MaterialButton_js__["a" /* MaterialButton */](this.$el);
		if (this.ripple) {
			new __WEBPACK_IMPORTED_MODULE_1__ripple_MaterialRipple_js__["a" /* MaterialRipple */](this.$el);
		}
	}
});

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__button_mdlButton_vue__ = __webpack_require__(8);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
	name: "mdlModal",

	components: { mdlButton: __WEBPACK_IMPORTED_MODULE_0__button_mdlButton_vue__["a" /* default */] },

	props: {
		active: { type: Boolean, required: true, default: false },
		title: { type: String, required: false, default: 'Untitled' },
		type: { type: String, required: false, default: 'card' }
	},

	data: function data() {
		return {};
	},


	computed: {
		is_card: function is_card() {
			return this.type === 'card';
		}
	},

	methods: {
		close: function close() {
			this.$emit('close');
		}
	}
});

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MaterialButton_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ripple_MaterialRipple_js__ = __webpack_require__(1);
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
	name: "mdlButton",
	props: {
		ripple: { type: Boolean, default: true },
		disabled: { type: Boolean, default: false },
		type: {
			type: String, default: 'flat', validator: function validator(value) {
				return ['raised', 'flat', 'icon'].indexOf(value) !== -1;
			}
		},
		color: {
			type: String, default: 'default', validator: function validator(value) {
				return ['default', 'primary', 'accent'].indexOf(value) !== -1;
			}
		}
	},
	computed: {
		getClass: function getClass() {
			return {
				'mdl-js-ripple-effect': this.ripple,
				'mdl-button--icon': this.type === 'icon',
				'mdl-button--raised': this.type === 'raised',
				'mdl-button--colored': this.color === 'primary' && this.type !== 'flat',
				'mdl-button--primary': this.color === 'primary' && this.type === 'flat',
				'mdl-button--accent': this.color === 'accent'
			};
		}
	},
	mounted: function mounted() {
		new __WEBPACK_IMPORTED_MODULE_0__MaterialButton_js__["a" /* MaterialButton */](this.$el);
		if (this.ripple) {
			new __WEBPACK_IMPORTED_MODULE_1__ripple_MaterialRipple_js__["a" /* MaterialRipple */](this.$el);
		}
	}
});

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MaterialRadio_js__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ripple_MaterialRipple_js__ = __webpack_require__(1);
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
	name: "mdlRadio",
	model: { prop: 'modelValue', event: 'change' },
	props: {
		label: { type: String, default: '', required: false },
		value: { type: String },
		modelValue: { default: '' }
	},
	mounted: function mounted() {
		new __WEBPACK_IMPORTED_MODULE_0__MaterialRadio_js__["a" /* MaterialRadio */](this.$el);
		new __WEBPACK_IMPORTED_MODULE_1__ripple_MaterialRipple_js__["a" /* MaterialRipple */](this.$el.querySelector('.mdl-js-ripple-effect'));
	},

	computed: {
		shouldBeChecked: function shouldBeChecked() {
			return this.modelValue === this.value;
		},
		getClasses: function getClasses() {
			return {
				'is-checked': this.shouldBeChecked
			};
		}
	},
	methods: {
		updateInput: function updateInput() {
			this.$emit('change', this.value);
		}
	}
});

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlSpinner_vue__ = __webpack_require__(21);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3d6f96ee_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlSpinner_vue__ = __webpack_require__(75);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(73)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlSpinner_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3d6f96ee_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlSpinner_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/material-design-lite/spinner/mdlSpinner.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3d6f96ee", Component.options)
  } else {
    hotAPI.reload("data-v-3d6f96ee", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MaterialSpinner_js__ = __webpack_require__(74);
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
	name: "mdlSpinner",
	props: {
		active: { type: Boolean, default: true },
		single: { type: Boolean, default: false }
	},
	data: function data() {
		return {};
	},
	mounted: function mounted() {
		new __WEBPACK_IMPORTED_MODULE_0__MaterialSpinner_js__["a" /* MaterialSpinner */](this.$el);
	},

	computed: {
		getClass: function getClass() {
			return {
				'is-active': this.active,
				'mdl-spinner--single-color': this.single
			};
		}
	}
});

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
	name: "Documentation"
});

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuedraggable__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuedraggable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vuedraggable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_Accordion_vue__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_sliders_ImageCarousel_vue__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_sliders_ImageCarouselUrl_vue__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_sliders_VideoCarousel_vue__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_sliders_HeroCarousel_vue__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_sliders_PostCarousel_vue__ = __webpack_require__(171);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_AccordionRepeater_vue__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_fields_ColorPicker_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_fields_MediaUploader_vue__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_fields_Background_vue__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_fields_RichText_vue__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_fields_ButtonGenerator_vue__ = __webpack_require__(115);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__material_design_lite_slider_mdlSlider_vue__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__material_design_lite_switch_mdlSwitch_vue__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__material_design_lite_radio_button_mdlRadioButton_vue__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__material_design_lite_button_mdlFab_vue__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__material_design_lite_tooltip_mdlTooltip_vue__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__material_design_lite_button_mdlButton_vue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__material_design_lite_textfield_mdlTextfield_vue__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__material_design_lite_spinner_mdlSpinner_vue__ = __webpack_require__(20);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//























/* harmony default export */ __webpack_exports__["a"] = ({
	name: "Slider",
	components: {
		draggable: __WEBPACK_IMPORTED_MODULE_0_vuedraggable___default.a,
		Accordion: __WEBPACK_IMPORTED_MODULE_1__components_Accordion_vue__["a" /* default */],
		AccordionRepeater: __WEBPACK_IMPORTED_MODULE_7__components_AccordionRepeater_vue__["a" /* default */],
		mdlSlider: __WEBPACK_IMPORTED_MODULE_13__material_design_lite_slider_mdlSlider_vue__["a" /* default */],
		mdlSwitch: __WEBPACK_IMPORTED_MODULE_14__material_design_lite_switch_mdlSwitch_vue__["a" /* default */],
		mdlRadioButton: __WEBPACK_IMPORTED_MODULE_15__material_design_lite_radio_button_mdlRadioButton_vue__["a" /* default */],
		ColorPicker: __WEBPACK_IMPORTED_MODULE_8__components_fields_ColorPicker_vue__["a" /* default */],
		mdlFab: __WEBPACK_IMPORTED_MODULE_16__material_design_lite_button_mdlFab_vue__["a" /* default */],
		mdlTooltip: __WEBPACK_IMPORTED_MODULE_17__material_design_lite_tooltip_mdlTooltip_vue__["a" /* default */],
		mdlButton: __WEBPACK_IMPORTED_MODULE_18__material_design_lite_button_mdlButton_vue__["a" /* default */],
		mdlTextfield: __WEBPACK_IMPORTED_MODULE_19__material_design_lite_textfield_mdlTextfield_vue__["a" /* default */],
		mdlSpinner: __WEBPACK_IMPORTED_MODULE_20__material_design_lite_spinner_mdlSpinner_vue__["a" /* default */],
		MediaUploader: __WEBPACK_IMPORTED_MODULE_9__components_fields_MediaUploader_vue__["a" /* default */],
		ImageCarousel: __WEBPACK_IMPORTED_MODULE_2__components_sliders_ImageCarousel_vue__["a" /* default */],
		ImageCarouselUrl: __WEBPACK_IMPORTED_MODULE_3__components_sliders_ImageCarouselUrl_vue__["a" /* default */],
		VideoCarousel: __WEBPACK_IMPORTED_MODULE_4__components_sliders_VideoCarousel_vue__["a" /* default */],
		HeroCarousel: __WEBPACK_IMPORTED_MODULE_5__components_sliders_HeroCarousel_vue__["a" /* default */],
		PostCarousel: __WEBPACK_IMPORTED_MODULE_6__components_sliders_PostCarousel_vue__["a" /* default */],
		Background: __WEBPACK_IMPORTED_MODULE_10__components_fields_Background_vue__["a" /* default */],
		RichText: __WEBPACK_IMPORTED_MODULE_11__components_fields_RichText_vue__["a" /* default */],
		ButtonGenerator: __WEBPACK_IMPORTED_MODULE_12__components_fields_ButtonGenerator_vue__["a" /* default */]
	},
	data: function data() {
		return {
			id: 0,
			loading: true,
			slider: {},
			sections: [],
			fields: [],
			modules: []
		};
	},
	mounted: function mounted() {
		var settings = window.CAROUSEL_SLIDER_SETTINGS;
		this.sections = settings.general_settings.sections;
		this.fields = settings.general_settings.fields;
		this.modules = settings.modules_settings;
		this.id = parseInt(this.$route.params.id);
		this.getItem();
	},

	computed: {
		_sections: function _sections() {
			if (typeof this.slider.type !== "undefined") {
				var sections = this.modules[this.slider.type]['sections'];

				return sections.concat(this.sections);
			}
			return this.sections;
		},
		_fields: function _fields() {
			if (typeof this.slider.type !== "undefined") {
				var fields = this.modules[this.slider.type]['fields'];

				return fields.concat(this.fields);
			}
			return this.fields;
		}
	},
	methods: {
		isTextfield: function isTextfield(type) {
			var valid = ['text', 'number', 'url', 'date'];

			return valid.indexOf(type) !== -1;
		},
		getItem: function getItem() {
			var $ = window.jQuery,
			    self = this;
			self.loading = true;
			$.ajax({
				method: 'GET',
				url: carouselSliderSettings.root + '/sliders/' + self.id,
				success: function success(response) {
					if (response.data) {
						self.slider = response.data;
					}
					self.loading = false;
				},
				error: function error() {
					self.loading = false;
				}
			});
		},
		getMin: function getMin(slider) {
			if (typeof slider.input_attrs.min !== "undefined") {
				return slider.input_attrs.min;
			}

			return 0;
		},
		getMax: function getMax(slider) {
			if (typeof slider.input_attrs.max !== "undefined") {
				return slider.input_attrs.max;
			}

			return 100;
		},
		getStep: function getStep(slider) {
			if (typeof slider.input_attrs.step !== "undefined") {
				return slider.input_attrs.step;
			}

			return 1;
		},
		saveSlider: function saveSlider() {
			var $ = jQuery,
			    self = this;
			self.loading = true;
			$.ajax({
				url: window.carouselSliderSettings.root + '/sliders/' + self.slider.id,
				method: 'PUT',
				data: self.slider,
				success: function success(response) {
					if (response.data) {
						self.slider = response.data;
					}
					self.loading = false;
					self.$root.$emit('show-snackbar', {
						message: 'Data hes been saved!'
					});
				},
				error: function error() {
					self.loading = false;
				}
			});
		},
		getItemTitle: function getItemTitle(index) {
			return 'Item ' + (index + 1);
		},
		addRepeaterItem: function addRepeaterItem(field, options) {
			var _ids = {},
			    fields = field.fields ? field.fields : [];
			fields.map(function (el) {
				_ids[el.id] = '';
			});
			options.push(_ids);
		},
		copyItem: function copyItem(item, items) {
			var index = items.indexOf(item) + 1;
			items.splice(index, 0, item);
		},
		clearItem: function clearItem(item, items) {
			this.$delete(items, items.indexOf(item));
		}
	}
});

/***/ }),
/* 24 */,
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
	name: "Accordion",
	props: {
		active: { type: Boolean, default: false },
		title: { type: String, required: true }
	},
	data: function data() {
		return {
			isActive: false
		};
	},
	mounted: function mounted() {
		if (this.active) {
			this.isActive = true;
		}
	},

	computed: {}
});

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__carousel_js__ = __webpack_require__(2);
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
	name: "ImageCarousel",
	mixins: [__WEBPACK_IMPORTED_MODULE_0__carousel_js__["a" /* carousel */]],
	props: {
		options: { type: Object, required: true }
	},
	watch: {
		options: function options(newValue, oldValue) {
			this.rebuildCarousel();
		}
	},
	mounted: function mounted() {
		this.initCarousel();
	}
});

/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__carousel_js__ = __webpack_require__(2);
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
	name: "ImageCarouselUrl",
	mixins: [__WEBPACK_IMPORTED_MODULE_0__carousel_js__["a" /* carousel */]],
	props: {
		options: { type: Object, required: true }
	},
	watch: {
		options: function options(newValue, oldValue) {
			this.rebuildCarousel();
		}
	},
	mounted: function mounted() {
		this.initCarousel();
	}
});

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__carousel_js__ = __webpack_require__(2);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
	name: "VideoCarousel",
	mixins: [__WEBPACK_IMPORTED_MODULE_0__carousel_js__["a" /* carousel */]],
	props: {
		options: { type: Object, required: true }
	},
	watch: {
		options: function options(newValue, oldValue) {
			this.rebuildCarousel();
		}
	},
	mounted: function mounted() {
		this.initCarousel();
	}
});

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__carousel__ = __webpack_require__(2);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
	name: "HeroCarousel",
	mixins: [__WEBPACK_IMPORTED_MODULE_0__carousel__["a" /* carousel */]],
	props: {
		options: { type: Object, required: true }
	},
	mounted: function mounted() {
		var $ = window.jQuery,
		    slider = $(this.$el).find("[data-carousel_slider]");
		slider.owlCarousel(this.owl_options);
	},

	methods: {
		cell_background_styles: function cell_background_styles(data) {
			return {
				'background-color': data.background.color,
				'background-image': 'url(' + data.background.image.src + ')',
				'background-size': data.background.size,
				'background-position': data.background.position
			};
		},
		cell_background_overlay: function cell_background_overlay(data) {
			return { 'background-color': data.background.overlay_color };
		},
		cell_background_classes: function cell_background_classes(data) {
			var classes = ['carousel-slider-hero__cell__background', 'cell_background'];
			if (data.background.effect === 'zoom-in') {
				classes.push('carousel-slider-hero-ken-in');
			}
			if (data.background.effect === 'zoom-out') {
				classes.push('carousel-slider-hero-ken-out');
			}

			if (this.options.lazy_load_image) {
				classes.push('owl-lazy');
			}

			return classes;
		},
		cell_inner_classes: function cell_inner_classes(data) {
			var classes = ['carousel-slider-hero__cell__inner', 'cell_inner', 'carousel-slider--h-position-center'];
			classes.push('carousel-slider--v-position-middle');
			if (data.content_alignment === 'left') {
				classes.push('carousel-slider--text-left');
			} else if (data.content_alignment === 'right') {
				classes.push('carousel-slider--text-right');
			} else {
				classes.push('carousel-slider--text-center');
			}

			return classes;
		},
		button_one_classes: function button_one_classes(data) {
			var classes = ['cs-hero-button'];
			classes.push('cs-hero-button-' + data.type);
			classes.push('cs-hero-button-' + data.size);

			return classes;
		},
		button_one_styles: function button_one_styles(data) {
			var styles = { 'border-style': 'solid' };
			styles['border-color'] = data.background_color;
			styles['border-width'] = data.border_width;
			styles['border-radius'] = data.border_radius;

			if (data.type === 'stroke') {
				styles['background-color'] = 'transparent';
				styles['color'] = data.background_color;
			} else {
				styles['background-color'] = data.background_color;
				styles['color'] = data.color;
			}

			return styles;
		}
	}
});

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
	name: "AccordionRepeater",
	props: {
		active: { type: Boolean, default: false },
		title: { type: String, required: true }
	},
	data: function data() {
		return {
			isActive: false
		};
	},
	mounted: function mounted() {
		if (this.active) {
			this.isActive = true;
		}
	},

	methods: {
		clickCopy: function clickCopy() {
			this.$emit('click:copy');
		},
		clickClear: function clickClear() {
			this.$emit('click:clear');
		}
	}
});

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
	name: "ColorPicker",
	model: { prop: 'value', event: 'change' },
	props: {
		value: { type: String, default: '' },
		defaultColor: { default: false },
		alpha: { type: Boolean, default: true }
	},
	data: function data() {
		return {};
	},
	mounted: function mounted() {
		var $ = window.jQuery,
		    self = this,
		    element = $(this.$el).find('input');
		element.wpColorPicker({
			defaultColor: self.defaultColor,
			change: function change(event, ui) {
				self.$emit('input', ui.color.toString());
			}
		});
	}
});

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__material_design_lite_button_MaterialButton_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__material_design_lite_ripple_MaterialRipple_js__ = __webpack_require__(1);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
	name: "MediaUploader",
	props: {
		buttonText: { type: String, default: 'Add Images' },
		galleryCreate: { type: String, default: 'Create Gallery' },
		galleryEdit: { type: String, default: 'Edit Gallery' },
		gallerySave: { type: String, default: 'Save Gallery' },
		galleryProgress: { type: String, default: 'Saving...' },
		galleryInsert: { type: String, default: 'Insert' },
		value: { type: Array, default: [] }
	},
	data: function data() {
		return {
			ids: [],
			images: []
		};
	},

	computed: {
		count_images: function count_images() {
			return this.value.length;
		},
		has_image: function has_image() {
			return this.count_images > 0;
		},
		thumbnails: function thumbnails() {
			return this.images.map(function (image) {
				if (typeof image.thumbnail.source_url !== "undefined") {
					return image.thumbnail.source_url;
				}
				if (typeof image.thumbnail.url !== "undefined") {
					return image.thumbnail.url;
				}
				if (typeof image.full.source_url !== "undefined") {
					return image.full.source_url;
				}
				if (typeof image.full.url !== "undefined") {
					return image.full.url;
				}
			});
		}
	},
	mounted: function mounted() {
		var self = this,
		    frame = void 0,
		    selection = false,
		    button = self.$el.querySelector('.mdl-media-button');
		new __WEBPACK_IMPORTED_MODULE_0__material_design_lite_button_MaterialButton_js__["a" /* MaterialButton */](button);
		new __WEBPACK_IMPORTED_MODULE_1__material_design_lite_ripple_MaterialRipple_js__["a" /* MaterialRipple */](button);

		if (self.value) {
			self.ids = self.value;
			self.getImages(self.ids);
		}
		button.addEventListener('click', function () {
			if (self.ids) {
				selection = self.loadImages(self.ids);
			}

			var options = {
				title: self.galleryCreate,
				state: 'gallery-edit',
				frame: 'post',
				selection: selection
			};

			if (frame || selection) {
				options['title'] = self.galleryEdit;
			}

			frame = wp.media(options).open();

			// Tweak Views
			frame.menu.get('view').unset('cancel');
			frame.menu.get('view').unset('separateCancel');
			frame.menu.get('view').get('gallery-edit').el.innerHTML = self.galleryEdit;
			frame.content.get('view').sidebar.unset('gallery'); // Hide Gallery Settings in sidebar

			// when editing a gallery
			overrideGalleryInsert();
			frame.on('toolbar:render:gallery-edit', function () {
				overrideGalleryInsert();
			});

			frame.on('content:render:browse', function (browser) {
				if (!browser) return;
				// Hide Gallery Settings in sidebar
				browser.sidebar.on('ready', function () {
					browser.sidebar.unset('gallery');
				});
				// Hide filter/search as they don't work
				browser.toolbar.on('ready', function () {
					if (browser.toolbar.controller._state === 'gallery-library') {
						browser.toolbar.$el.hide();
					}
				});
			});

			// All images removed
			frame.state().get('library').on('remove', function () {
				var models = frame.state().get('library');
				if (models.length === 0) {
					selection = false;
					self.clearImages();
				}
			});

			function overrideGalleryInsert() {
				frame.toolbar.get('view').set({
					insert: {
						style: 'primary',
						text: self.gallerySave,
						click: function click() {
							var models = frame.state().get('library'),
							    ids = [];

							models.each(function (attachment) {
								ids.push(attachment.id);
							});

							this.el.innerHTML = self.galleryProgress;

							selection = self.loadImages(ids);
							self.ids = ids;
							self.getImages(ids);
							self.$emit('input', ids);
							frame.close();
						}
					}
				});
			}
		});
	},

	methods: {
		loadImages: function loadImages(ids) {
			if (!ids) {
				return false;
			}
			if (typeof ids !== 'string') {
				ids = ids.toString();
			}

			var shortcode = new wp.shortcode({
				tag: 'gallery',
				attrs: { ids: ids },
				type: 'single'
			});

			var attachments = wp.media.gallery.attachments(shortcode);

			var selection = new wp.media.model.Selection(attachments.models, {
				props: attachments.props.toJSON(),
				multiple: true
			});

			selection.gallery = attachments.gallery;

			selection.more().done(function () {
				// Break ties with the query.
				selection.props.set({ query: false });
				selection.unmirror();
				selection.props.unset('orderby');
			});

			return selection;
		},
		getImages: function getImages(include) {
			var wpApiSettings = window.wpApiSettings,
			    $ = window.jQuery,
			    self = this;
			var url = wpApiSettings.root + wpApiSettings.versionString + 'media';

			$.ajax({
				url: url,
				method: 'GET',
				data: {
					include: include,
					per_page: include.length
				},
				success: function success(images) {
					self.images = [];
					include.forEach(function (id) {
						images.forEach(function (element) {
							if (id === element.id) {
								if (typeof element.media_details.sizes != "undefined") {
									self.images.push(element.media_details.sizes);
								} else {
									self.images.push({ full: { url: element.source_url } });
								}
							}
						});
					});
				}
			});
		},
		clearImages: function clearImages() {
			if (confirm('Are you sure?')) {
				this.ids = [];
				this.images = [];
				this.$emit('input', []);
			}
		}
	}
});

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ColorPicker_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__BackgroundImage_vue__ = __webpack_require__(108);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
	name: "Background",
	components: { ColorPicker: __WEBPACK_IMPORTED_MODULE_0__ColorPicker_vue__["a" /* default */], BackgroundImage: __WEBPACK_IMPORTED_MODULE_1__BackgroundImage_vue__["a" /* default */] },
	props: {
		value: {
			type: Object, default: function _default() {
				return {
					attachment: 'fixed',
					size: 'cover',
					position: 'center center',
					repeat: 'no-repeat'
				};
			}
		},
		supports: {
			type: Array, default: function _default() {
				return ['color', 'image', 'position', 'size'];
			}
		}
	},
	computed: {
		has_image: function has_image() {
			if (typeof this.value.image === "undefined") return false;
			return typeof this.value.image.src !== "undefined";
		},
		id: function id() {
			return this._uid;
		},
		background_attachment: function background_attachment() {
			return [{ value: 'fixed', label: 'Fixed' }, { value: 'scroll', label: 'Scroll' }];
		},
		background_size: function background_size() {
			return [{ value: 'cover', label: 'Cover' }, { value: 'contain', label: 'Contain' }, { value: 'auto', label: 'Auto' }];
		},
		background_position: function background_position() {
			return [{ value: 'left top', label: 'Left Top' }, { value: 'left center', label: 'Left Center' }, { value: 'left bottom', label: 'Left Bottom' }, { value: 'right top', label: 'Right Top' }, { value: 'right center', label: 'Right Center' }, { value: 'right bottom', label: 'Right Bottom' }, { value: 'center top', label: 'Center Top' }, { value: 'center center', label: 'Center Center' }, { value: 'center bottom', label: 'Center Bottom' }];
		},
		background_repeat: function background_repeat() {
			return [{ value: 'no-repeat', label: 'No Repeat' }, { value: 'repeat', label: 'Repeat All' }, { value: 'repeat-x', label: 'Repeat Horizontally' }, { value: 'repeat-y', label: 'Repeat Vertically' }];
		}
	},
	methods: {
		is_enabled: function is_enabled(feature) {
			return -1 !== this.supports.indexOf(feature);
		},
		get_attachment_id: function get_attachment_id(attachment) {
			return 'background_attachment_' + attachment + '_' + this.id;
		},
		get_size_id: function get_size_id(size) {
			return 'background_size_' + size + '_' + this.id;
		}
	}
});

/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
	name: "BackgroundImage",
	props: {
		placeholderText: { type: String, default: 'No File Selected' },
		buttonText: { type: String, default: 'Add Image' },
		removeButtonText: { type: String, default: 'Remove' },
		modalTitle: { type: String, default: 'Select Image' },
		modalButtonText: { type: String, default: 'Set Image' },
		value: { type: Object }
	},
	computed: {
		has_image: function has_image() {
			return !!this.value.src;
		}
	},
	methods: {
		openMediaModal: function openMediaModal() {
			var self = this;

			var frame = new wp.media.view.MediaFrame.Select({
				title: self.modalTitle,
				multiple: false,
				library: {
					order: 'ASC',
					orderby: 'title',
					type: 'image',
					search: null,
					uploadedTo: null
				},

				button: { text: self.modalButtonText }
			});

			frame.on('select', function () {
				var collection = frame.state().get('selection'),
				    ids = 0,
				    sizes = [];

				collection.each(function (attachment) {
					ids = attachment.id;
					sizes = attachment.attributes.sizes;
				});

				self.$emit('input', {
					id: ids,
					src: sizes.full.url,
					height: sizes.full.height,
					width: sizes.full.width
				});
			});

			frame.open();
		},
		clearImages: function clearImages() {
			if (confirm('Are you sure?')) {
				this.$emit('input', {});
			}
		}
	}
});

/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ColorPicker_vue__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
	name: "RichText",
	components: { ColorPicker: __WEBPACK_IMPORTED_MODULE_0__ColorPicker_vue__["a" /* default */] },
	props: {
		value: { type: Object },
		supports: {
			type: Array, default: function _default() {
				return ['text', 'color', 'font-size'];
			}
		}
	},
	methods: {
		is_enabled: function is_enabled(feature) {
			return -1 !== this.supports.indexOf(feature);
		}
	}
});

/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__material_design_lite_radio_button_mdlRadioButton_vue__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ColorPicker_vue__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
	name: "ButtonGenerator",
	components: { ColorPicker: __WEBPACK_IMPORTED_MODULE_1__ColorPicker_vue__["a" /* default */], RadioButton: __WEBPACK_IMPORTED_MODULE_0__material_design_lite_radio_button_mdlRadioButton_vue__["a" /* default */] },
	props: {
		value: {
			type: Object, default: function _default() {
				return {};
			}
		},
		supports: {
			type: Array, default: function _default() {
				return ['text', 'color'];
			}
		}
	}
});

/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlRadioButton_vue__ = __webpack_require__(38);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6db9daa4_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlRadioButton_vue__ = __webpack_require__(118);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(117)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlRadioButton_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6db9daa4_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlRadioButton_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/material-design-lite/radio-button/mdlRadioButton.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6db9daa4", Component.options)
  } else {
    hotAPI.reload("data-v-6db9daa4", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ripple_MaterialRipple_js__ = __webpack_require__(1);
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
	name: "mdlRadioButton",
	model: { prop: 'modelValue', event: 'change' },
	props: {
		label: { type: String, default: '', required: false },
		value: { type: String },
		modelValue: { default: '' }
	},
	mounted: function mounted() {
		// new MaterialRipple(this.$el);
	},

	computed: {
		shouldBeChecked: function shouldBeChecked() {
			return this.modelValue === this.value;
		},
		getClasses: function getClasses() {
			return {
				'is-checked': this.shouldBeChecked
			};
		}
	},
	methods: {
		updateInput: function updateInput() {
			this.$emit('change', this.value);
		}
	}
});

/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__button_mdlButton_vue__ = __webpack_require__(8);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
	name: "mdlSlider",
	model: { prop: 'value', event: 'input' },
	components: { mdlButton: __WEBPACK_IMPORTED_MODULE_0__button_mdlButton_vue__["a" /* default */] },
	props: {
		default: { type: Number, default: 0 },
		min: { type: Number, required: false },
		max: { type: Number, required: false },
		step: { type: Number, required: false },
		value: { type: [Number, String] },
		showReset: { type: Boolean, default: true },
		showInput: { type: Boolean, default: true }
	},
	data: function data() {
		return {};
	},

	methods: {
		triggerInput: function triggerInput(event) {
			this.$emit('input', this.formatNumber(event.target.value));
		},
		resetToDefault: function resetToDefault() {
			this.$emit('input', this.formatNumber(this.default));
		},
		formatNumber: function formatNumber(value) {
			var _value = Number.parseFloat(value);
			return Number.isNaN(_value) ? 0 : _value;
		}
	}
});

/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MaterialSwitch_js__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ripple_MaterialRipple_js__ = __webpack_require__(1);
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
	name: "mdlSwitch",
	mounted: function mounted() {
		new __WEBPACK_IMPORTED_MODULE_0__MaterialSwitch_js__["a" /* MaterialSwitch */](this.$el);
		new __WEBPACK_IMPORTED_MODULE_1__ripple_MaterialRipple_js__["a" /* MaterialRipple */](this.$el.querySelector('.mdl-js-ripple-effect'));
	},

	model: {
		prop: 'modelValue',
		event: 'change'
	},
	props: {
		modelValue: { default: false },
		value: { default: 'on' },
		trueValue: { default: true },
		falseValue: { default: false },
		disabled: { type: Boolean, default: false },
		label: { type: String, default: '' }
	},
	data: function data() {
		return {};
	},

	computed: {
		shouldBeChecked: function shouldBeChecked() {
			if (this.modelValue instanceof Array) {
				return this.modelValue.includes(this.value);
			}
			// Note that `true-value` and `false-value` are camelCase in the JS
			return this.modelValue === this.trueValue;
		}
	},
	methods: {
		updateInput: function updateInput(event) {
			var isChecked = event.target.checked;

			if (this.modelValue instanceof Array) {
				var newValue = [].concat(_toConsumableArray(this.modelValue));

				if (isChecked) {
					newValue.push(this.value);
				} else {
					newValue.splice(newValue.indexOf(this.value), 1);
				}

				this.$emit('change', newValue);
			} else {
				this.$emit('change', isChecked ? this.trueValue : this.falseValue);
			}
		}
	}
});

/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MaterialTooltip_js__ = __webpack_require__(129);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
	name: "mdlTooltip",
	props: {
		large: { type: Boolean, default: false },
		position: { type: String, default: 'bottom' }
	},
	data: function data() {
		return {
			id: null
		};
	},
	mounted: function mounted() {
		this.id = 'mdl_tooltip_' + this._uid;
	},
	updated: function updated() {
		new __WEBPACK_IMPORTED_MODULE_0__MaterialTooltip_js__["a" /* MaterialTooltip */](this.$el.querySelector('.mdl-tooltip'));
	},

	computed: {
		getClass: function getClass() {
			return {
				'mdl-tooltip--large': this.large === true,
				'mdl-tooltip--left': this.position === 'left',
				'mdl-tooltip--right': this.position === 'right',
				'mdl-tooltip--top': this.position === 'top',
				'mdl-tooltip--bottom': this.position === 'bottom'
			};
		}
	}
});

/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MaterialTextfield_js__ = __webpack_require__(133);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
	name: "mdlTextfield",
	props: {
		id: { type: String },
		type: { type: String, default: 'text' },
		label: { type: String },
		value: { type: [String, Number] },
		helptext: { type: String },
		multiline: { type: Boolean, default: false },
		fullwidth: { type: Boolean, default: false },
		rows: { type: Number, default: 3 },
		cols: { type: Number, default: 40 }
	},
	computed: {
		field_id: function field_id() {
			if (this.id) {
				return this.id;
			}

			return this.__uuid;
		}
	},
	data: function data() {
		return {};
	},
	mounted: function mounted() {
		new __WEBPACK_IMPORTED_MODULE_0__MaterialTextfield_js__["a" /* MaterialTextfield */](this.$el);
	}
});

/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__App_vue__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__routers_js__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_admin_menu_fix_js__ = __webpack_require__(136);





jQuery.ajaxSetup({
	beforeSend: function beforeSend(xhr) {
		xhr.setRequestHeader('X-WP-Nonce', window.carouselSliderSettings.nonce);
	}
});

new __WEBPACK_IMPORTED_MODULE_0_vue__["default"]({
	el: '#carousel-slider-admin',
	router: __WEBPACK_IMPORTED_MODULE_2__routers_js__["a" /* default */],
	render: function render(h) {
		return h(__WEBPACK_IMPORTED_MODULE_1__App_vue__["a" /* default */]);
	}
});

// fix the admin menu for the slug "vue-wp-starter"
Object(__WEBPACK_IMPORTED_MODULE_3__utils_admin_menu_fix_js__["a" /* default */])('carousel-slider');

/***/ }),
/* 44 */,
/* 45 */,
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__ = __webpack_require__(9);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6bc4b6d8_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_App_vue__ = __webpack_require__(52);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(47)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6bc4b6d8_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_App_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/admin/App.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6bc4b6d8", Component.options)
  } else {
    hotAPI.reload("data-v-6bc4b6d8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 47 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlSnackbar_vue__ = __webpack_require__(10);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6d6e6182_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlSnackbar_vue__ = __webpack_require__(51);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(49)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlSnackbar_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6d6e6182_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlSnackbar_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/material-design-lite/snackbar/mdlSnackbar.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6d6e6182", Component.options)
  } else {
    hotAPI.reload("data-v-6d6e6182", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 49 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MaterialSnackbar; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class constructor for Snackbar MDL component.
 * Implements MDL component design pattern defined at:
 * https://github.com/jasonmayes/mdl-component-design-pattern
 *
 * @constructor
 * @param {HTMLElement} element The element that will be upgraded.
 */
var MaterialSnackbar = function () {

	/**
  * Class constructor for Snackbar MDL component.
  * Implements MDL component design pattern defined at:
  * https://github.com/jasonmayes/mdl-component-design-pattern
  *
  * @constructor
  * @param {HTMLElement} element The element that will be upgraded.
  */
	function MaterialSnackbar(element) {
		_classCallCheck(this, MaterialSnackbar);

		this.element_ = element;

		/**
   * Store constants in one place so they can be updated easily.
   */
		this.Constant_ = {
			// The duration of the snackbar show/hide animation, in ms.
			ANIMATION_LENGTH: 250
		};

		/**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   */
		this.cssClasses_ = {
			SNACKBAR: 'mdl-snackbar',
			MESSAGE: 'mdl-snackbar__text',
			ACTION: 'mdl-snackbar__action',
			ACTIVE: 'mdl-snackbar--active'
		};

		this.textElement_ = this.element_.querySelector('.' + this.cssClasses_.MESSAGE);
		this.actionElement_ = this.element_.querySelector('.' + this.cssClasses_.ACTION);
		if (!this.textElement_) {
			throw new Error('There must be a message element for a snackbar.');
		}
		if (!this.actionElement_) {
			throw new Error('There must be an action element for a snackbar.');
		}
		this.active = false;
		this.actionHandler_ = undefined;
		this.message_ = undefined;
		this.actionText_ = undefined;
		this.queuedNotifications_ = [];
		this.setActionHidden_(true);
	}

	/**
  * Display the snackbar.
  *
  * @private
  */


	_createClass(MaterialSnackbar, [{
		key: 'displaySnackbar_',
		value: function displaySnackbar_() {
			this.element_.setAttribute('aria-hidden', 'true');

			if (this.actionHandler_) {
				this.actionElement_.textContent = this.actionText_;
				this.actionElement_.addEventListener('click', this.actionHandler_);
				this.setActionHidden_(false);
			}

			this.textElement_.textContent = this.message_;
			this.element_.classList.add(this.cssClasses_.ACTIVE);
			this.element_.setAttribute('aria-hidden', 'false');
			setTimeout(this.cleanup_.bind(this), this.timeout_);
		}
	}, {
		key: 'show',


		/**
   * Show the snackbar.
   *
   * @param {Object} data The data for the notification.
   * @public
   */
		value: function show(data) {
			this.showSnackbar(data);
		}

		/**
   * Show the snackbar.
   *
   * @param {Object} data The data for the notification.
   * @public
   */

	}, {
		key: 'showSnackbar',
		value: function showSnackbar(data) {
			if (data === undefined) {
				throw new Error('Please provide a data object with at least a message to display.');
			}
			if (data['message'] === undefined) {
				throw new Error('Please provide a message to be displayed.');
			}
			if (data['actionHandler'] && !data['actionText']) {
				throw new Error('Please provide action text with the handler.');
			}
			if (this.active) {
				this.queuedNotifications_.push(data);
			} else {
				this.active = true;
				this.message_ = data['message'];
				if (data['timeout']) {
					this.timeout_ = data['timeout'];
				} else {
					this.timeout_ = 2750;
				}
				if (data['actionHandler']) {
					this.actionHandler_ = data['actionHandler'];
				}
				if (data['actionText']) {
					this.actionText_ = data['actionText'];
				}
				this.displaySnackbar_();
			}
		}
	}, {
		key: 'checkQueue_',


		/**
   * Check if the queue has items within it.
   * If it does, display the next entry.
   *
   * @private
   */
		value: function checkQueue_() {
			if (this.queuedNotifications_.length > 0) {
				this.showSnackbar(this.queuedNotifications_.shift());
			}
		}
	}, {
		key: 'cleanup_',


		/**
   * Cleanup the snackbar event listeners and accessiblity attributes.
   *
   * @private
   */
		value: function cleanup_() {
			this.element_.classList.remove(this.cssClasses_.ACTIVE);
			setTimeout(function () {
				this.element_.setAttribute('aria-hidden', 'true');
				this.textElement_.textContent = '';
				if (!Boolean(this.actionElement_.getAttribute('aria-hidden'))) {
					this.setActionHidden_(true);
					this.actionElement_.textContent = '';
					this.actionElement_.removeEventListener('click', this.actionHandler_);
				}
				this.actionHandler_ = undefined;
				this.message_ = undefined;
				this.actionText_ = undefined;
				this.active = false;
				this.checkQueue_();
			}.bind(this), /** @type {number} */this.Constant_.ANIMATION_LENGTH);
		}
	}, {
		key: 'setActionHidden_',


		/**
   * Set the action handler hidden state.
   *
   * @param {boolean} value
   * @private
   */
		value: function setActionHidden_(value) {
			if (value) {
				this.actionElement_.setAttribute('aria-hidden', 'true');
			} else {
				this.actionElement_.removeAttribute('aria-hidden');
			}
		}
	}]);

	return MaterialSnackbar;
}();



/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "mdl-js-snackbar mdl-snackbar", class: _vm.getClasses },
    [
      _c("div", { staticClass: "mdl-snackbar__text" }),
      _vm._v(" "),
      _c("button", {
        staticClass: "mdl-snackbar__action",
        attrs: { type: "button" }
      })
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6d6e6182", esExports)
  }
}

/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "carousel-slider-app" },
    [_c("router-view"), _vm._v(" "), _c("mdl-snackbar")],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6bc4b6d8", esExports)
  }
}

/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_router__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__views_Home_vue__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__views_Documentation_vue__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__views_Slider_vue__ = __webpack_require__(80);






__WEBPACK_IMPORTED_MODULE_0_vue__["default"].use(__WEBPACK_IMPORTED_MODULE_1_vue_router__["default"]);

var routes = [{ path: '/', name: 'Home', component: __WEBPACK_IMPORTED_MODULE_2__views_Home_vue__["a" /* default */] }, { path: '/help', name: 'Documentation', component: __WEBPACK_IMPORTED_MODULE_3__views_Documentation_vue__["a" /* default */] }, { path: '/:id', name: 'Slider', component: __WEBPACK_IMPORTED_MODULE_4__views_Slider_vue__["a" /* default */] }];

/* harmony default export */ __webpack_exports__["a"] = (new __WEBPACK_IMPORTED_MODULE_1_vue_router__["default"]({
	routes: routes // short for `routes: routes`
}));

/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Home_vue__ = __webpack_require__(12);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2ceff6f9_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Home_vue__ = __webpack_require__(76);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(55)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Home_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2ceff6f9_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Home_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/admin/views/Home.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2ceff6f9", Component.options)
  } else {
    hotAPI.reload("data-v-2ceff6f9", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 55 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_ListTable_vue__ = __webpack_require__(13);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_693f87a0_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_ListTable_vue__ = __webpack_require__(58);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(57)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_ListTable_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_693f87a0_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_ListTable_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/admin/components/ListTable.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-693f87a0", Component.options)
  } else {
    hotAPI.reload("data-v-693f87a0", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 57 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { class: { "table-loading": _vm.loading } }, [
    _vm.loading
      ? _c("div", { staticClass: "table-loader-wrap" }, [_vm._m(0)])
      : _vm._e(),
    _vm._v(" "),
    _c("div", { staticClass: "tablenav top" }, [
      _vm.hasBulkActions
        ? _c("div", { staticClass: "alignleft actions bulkactions" }, [
            _c(
              "label",
              {
                staticClass: "screen-reader-text",
                attrs: { for: "bulk-action-selector-top" }
              },
              [_vm._v("Select bulk action")]
            ),
            _vm._v(" "),
            _c(
              "select",
              {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.bulkLocal,
                    expression: "bulkLocal"
                  }
                ],
                attrs: { name: "action", id: "bulk-action-selector-top" },
                on: {
                  change: function($event) {
                    var $$selectedVal = Array.prototype.filter
                      .call($event.target.options, function(o) {
                        return o.selected
                      })
                      .map(function(o) {
                        var val = "_value" in o ? o._value : o.value
                        return val
                      })
                    _vm.bulkLocal = $event.target.multiple
                      ? $$selectedVal
                      : $$selectedVal[0]
                  }
                }
              },
              [
                _c("option", { attrs: { value: "-1" } }, [
                  _vm._v("Bulk Actions")
                ]),
                _vm._v(" "),
                _vm._l(_vm.bulkActions, function(action) {
                  return _c("option", { domProps: { value: action.key } }, [
                    _vm._v(_vm._s(action.label))
                  ])
                })
              ],
              2
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                staticClass: "button action",
                attrs: { disabled: !_vm.checkedItems.length },
                on: {
                  click: function($event) {
                    $event.preventDefault()
                    return _vm.handleBulkAction($event)
                  }
                }
              },
              [_vm._v("Apply\n\t\t\t\t")]
            )
          ])
        : _vm._e(),
      _vm._v(" "),
      _c("div", { staticClass: "alignleft actions" }, [_vm._t("filters")], 2),
      _vm._v(" "),
      _c("div", { staticClass: "tablenav-pages" }, [
        _c("span", { staticClass: "displaying-num" }, [
          _vm._v(_vm._s(_vm.itemsTotal) + " items")
        ]),
        _vm._v(" "),
        _vm.hasPagination
          ? _c("span", { staticClass: "pagination-links" }, [
              _vm.disableFirst
                ? _c(
                    "span",
                    {
                      staticClass: "tablenav-pages-navspan",
                      attrs: { "aria-hidden": "true" }
                    },
                    [_vm._v("«")]
                  )
                : _c(
                    "a",
                    {
                      staticClass: "first-page",
                      attrs: { href: "#" },
                      on: {
                        click: function($event) {
                          $event.preventDefault()
                          _vm.goToPage(1)
                        }
                      }
                    },
                    [
                      _c("span", { attrs: { "aria-hidden": "true" } }, [
                        _vm._v("«")
                      ])
                    ]
                  ),
              _vm._v(" "),
              _vm.disablePrev
                ? _c(
                    "span",
                    {
                      staticClass: "tablenav-pages-navspan",
                      attrs: { "aria-hidden": "true" }
                    },
                    [_vm._v("‹")]
                  )
                : _c(
                    "a",
                    {
                      staticClass: "prev-page",
                      attrs: { href: "#" },
                      on: {
                        click: function($event) {
                          $event.preventDefault()
                          _vm.goToPage(_vm.currentPage - 1)
                        }
                      }
                    },
                    [
                      _c("span", { attrs: { "aria-hidden": "true" } }, [
                        _vm._v("‹")
                      ])
                    ]
                  ),
              _vm._v(" "),
              _c("span", { staticClass: "paging-input" }, [
                _c("span", { staticClass: "tablenav-paging-text" }, [
                  _c("input", {
                    staticClass: "current-page",
                    attrs: {
                      type: "text",
                      name: "paged",
                      "aria-describedby": "table-paging",
                      size: "1"
                    },
                    domProps: { value: _vm.currentPage },
                    on: {
                      keyup: function($event) {
                        if (
                          !("button" in $event) &&
                          _vm._k(
                            $event.keyCode,
                            "enter",
                            13,
                            $event.key,
                            "Enter"
                          )
                        ) {
                          return null
                        }
                        return _vm.goToCustomPage($event)
                      }
                    }
                  }),
                  _vm._v(" of\n              \t\t\t"),
                  _c("span", { staticClass: "total-pages" }, [
                    _vm._v(_vm._s(_vm.totalPages))
                  ])
                ])
              ]),
              _vm._v(" "),
              _vm.disableNext
                ? _c(
                    "span",
                    {
                      staticClass: "tablenav-pages-navspan",
                      attrs: { "aria-hidden": "true" }
                    },
                    [_vm._v("›")]
                  )
                : _c(
                    "a",
                    {
                      staticClass: "next-page",
                      attrs: { href: "#" },
                      on: {
                        click: function($event) {
                          $event.preventDefault()
                          _vm.goToPage(_vm.currentPage + 1)
                        }
                      }
                    },
                    [
                      _c("span", { attrs: { "aria-hidden": "true" } }, [
                        _vm._v("›")
                      ])
                    ]
                  ),
              _vm._v(" "),
              _vm.disableLast
                ? _c(
                    "span",
                    {
                      staticClass: "tablenav-pages-navspan",
                      attrs: { "aria-hidden": "true" }
                    },
                    [_vm._v("»")]
                  )
                : _c(
                    "a",
                    {
                      staticClass: "last-page",
                      attrs: { href: "#" },
                      on: {
                        click: function($event) {
                          $event.preventDefault()
                          _vm.goToPage(_vm.totalPages)
                        }
                      }
                    },
                    [
                      _c("span", { attrs: { "aria-hidden": "true" } }, [
                        _vm._v("»")
                      ])
                    ]
                  )
            ])
          : _vm._e()
      ])
    ]),
    _vm._v(" "),
    _c("table", { class: _vm.tableClass }, [
      _c("thead", [
        _c(
          "tr",
          [
            _vm.showCb
              ? _c(
                  "td",
                  { staticClass: "manage-column column-cb check-column" },
                  [
                    _c(
                      "label",
                      {
                        staticClass: "screen-reader-text",
                        attrs: { for: "cb-select-all-1" }
                      },
                      [_vm._v("Select All")]
                    ),
                    _vm._v(" "),
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.selectAll,
                          expression: "selectAll"
                        }
                      ],
                      attrs: { id: "cb-select-all-1", type: "checkbox" },
                      domProps: {
                        checked: Array.isArray(_vm.selectAll)
                          ? _vm._i(_vm.selectAll, null) > -1
                          : _vm.selectAll
                      },
                      on: {
                        change: function($event) {
                          var $$a = _vm.selectAll,
                            $$el = $event.target,
                            $$c = $$el.checked ? true : false
                          if (Array.isArray($$a)) {
                            var $$v = null,
                              $$i = _vm._i($$a, $$v)
                            if ($$el.checked) {
                              $$i < 0 && (_vm.selectAll = $$a.concat([$$v]))
                            } else {
                              $$i > -1 &&
                                (_vm.selectAll = $$a
                                  .slice(0, $$i)
                                  .concat($$a.slice($$i + 1)))
                            }
                          } else {
                            _vm.selectAll = $$c
                          }
                        }
                      }
                    })
                  ]
                )
              : _vm._e(),
            _vm._v(" "),
            _vm._l(_vm.columns, function(column) {
              return _c(
                "th",
                { class: _vm.getHeadColumnClass(column.key, column) },
                [
                  !_vm.isSortable(column)
                    ? [
                        _vm._v(
                          "\n\t\t\t\t\t\t" +
                            _vm._s(column.label) +
                            "\n\t\t\t\t\t"
                        )
                      ]
                    : _c(
                        "a",
                        {
                          attrs: { href: "#" },
                          on: {
                            click: function($event) {
                              $event.preventDefault()
                              _vm.handleSortBy(column.key)
                            }
                          }
                        },
                        [
                          _c("span", [_vm._v(_vm._s(column.label))]),
                          _vm._v(" "),
                          _c("span", { staticClass: "sorting-indicator" })
                        ]
                      )
                ],
                2
              )
            })
          ],
          2
        )
      ]),
      _vm._v(" "),
      _c("tfoot", [
        _c(
          "tr",
          [
            _vm.showCb
              ? _c(
                  "td",
                  { staticClass: "manage-column column-cb check-column" },
                  [
                    _c(
                      "label",
                      {
                        staticClass: "screen-reader-text",
                        attrs: { for: "cb-select-all-2" }
                      },
                      [_vm._v("Select All")]
                    ),
                    _vm._v(" "),
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.selectAll,
                          expression: "selectAll"
                        }
                      ],
                      attrs: { id: "cb-select-all-2", type: "checkbox" },
                      domProps: {
                        checked: Array.isArray(_vm.selectAll)
                          ? _vm._i(_vm.selectAll, null) > -1
                          : _vm.selectAll
                      },
                      on: {
                        change: function($event) {
                          var $$a = _vm.selectAll,
                            $$el = $event.target,
                            $$c = $$el.checked ? true : false
                          if (Array.isArray($$a)) {
                            var $$v = null,
                              $$i = _vm._i($$a, $$v)
                            if ($$el.checked) {
                              $$i < 0 && (_vm.selectAll = $$a.concat([$$v]))
                            } else {
                              $$i > -1 &&
                                (_vm.selectAll = $$a
                                  .slice(0, $$i)
                                  .concat($$a.slice($$i + 1)))
                            }
                          } else {
                            _vm.selectAll = $$c
                          }
                        }
                      }
                    })
                  ]
                )
              : _vm._e(),
            _vm._v(" "),
            _vm._l(_vm.columns, function(column) {
              return _c(
                "th",
                { class: _vm.getHeadColumnClass(column.key, column) },
                [_vm._v("\n\t\t\t\t\t" + _vm._s(column.label) + "\n\t\t\t\t")]
              )
            })
          ],
          2
        )
      ]),
      _vm._v(" "),
      _c(
        "tbody",
        [
          _vm.rows.length
            ? _vm._l(_vm.rows, function(row) {
                return _c(
                  "tr",
                  { key: row[_vm.index] },
                  [
                    _vm.showCb
                      ? _c(
                          "th",
                          {
                            staticClass: "check-column",
                            attrs: { scope: "row" }
                          },
                          [
                            _c("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: _vm.checkedItems,
                                  expression: "checkedItems"
                                }
                              ],
                              attrs: { type: "checkbox", name: "item[]" },
                              domProps: {
                                value: row[_vm.index],
                                checked: Array.isArray(_vm.checkedItems)
                                  ? _vm._i(_vm.checkedItems, row[_vm.index]) >
                                    -1
                                  : _vm.checkedItems
                              },
                              on: {
                                change: function($event) {
                                  var $$a = _vm.checkedItems,
                                    $$el = $event.target,
                                    $$c = $$el.checked ? true : false
                                  if (Array.isArray($$a)) {
                                    var $$v = row[_vm.index],
                                      $$i = _vm._i($$a, $$v)
                                    if ($$el.checked) {
                                      $$i < 0 &&
                                        (_vm.checkedItems = $$a.concat([$$v]))
                                    } else {
                                      $$i > -1 &&
                                        (_vm.checkedItems = $$a
                                          .slice(0, $$i)
                                          .concat($$a.slice($$i + 1)))
                                    }
                                  } else {
                                    _vm.checkedItems = $$c
                                  }
                                }
                              }
                            })
                          ]
                        )
                      : _vm._e(),
                    _vm._v(" "),
                    _vm._l(_vm.columns, function(column) {
                      return _c(
                        "td",
                        {
                          class: _vm.getBodyColumnClass(column.key),
                          attrs: { "data-colname": column.label }
                        },
                        [
                          _vm._t(
                            column.key,
                            [
                              _vm._v(
                                "\n\t\t\t\t\t\t\t" +
                                  _vm._s(row[column.key]) +
                                  "\n\t\t\t\t\t\t"
                              )
                            ],
                            { row: row }
                          ),
                          _vm._v(" "),
                          _vm.actionColumn === column.key && _vm.hasActions
                            ? _c(
                                "div",
                                { staticClass: "row-actions" },
                                [
                                  _vm._t(
                                    "row-actions",
                                    _vm._l(_vm.actions, function(action) {
                                      return _c(
                                        "span",
                                        { class: action.key },
                                        [
                                          _c(
                                            "a",
                                            {
                                              attrs: { href: "#" },
                                              on: {
                                                click: function($event) {
                                                  $event.preventDefault()
                                                  _vm.actionClicked(
                                                    action.key,
                                                    row
                                                  )
                                                }
                                              }
                                            },
                                            [_vm._v(_vm._s(action.label))]
                                          ),
                                          _vm._v(" "),
                                          !_vm.hideActionSeparator(action.key)
                                            ? [_vm._v(" | ")]
                                            : _vm._e()
                                        ],
                                        2
                                      )
                                    }),
                                    { row: row }
                                  )
                                ],
                                2
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.actionColumn === column.key && _vm.hasActions
                            ? _c(
                                "button",
                                {
                                  staticClass: "toggle-row",
                                  attrs: { type: "button" }
                                },
                                [
                                  _c(
                                    "span",
                                    { staticClass: "screen-reader-text" },
                                    [_vm._v("Show more details")]
                                  )
                                ]
                              )
                            : _vm._e()
                        ],
                        2
                      )
                    })
                  ],
                  2
                )
              })
            : _c("tr", [
                _c("td", { attrs: { colspan: _vm.colspan } }, [
                  _vm._v(_vm._s(_vm.notFound))
                ])
              ])
        ],
        2
      )
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "tablenav bottom" }, [
      _vm.hasBulkActions
        ? _c("div", { staticClass: "alignleft actions bulkactions" }, [
            _c(
              "label",
              {
                staticClass: "screen-reader-text",
                attrs: { for: "bulk-action-selector-bottom" }
              },
              [_vm._v("Select bulk action")]
            ),
            _vm._v(" "),
            _c(
              "select",
              {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.bulkLocal,
                    expression: "bulkLocal"
                  }
                ],
                attrs: { name: "action", id: "bulk-action-selector-bottom" },
                on: {
                  change: function($event) {
                    var $$selectedVal = Array.prototype.filter
                      .call($event.target.options, function(o) {
                        return o.selected
                      })
                      .map(function(o) {
                        var val = "_value" in o ? o._value : o.value
                        return val
                      })
                    _vm.bulkLocal = $event.target.multiple
                      ? $$selectedVal
                      : $$selectedVal[0]
                  }
                }
              },
              [
                _c("option", { attrs: { value: "-1" } }, [
                  _vm._v("Bulk Actions")
                ]),
                _vm._v(" "),
                _vm._l(_vm.bulkActions, function(action) {
                  return _c("option", { domProps: { value: action.key } }, [
                    _vm._v(_vm._s(action.label))
                  ])
                })
              ],
              2
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                staticClass: "button action",
                attrs: { disabled: !_vm.checkedItems.length },
                on: {
                  click: function($event) {
                    $event.preventDefault()
                    return _vm.handleBulkAction($event)
                  }
                }
              },
              [_vm._v("Apply\n\t\t\t\t")]
            )
          ])
        : _vm._e(),
      _vm._v(" "),
      _c("div", { staticClass: "tablenav-pages" }, [
        _c("span", { staticClass: "displaying-num" }, [
          _vm._v(_vm._s(_vm.itemsTotal) + " items")
        ]),
        _vm._v(" "),
        _vm.hasPagination
          ? _c("span", { staticClass: "pagination-links" }, [
              _vm.disableFirst
                ? _c(
                    "span",
                    {
                      staticClass: "tablenav-pages-navspan",
                      attrs: { "aria-hidden": "true" }
                    },
                    [_vm._v("«")]
                  )
                : _c(
                    "a",
                    {
                      staticClass: "first-page",
                      attrs: { href: "#" },
                      on: {
                        click: function($event) {
                          $event.preventDefault()
                          _vm.goToPage(1)
                        }
                      }
                    },
                    [
                      _c("span", { attrs: { "aria-hidden": "true" } }, [
                        _vm._v("«")
                      ])
                    ]
                  ),
              _vm._v(" "),
              _vm.disablePrev
                ? _c(
                    "span",
                    {
                      staticClass: "tablenav-pages-navspan",
                      attrs: { "aria-hidden": "true" }
                    },
                    [_vm._v("‹")]
                  )
                : _c(
                    "a",
                    {
                      staticClass: "prev-page",
                      attrs: { href: "#" },
                      on: {
                        click: function($event) {
                          $event.preventDefault()
                          _vm.goToPage(_vm.currentPage - 1)
                        }
                      }
                    },
                    [
                      _c("span", { attrs: { "aria-hidden": "true" } }, [
                        _vm._v("‹")
                      ])
                    ]
                  ),
              _vm._v(" "),
              _c("span", { staticClass: "paging-input" }, [
                _c("span", { staticClass: "tablenav-paging-text" }, [
                  _vm._v(
                    "\n              " +
                      _vm._s(_vm.currentPage) +
                      " of\n              "
                  ),
                  _c("span", { staticClass: "total-pages" }, [
                    _vm._v(_vm._s(_vm.totalPages))
                  ])
                ])
              ]),
              _vm._v(" "),
              _vm.disableNext
                ? _c(
                    "span",
                    {
                      staticClass: "tablenav-pages-navspan",
                      attrs: { "aria-hidden": "true" }
                    },
                    [_vm._v("›")]
                  )
                : _c(
                    "a",
                    {
                      staticClass: "next-page",
                      attrs: { href: "#" },
                      on: {
                        click: function($event) {
                          $event.preventDefault()
                          _vm.goToPage(_vm.currentPage + 1)
                        }
                      }
                    },
                    [
                      _c("span", { attrs: { "aria-hidden": "true" } }, [
                        _vm._v("›")
                      ])
                    ]
                  ),
              _vm._v(" "),
              _vm.disableLast
                ? _c(
                    "span",
                    {
                      staticClass: "tablenav-pages-navspan",
                      attrs: { "aria-hidden": "true" }
                    },
                    [_vm._v("»")]
                  )
                : _c(
                    "a",
                    {
                      staticClass: "last-page",
                      attrs: { href: "#" },
                      on: {
                        click: function($event) {
                          $event.preventDefault()
                          _vm.goToPage(_vm.totalPages)
                        }
                      }
                    },
                    [
                      _c("span", { attrs: { "aria-hidden": "true" } }, [
                        _vm._v("»")
                      ])
                    ]
                  )
            ])
          : _vm._e()
      ])
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "table-loader-center" }, [
      _c("div", { staticClass: "table-loader" }, [_vm._v("Loading")])
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-693f87a0", esExports)
  }
}

/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_CopyToClipboard_vue__ = __webpack_require__(14);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3164d406_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_CopyToClipboard_vue__ = __webpack_require__(61);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(60)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_CopyToClipboard_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3164d406_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_CopyToClipboard_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/admin/components/CopyToClipboard.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3164d406", Component.options)
  } else {
    hotAPI.reload("data-v-3164d406", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 60 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("div", { staticClass: "mdl-copy-to-clipboard" }, [
      _c("input", {
        staticClass: "mdl-copy-to-clipboard__input",
        attrs: { type: "text" },
        domProps: { value: _vm.value },
        on: { click: _vm.clickInput }
      }),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "mdl-copy-to-clipboard__icon",
          on: { click: _vm.clickIcon }
        },
        [
          _c("span", { staticClass: "mdl-copy-to-clipboard__tooltip" }, [
            _vm._v(_vm._s(_vm.beforeCopy))
          ]),
          _vm._v(" "),
          _c(
            "svg",
            {
              attrs: {
                version: "1.1",
                xmlns: "http://www.w3.org/2000/svg",
                width: "16",
                height: "16",
                viewBox: "0 0 16 16"
              }
            },
            [
              _c("path", {
                attrs: {
                  d:
                    "M12.656 14v-9.344h-7.313v9.344h7.313zM12.656 3.344c0.719 0 1.344 0.594 1.344 1.313v9.344c0 0.719-0.625 1.344-1.344 1.344h-7.313c-0.719 0-1.344-0.625-1.344-1.344v-9.344c0-0.719 0.625-1.313 1.344-1.313h7.313zM10.656 0.656v1.344h-8v9.344h-1.313v-9.344c0-0.719 0.594-1.344 1.313-1.344h8z"
                }
              })
            ]
          )
        ]
      )
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-3164d406", esExports)
  }
}

/***/ }),
/* 62 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "button",
    {
      staticClass: "mdl-button mdl-js-button mdl-button--fab",
      class: _vm.getClasses,
      attrs: { disabled: _vm.disabled },
      on: {
        click: function($event) {
          _vm.$emit("click")
        }
      }
    },
    [_vm._t("default")],
    2
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-73c508b0", esExports)
  }
}

/***/ }),
/* 64 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlModal_vue__ = __webpack_require__(17);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_093bbac9_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlModal_vue__ = __webpack_require__(68);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(65)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlModal_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_093bbac9_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlModal_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/material-design-lite/modal/mdlModal.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-093bbac9", Component.options)
  } else {
    hotAPI.reload("data-v-093bbac9", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 65 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 66 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "button",
    {
      staticClass: "mdl-button mdl-js-button",
      class: _vm.getClass,
      attrs: { disabled: _vm.disabled },
      on: {
        click: function($event) {
          _vm.$emit("click", $event)
        }
      }
    },
    [_vm._t("default")],
    2
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-8ac316ce", esExports)
  }
}

/***/ }),
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      directives: [
        {
          name: "show",
          rawName: "v-show",
          value: _vm.active,
          expression: "active"
        }
      ],
      staticClass: "mdl-modal is-active"
    },
    [
      _c("div", { staticClass: "mdl-modal-background" }),
      _vm._v(" "),
      _c(
        "div",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: !_vm.is_card,
              expression: "!is_card"
            }
          ],
          staticClass: "mdl-modal-content"
        },
        [_vm._t("default")],
        2
      ),
      _vm._v(" "),
      _c("button", {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: !_vm.is_card,
            expression: "!is_card"
          }
        ],
        staticClass: "mdl-modal-close is-fixed is-large",
        attrs: { "aria-label": "close" },
        on: {
          click: function($event) {
            $event.preventDefault()
            return _vm.close($event)
          }
        }
      }),
      _vm._v(" "),
      _c(
        "div",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.is_card,
              expression: "is_card"
            }
          ],
          staticClass: "mdl-modal-card"
        },
        [
          _c("div", { staticClass: "mdl-modal-card-head" }, [
            _c("p", { staticClass: "mdl-modal-card-title" }, [
              _vm._v(_vm._s(_vm.title))
            ]),
            _vm._v(" "),
            _c("button", {
              staticClass: "mdl-modal-close",
              attrs: { "aria-label": "close" },
              on: {
                click: function($event) {
                  $event.preventDefault()
                  return _vm.close($event)
                }
              }
            })
          ]),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "mdl-modal-card-body" },
            [_vm._t("default")],
            2
          ),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "mdl-modal-card-foot is-pulled-right" },
            [
              _vm._t("foot", [
                _c(
                  "mdl-button",
                  {
                    on: {
                      click: function($event) {
                        $event.preventDefault()
                        return _vm.close($event)
                      }
                    }
                  },
                  [_vm._v("Cancel")]
                )
              ])
            ],
            2
          )
        ]
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-093bbac9", esExports)
  }
}

/***/ }),
/* 69 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlRadio_vue__ = __webpack_require__(19);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_30167289_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlRadio_vue__ = __webpack_require__(72);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(70)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlRadio_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_30167289_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlRadio_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/material-design-lite/radio/mdlRadio.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-30167289", Component.options)
  } else {
    hotAPI.reload("data-v-30167289", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 70 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 71 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MaterialRadio; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var MaterialRadio = function () {
	/**
  * Class constructor for Radio MDL component.
  * Implements MDL component design pattern defined at:
  * https://github.com/jasonmayes/mdl-component-design-pattern
  *
  * @constructor
  * @param {HTMLElement} element The element that will be upgraded.
  */
	function MaterialRadio(element) {
		_classCallCheck(this, MaterialRadio);

		this.element_ = element;

		/**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
		this.Constant_ = {
			TINY_TIMEOUT: 0.001
		};

		/**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
		this.CssClasses_ = {
			IS_FOCUSED: 'is-focused',
			IS_DISABLED: 'is-disabled',
			IS_CHECKED: 'is-checked',
			IS_UPGRADED: 'is-upgraded',
			JS_RADIO: 'mdl-js-radio',
			RADIO_BTN: 'mdl-radio__button',
			RADIO_OUTER_CIRCLE: 'mdl-radio__outer-circle',
			RADIO_INNER_CIRCLE: 'mdl-radio__inner-circle',
			RIPPLE_EFFECT: 'mdl-js-ripple-effect',
			RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
			RIPPLE_CONTAINER: 'mdl-radio__ripple-container',
			RIPPLE_CENTER: 'mdl-ripple--center',
			RIPPLE: 'mdl-ripple'
		};

		// Initialize instance.
		this.init();
	}

	/**
  * Handle change of state.
  *
  * @param {Event} event The event that fired.
  * @private
  */


	_createClass(MaterialRadio, [{
		key: 'onChange_',
		value: function onChange_(event) {
			// Since other radio buttons don't get change events, we need to look for
			// them to update their classes.
			var radios = document.getElementsByClassName(this.CssClasses_.JS_RADIO);
			for (var i = 0; i < radios.length; i++) {
				var button = radios[i].querySelector('.' + this.CssClasses_.RADIO_BTN);
				// Different name == different group, so no point updating those.
				if (button.getAttribute('name') === this.btnElement_.getAttribute('name')) {
					if (typeof radios[i]['MaterialRadio'] !== 'undefined') {
						radios[i]['MaterialRadio'].updateClasses_();
					}
				}
			}
		}
	}, {
		key: 'onFocus_',


		/**
   * Handle focus.
   *
   * @param {Event} event The event that fired.
   * @private
   */
		value: function onFocus_(event) {
			this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
		}
	}, {
		key: 'onBlur_',


		/**
   * Handle lost focus.
   *
   * @param {Event} event The event that fired.
   * @private
   */
		value: function onBlur_(event) {
			this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
		}
	}, {
		key: 'onMouseup_',


		/**
   * Handle mouseup.
   *
   * @param {Event} event The event that fired.
   * @private
   */
		value: function onMouseup_(event) {
			this.blur_();
		}
	}, {
		key: 'updateClasses_',


		/**
   * Update classes.
   *
   * @private
   */
		value: function updateClasses_() {
			this.checkDisabled();
			this.checkToggleState();
		}
	}, {
		key: 'blur_',


		/**
   * Add blur.
   *
   * @private
   */
		value: function blur_() {

			// TODO: figure out why there's a focus event being fired after our blur,
			// so that we can avoid this hack.
			window.setTimeout(function () {
				this.btnElement_.blur();
			}.bind(this), /** @type {number} */this.Constant_.TINY_TIMEOUT);
		}
	}, {
		key: 'checkDisabled',


		// Public methods.

		/**
   * Check the components disabled state.
   *
   * @public
   */
		value: function checkDisabled() {
			if (this.btnElement_.disabled) {
				this.element_.classList.add(this.CssClasses_.IS_DISABLED);
			} else {
				this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
			}
		}
	}, {
		key: 'checkToggleState',


		/**
   * Check the components toggled state.
   *
   * @public
   */
		value: function checkToggleState() {
			if (this.btnElement_.checked) {
				this.element_.classList.add(this.CssClasses_.IS_CHECKED);
			} else {
				this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
			}
		}
	}, {
		key: 'disable',


		/**
   * Disable radio.
   *
   * @public
   */
		value: function disable() {
			this.btnElement_.disabled = true;
			this.updateClasses_();
		}
	}, {
		key: 'enable',


		/**
   * Enable radio.
   *
   * @public
   */
		value: function enable() {
			this.btnElement_.disabled = false;
			this.updateClasses_();
		}
	}, {
		key: 'check',


		/**
   * Check radio.
   *
   * @public
   */
		value: function check() {
			this.btnElement_.checked = true;
			this.onChange_(null);
		}
	}, {
		key: 'uncheck',


		/**
   * Uncheck radio.
   *
   * @public
   */
		value: function uncheck() {
			this.btnElement_.checked = false;
			this.onChange_(null);
		}
	}, {
		key: 'init',


		/**
   * Initialize element.
   */
		value: function init() {
			if (this.element_) {
				this.btnElement_ = this.element_.querySelector('.' + this.CssClasses_.RADIO_BTN);

				this.boundChangeHandler_ = this.onChange_.bind(this);
				this.boundFocusHandler_ = this.onChange_.bind(this);
				this.boundBlurHandler_ = this.onBlur_.bind(this);
				this.boundMouseUpHandler_ = this.onMouseup_.bind(this);

				var outerCircle = document.createElement('span');
				outerCircle.classList.add(this.CssClasses_.RADIO_OUTER_CIRCLE);

				var innerCircle = document.createElement('span');
				innerCircle.classList.add(this.CssClasses_.RADIO_INNER_CIRCLE);

				this.element_.appendChild(outerCircle);
				this.element_.appendChild(innerCircle);

				var rippleContainer = void 0;
				if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
					this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
					rippleContainer = document.createElement('span');
					rippleContainer.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
					rippleContainer.classList.add(this.CssClasses_.RIPPLE_EFFECT);
					rippleContainer.classList.add(this.CssClasses_.RIPPLE_CENTER);
					rippleContainer.addEventListener('mouseup', this.boundMouseUpHandler_);

					var ripple = document.createElement('span');
					ripple.classList.add(this.CssClasses_.RIPPLE);

					rippleContainer.appendChild(ripple);
					this.element_.appendChild(rippleContainer);
				}

				this.btnElement_.addEventListener('change', this.boundChangeHandler_);
				this.btnElement_.addEventListener('focus', this.boundFocusHandler_);
				this.btnElement_.addEventListener('blur', this.boundBlurHandler_);
				this.element_.addEventListener('mouseup', this.boundMouseUpHandler_);

				this.updateClasses_();
				this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
			}
		}
	}]);

	return MaterialRadio;
}();



/***/ }),
/* 72 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "label",
    {
      staticClass: "mdl-radio mdl-js-radio mdl-js-ripple-effect",
      class: _vm.getClasses
    },
    [
      _c("input", {
        staticClass: "mdl-radio__button",
        attrs: { type: "radio" },
        domProps: { checked: _vm.shouldBeChecked, value: _vm.value },
        on: { change: _vm.updateInput }
      }),
      _vm._v(" "),
      _c(
        "span",
        { staticClass: "mdl-radio__label" },
        [_vm._t("default", [_vm._v(_vm._s(_vm.label))])],
        2
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-30167289", esExports)
  }
}

/***/ }),
/* 73 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MaterialSpinner; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MaterialSpinner = function () {

	/**
  * Class constructor for Spinner MDL component.
  * Implements MDL component design pattern defined at:
  * https://github.com/jasonmayes/mdl-component-design-pattern
  *
  * @param {HTMLElement} element The element that will be upgraded.
  * @constructor
  */
	function MaterialSpinner(element) {
		_classCallCheck(this, MaterialSpinner);

		this.element_ = element;

		/**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
		this.Constant_ = {
			MDL_SPINNER_LAYER_COUNT: 4
		};

		/**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
		this.CssClasses_ = {
			MDL_SPINNER_LAYER: 'mdl-spinner__layer',
			MDL_SPINNER_CIRCLE_CLIPPER: 'mdl-spinner__circle-clipper',
			MDL_SPINNER_CIRCLE: 'mdl-spinner__circle',
			MDL_SPINNER_GAP_PATCH: 'mdl-spinner__gap-patch',
			MDL_SPINNER_LEFT: 'mdl-spinner__left',
			MDL_SPINNER_RIGHT: 'mdl-spinner__right'
		};

		// Initialize instance.
		this.init();
	}

	/**
  * Auxiliary method to create a spinner layer.
  *
  * @param {number} index Index of the layer to be created.
  * @public
  */


	_createClass(MaterialSpinner, [{
		key: 'createLayer',
		value: function createLayer(index) {
			var layer = document.createElement('div');
			layer.classList.add(this.CssClasses_.MDL_SPINNER_LAYER);
			layer.classList.add(this.CssClasses_.MDL_SPINNER_LAYER + '-' + index);

			var leftClipper = document.createElement('div');
			leftClipper.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE_CLIPPER);
			leftClipper.classList.add(this.CssClasses_.MDL_SPINNER_LEFT);

			var gapPatch = document.createElement('div');
			gapPatch.classList.add(this.CssClasses_.MDL_SPINNER_GAP_PATCH);

			var rightClipper = document.createElement('div');
			rightClipper.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE_CLIPPER);
			rightClipper.classList.add(this.CssClasses_.MDL_SPINNER_RIGHT);

			var circleOwners = [leftClipper, gapPatch, rightClipper];

			for (var i = 0; i < circleOwners.length; i++) {
				var circle = document.createElement('div');
				circle.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE);
				circleOwners[i].appendChild(circle);
			}

			layer.appendChild(leftClipper);
			layer.appendChild(gapPatch);
			layer.appendChild(rightClipper);

			this.element_.appendChild(layer);
		}

		/**
   * Stops the spinner animation.
   * Public method for users who need to stop the spinner for any reason.
   *
   * @public
   */

	}, {
		key: 'stop',
		value: function stop() {
			this.element_.classList.remove('is-active');
		}
	}, {
		key: 'start',


		/**
   * Starts the spinner animation.
   * Public method for users who need to manually start the spinner for any reason
   * (instead of just adding the 'is-active' class to their markup).
   *
   * @public
   */
		value: function start() {
			this.element_.classList.add('is-active');
		}
	}, {
		key: 'init',


		/**
   * Initialize element.
   */
		value: function init() {
			if (this.element_) {
				for (var i = 1; i <= this.Constant_.MDL_SPINNER_LAYER_COUNT; i++) {
					this.createLayer(i);
				}

				this.element_.classList.add('is-upgraded');
			}
		}
	}]);

	return MaterialSpinner;
}();



/***/ }),
/* 75 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", {
    staticClass: "mdl-spinner mdl-js-spinner",
    class: _vm.getClass
  })
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-3d6f96ee", esExports)
  }
}

/***/ }),
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "carousel-slider-list-page" },
    [
      _c("h1", { staticClass: "wp-heading-inline" }, [_vm._v("Sliders")]),
      _vm._v(" "),
      _c("div", { staticClass: "clear" }),
      _vm._v(" "),
      _c("ul", { staticClass: "status-lists" }, [
        _c("li", { staticClass: "publish" }, [
          _c(
            "a",
            {
              class: { current: _vm.postStatus === "publish" },
              attrs: { href: "#" },
              on: {
                click: function($event) {
                  _vm.changeStatus("publish")
                }
              }
            },
            [
              _vm._v("Published\n\t\t\t\t"),
              _c("span", { staticClass: "count" }, [
                _vm._v("(" + _vm._s(_vm.counts.publish) + ")")
              ])
            ]
          )
        ]),
        _vm._v(" "),
        _c("li", { staticClass: "trash" }, [
          _c(
            "a",
            {
              class: { current: _vm.postStatus === "trash" },
              attrs: { href: "#" },
              on: {
                click: function($event) {
                  _vm.changeStatus("trash")
                }
              }
            },
            [
              _vm._v("Trash\n\t\t\t\t"),
              _c("span", { staticClass: "count" }, [
                _vm._v("(" + _vm._s(_vm.counts.trash) + ")")
              ])
            ]
          )
        ])
      ]),
      _vm._v(" "),
      _c("list-table", {
        attrs: {
          columns: _vm.columns,
          rows: _vm.rows,
          actions: _vm.actions,
          "bulk-actions": _vm.bulkActions,
          "action-column": "title"
        },
        on: {
          "action:click": _vm.onActionClick,
          "bulk:click": _vm.onBulkAction
        },
        scopedSlots: _vm._u([
          {
            key: "slider-type",
            fn: function(data) {
              return [
                _c("span", [_vm._v(_vm._s(_vm.sliderTypes[data.row.type]))])
              ]
            }
          },
          {
            key: "shortcode",
            fn: function(data) {
              return [
                _c("copy-to-clipboard", {
                  attrs: { value: _vm.shortcode(data.row) }
                })
              ]
            }
          }
        ])
      }),
      _vm._v(" "),
      _c("mdl-fab", { on: { click: _vm.openModal } }, [_vm._v("+")]),
      _vm._v(" "),
      _c(
        "mdl-modal",
        {
          attrs: { active: _vm.modalActive, title: "Add New Slider" },
          on: { close: _vm.closeModal }
        },
        _vm._l(_vm.sliderTypes, function(label, slug) {
          return _c(
            "p",
            [
              _c(
                "mdl-radio",
                {
                  attrs: { value: slug },
                  model: {
                    value: _vm.sliderType,
                    callback: function($$v) {
                      _vm.sliderType = $$v
                    },
                    expression: "sliderType"
                  }
                },
                [_vm._v(_vm._s(label))]
              )
            ],
            1
          )
        }),
        0
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.loading,
              expression: "loading"
            }
          ],
          staticClass: "carousel-slider-spinner"
        },
        [_c("mdl-spinner", { attrs: { active: _vm.loading } })],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-2ceff6f9", esExports)
  }
}

/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Documentation_vue__ = __webpack_require__(22);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_cbacd8e0_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Documentation_vue__ = __webpack_require__(79);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(78)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Documentation_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_cbacd8e0_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Documentation_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/admin/views/Documentation.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-cbacd8e0", Component.options)
  } else {
    hotAPI.reload("data-v-cbacd8e0", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 78 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm._m(0)
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "carousel-slider-list-page" }, [
      _c("h1", { staticClass: "wp-heading-inline" }, [_vm._v("Help")]),
      _vm._v(" "),
      _c("div", { staticClass: "clear" }),
      _vm._v(" "),
      _c("div", { staticClass: "cs-columns" }, [
        _c("div", { staticClass: "cs-column cs-column-3" }, [
          _c("div", { staticClass: "cs-card cs-shadow--4dp" }, [
            _c("div", { staticClass: "carousel-slider-iframe" }, [
              _c("iframe", {
                attrs: {
                  width: "1280",
                  height: "720",
                  src: "https://www.youtube.com/embed/_hVsamgr1k4",
                  frameborder: "0",
                  allowfullscreen: ""
                }
              })
            ]),
            _vm._v(" "),
            _c("h2", { staticClass: "cs-card-title" }, [_vm._v("Hero Slider")]),
            _vm._v(" "),
            _c("p", { staticClass: "cs-card-description" }, [
              _vm._v("Hero carousel demo.")
            ])
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "cs-column cs-column-3" }, [
          _c("div", { staticClass: "cs-card cs-shadow--4dp" }, [
            _c("div", { staticClass: "carousel-slider-iframe" }, [
              _c("iframe", {
                attrs: {
                  width: "1280",
                  height: "720",
                  src: "https://www.youtube.com/embed/ZzI1JhElrxc",
                  frameborder: "0",
                  allowfullscreen: ""
                }
              })
            ]),
            _vm._v(" "),
            _c("h2", { staticClass: "cs-card-title" }, [
              _vm._v("Images Carousel")
            ]),
            _vm._v(" "),
            _c("p", { staticClass: "cs-card-description" }, [
              _vm._v("Image carousel using gallery images.")
            ])
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "cs-column cs-column-3" }, [
          _c("div", { staticClass: "cs-card cs-shadow--4dp" }, [
            _c("div", { staticClass: "carousel-slider-iframe" }, [
              _c("iframe", {
                attrs: {
                  width: "1280",
                  height: "720",
                  src: "https://www.youtube.com/embed/a7hqn1yNzwM",
                  frameborder: "0",
                  allowfullscreen: ""
                }
              })
            ]),
            _vm._v(" "),
            _c("h2", { staticClass: "cs-card-title" }, [
              _vm._v("Images Carousel")
            ]),
            _vm._v(" "),
            _c("p", { staticClass: "cs-card-description" }, [
              _vm._v("Image carousel using custom URLs")
            ])
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "cs-column cs-column-3" }, [
          _c("div", { staticClass: "cs-card cs-shadow--4dp" }, [
            _c("div", { staticClass: "carousel-slider-iframe" }, [
              _c("iframe", {
                attrs: {
                  width: "1280",
                  height: "720",
                  src: "https://www.youtube.com/embed/ImJB946azy0",
                  frameborder: "0",
                  allowfullscreen: ""
                }
              })
            ]),
            _vm._v(" "),
            _c("h2", { staticClass: "cs-card-title" }, [
              _vm._v("Posts Carousel")
            ]),
            _vm._v(" "),
            _c("p", { staticClass: "cs-card-description" })
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "cs-column cs-column-3" }, [
          _c("div", { staticClass: "cs-card cs-shadow--4dp" }, [
            _c("div", { staticClass: "carousel-slider-iframe" }, [
              _c("iframe", {
                attrs: {
                  width: "1280",
                  height: "720",
                  src: "https://www.youtube.com/embed/yiAkvXyfakg",
                  frameborder: "0",
                  allowfullscreen: ""
                }
              })
            ]),
            _vm._v(" "),
            _c("h2", { staticClass: "cs-card-title" }, [
              _vm._v("WooCommerce Products Carousel")
            ]),
            _vm._v(" "),
            _c("p", { staticClass: "cs-card-description" })
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "cs-column cs-column-3" }, [
          _c("div", { staticClass: "cs-card cs-shadow--4dp" }, [
            _c("div", { staticClass: "carousel-slider-iframe" }, [
              _c("iframe", {
                attrs: {
                  width: "1280",
                  height: "720",
                  src: "https://www.youtube.com/embed/kYgp6wp27lM",
                  frameborder: "0",
                  allowfullscreen: ""
                }
              })
            ]),
            _vm._v(" "),
            _c("h2", { staticClass: "cs-card-title" }, [
              _vm._v("In Widget Areas")
            ]),
            _vm._v(" "),
            _c("p", { staticClass: "cs-card-description" })
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "cs-column cs-column-3" }, [
          _c("div", { staticClass: "cs-card cs-shadow--4dp" }, [
            _c("div", { staticClass: "carousel-slider-iframe" }, [
              _c("iframe", {
                attrs: {
                  width: "1280",
                  height: "720",
                  src: "https://www.youtube.com/embed/-OaYQZfr1RM",
                  frameborder: "0",
                  allowfullscreen: ""
                }
              })
            ]),
            _vm._v(" "),
            _c("h2", { staticClass: "cs-card-title" }, [
              _vm._v("With Page Builder by SiteOrigin")
            ]),
            _vm._v(" "),
            _c("p", { staticClass: "cs-card-description" })
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "cs-column cs-column-3" }, [
          _c("div", { staticClass: "cs-card cs-shadow--4dp" }, [
            _c("div", { staticClass: "carousel-slider-iframe" }, [
              _c("iframe", {
                attrs: {
                  width: "1280",
                  height: "720",
                  src: "https://www.youtube.com/embed/4LhDXH81whk",
                  frameborder: "0",
                  allowfullscreen: ""
                }
              })
            ]),
            _vm._v(" "),
            _c("h2", { staticClass: "cs-card-title" }, [
              _vm._v("With WPBakery Visual Composer")
            ]),
            _vm._v(" "),
            _c("p", { staticClass: "cs-card-description" })
          ])
        ])
      ])
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-cbacd8e0", esExports)
  }
}

/***/ }),
/* 80 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Slider_vue__ = __webpack_require__(23);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_07801d0a_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Slider_vue__ = __webpack_require__(135);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(81)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Slider_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_07801d0a_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Slider_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/admin/views/Slider.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-07801d0a", Component.options)
  } else {
    hotAPI.reload("data-v-07801d0a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 81 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 82 */,
/* 83 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Accordion_vue__ = __webpack_require__(25);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_596c37a8_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Accordion_vue__ = __webpack_require__(85);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(84)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Accordion_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_596c37a8_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Accordion_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/admin/components/Accordion.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-596c37a8", Component.options)
  } else {
    hotAPI.reload("data-v-596c37a8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 84 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 85 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "carousel-slider-accordion",
      class: { "is-opened": _vm.isActive }
    },
    [
      _c(
        "div",
        {
          staticClass: "carousel-slider-accordion__heading",
          class: { "is-heading-opened": _vm.isActive },
          on: {
            click: function($event) {
              _vm.isActive = !_vm.isActive
            }
          }
        },
        [
          _c("span", { staticClass: "carousel-slider-accordion__title" }, [
            _vm._v(_vm._s(_vm.title))
          ]),
          _vm._v(" "),
          _c("span", { staticClass: "carousel-slider-accordion__icon" }, [
            _c(
              "svg",
              {
                staticClass: "carousel-slider-accordion__arrow",
                attrs: {
                  width: "24px",
                  height: "24px",
                  viewBox: "0 0 24 24",
                  xmlns: "http://www.w3.org/2000/svg",
                  focusable: "false"
                }
              },
              [
                _c("g", [
                  _c("path", { attrs: { fill: "none", d: "M0,0h24v24H0V0z" } })
                ]),
                _vm._v(" "),
                _vm.isActive
                  ? _c("g", [
                      _c("path", {
                        attrs: {
                          d:
                            "M12,8l-6,6l1.41,1.41L12,10.83l4.59,4.58L18,14L12,8z"
                        }
                      })
                    ])
                  : _c("g", [
                      _c("path", {
                        attrs: {
                          d:
                            "M7.41,8.59L12,13.17l4.59-4.58L18,10l-6,6l-6-6L7.41,8.59z"
                        }
                      })
                    ])
              ]
            )
          ])
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "carousel-slider-accordion__panel",
          class: { "is-panel-opened": _vm.isActive }
        },
        [_vm._t("default")],
        2
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-596c37a8", esExports)
  }
}

/***/ }),
/* 86 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_ImageCarousel_vue__ = __webpack_require__(26);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6370a79e_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_ImageCarousel_vue__ = __webpack_require__(88);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(87)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_ImageCarousel_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6370a79e_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_ImageCarousel_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/admin/components/sliders/ImageCarousel.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6370a79e", Component.options)
  } else {
    hotAPI.reload("data-v-6370a79e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 87 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 88 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { class: _vm.outer_classes }, [
    _c(
      "div",
      {
        class: _vm.slider_classes,
        attrs: {
          id: _vm.slider_id,
          "data-carousel_slider": "true",
          "data-slide-type": _vm.options.type
        }
      },
      _vm._l(_vm.options.images, function(image) {
        return _c("div", { staticClass: "carousel-slider__item" }, [
          _c("img", {
            staticClass: "owl-lazy",
            attrs: {
              src: image.image_src,
              width: image.image_width,
              height: image.image_height,
              alt: image.image_alt
            }
          })
        ])
      }),
      0
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6370a79e", esExports)
  }
}

/***/ }),
/* 89 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_ImageCarouselUrl_vue__ = __webpack_require__(27);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0b2934be_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_ImageCarouselUrl_vue__ = __webpack_require__(91);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(90)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_ImageCarouselUrl_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0b2934be_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_ImageCarouselUrl_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/admin/components/sliders/ImageCarouselUrl.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0b2934be", Component.options)
  } else {
    hotAPI.reload("data-v-0b2934be", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 90 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 91 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { class: _vm.outer_classes }, [
    _c(
      "div",
      {
        class: _vm.slider_classes,
        attrs: {
          id: _vm.slider_id,
          "data-carousel_slider": "true",
          "data-slide-type": _vm.options.type
        }
      },
      _vm._l(_vm.options.images_urls, function(image) {
        return _c("div", { staticClass: "carousel-slider__item" }, [
          _c("img", {
            staticClass: "owl-lazy",
            attrs: { src: image.url, alt: image.alt }
          })
        ])
      }),
      0
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-0b2934be", esExports)
  }
}

/***/ }),
/* 92 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_VideoCarousel_vue__ = __webpack_require__(28);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_de833a84_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_VideoCarousel_vue__ = __webpack_require__(94);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(93)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_VideoCarousel_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_de833a84_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_VideoCarousel_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/admin/components/sliders/VideoCarousel.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-de833a84", Component.options)
  } else {
    hotAPI.reload("data-v-de833a84", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 93 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 94 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { class: _vm.outer_classes }, [
    _c(
      "div",
      {
        class: _vm.slider_classes,
        attrs: {
          id: _vm.slider_id,
          "data-carousel_slider": "true",
          "data-slide-type": _vm.options.type
        }
      },
      _vm._l(_vm.options.videos, function(video) {
        return _c("div", { staticClass: "carousel-slider-item-video" }, [
          _c("div", { staticClass: "carousel-slider-video-wrapper" }, [
            _c(
              "a",
              { staticClass: "magnific-popup", attrs: { href: video.url } },
              [
                _c("div", { staticClass: "carousel-slider-video-play-icon" }),
                _vm._v(" "),
                _c("div", { staticClass: "carousel-slider-video-overlay" }),
                _vm._v(" "),
                _c("img", {
                  staticClass: "owl-lazy",
                  attrs: { src: video.thumbnail.large }
                })
              ]
            )
          ])
        ])
      }),
      0
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-de833a84", esExports)
  }
}

/***/ }),
/* 95 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_HeroCarousel_vue__ = __webpack_require__(29);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_e5862df2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_HeroCarousel_vue__ = __webpack_require__(97);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(96)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_HeroCarousel_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_e5862df2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_HeroCarousel_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/admin/components/sliders/HeroCarousel.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e5862df2", Component.options)
  } else {
    hotAPI.reload("data-v-e5862df2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 96 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 97 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { class: _vm.outer_classes }, [
    _c(
      "div",
      {
        class: _vm.slider_classes,
        attrs: {
          id: _vm.slider_id,
          "data-carousel_slider": "true",
          "data-slide-type": _vm.options.type
        }
      },
      [
        _vm._l(_vm.options.content, function(data) {
          return [
            _c("div", { staticClass: "carousel-slider-hero__cell" }, [
              _c("div", {
                class: _vm.cell_background_classes(data),
                style: _vm.cell_background_styles(data)
              }),
              _vm._v(" "),
              _c("div", { class: _vm.cell_inner_classes(data) }, [
                _c("div", {
                  staticClass: "carousel-slider-hero__cell__background_overlay",
                  style: _vm.cell_background_overlay(data)
                }),
                _vm._v(" "),
                _c(
                  "div",
                  {
                    staticClass:
                      "carousel-slider-hero__cell__content cell_content"
                  },
                  [
                    _c("div", {
                      staticClass: "carousel-slider-hero__cell__heading",
                      domProps: { innerHTML: _vm._s(data.heading.text) }
                    }),
                    _vm._v(" "),
                    _c("div", {
                      staticClass: "carousel-slider-hero__cell__description",
                      domProps: { innerHTML: _vm._s(data.description.text) }
                    }),
                    _vm._v(" "),
                    "button" === data.link_type
                      ? _c(
                          "div",
                          {
                            staticClass: "carousel-slider-hero__cell__buttons"
                          },
                          [
                            data.button_one.url
                              ? _c(
                                  "span",
                                  {
                                    staticClass:
                                      "carousel-slider-hero__cell__button__one"
                                  },
                                  [
                                    _c(
                                      "a",
                                      {
                                        class: _vm.button_one_classes(
                                          data.button_one
                                        ),
                                        style: _vm.button_one_styles(
                                          data.button_one
                                        ),
                                        attrs: {
                                          href: data.button_one.url,
                                          target: data.button_one.target
                                        }
                                      },
                                      [_vm._v(_vm._s(data.button_one.text))]
                                    )
                                  ]
                                )
                              : _vm._e()
                          ]
                        )
                      : _vm._e()
                  ]
                )
              ])
            ])
          ]
        })
      ],
      2
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-e5862df2", esExports)
  }
}

/***/ }),
/* 98 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_AccordionRepeater_vue__ = __webpack_require__(30);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_bc349160_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_AccordionRepeater_vue__ = __webpack_require__(100);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(99)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_AccordionRepeater_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_bc349160_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_AccordionRepeater_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/admin/components/AccordionRepeater.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-bc349160", Component.options)
  } else {
    hotAPI.reload("data-v-bc349160", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 99 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 100 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "carousel-slider-toggle",
      class: { "is-opened": _vm.isActive }
    },
    [
      _c("div", { staticClass: "carousel-slider-toggle__heading" }, [
        _c(
          "span",
          {
            staticClass: "carousel-slider-toggle__title",
            on: {
              click: function($event) {
                _vm.isActive = !_vm.isActive
              }
            }
          },
          [_vm._v(_vm._s(_vm.title))]
        ),
        _vm._v(" "),
        _c("span", { staticClass: "carousel-slider-toggle__icons" }, [
          _c(
            "span",
            {
              staticClass: "carousel-slider-toggle__icons-copy",
              on: { click: _vm.clickCopy }
            },
            [
              _c(
                "svg",
                {
                  attrs: {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "24",
                    height: "24",
                    viewBox: "0 0 24 24"
                  }
                },
                [
                  _c("path", { attrs: { fill: "none", d: "M0 0h24v24H0V0z" } }),
                  _vm._v(" "),
                  _c("path", {
                    attrs: {
                      d:
                        "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V11l-6-6zM8 21V7h6v5h5v9H8z"
                    }
                  })
                ]
              )
            ]
          ),
          _vm._v(" "),
          _c(
            "span",
            {
              staticClass: "carousel-slider-toggle__icons-clear",
              on: { click: _vm.clickClear }
            },
            [
              _c(
                "svg",
                {
                  attrs: {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "24",
                    height: "24",
                    viewBox: "0 0 24 24"
                  }
                },
                [
                  _c("path", { attrs: { fill: "none", d: "M0 0h24v24H0V0z" } }),
                  _vm._v(" "),
                  _c("path", {
                    attrs: {
                      d:
                        "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                    }
                  })
                ]
              )
            ]
          )
        ])
      ]),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "carousel-slider-toggle__panel",
          class: { "is-panel-opened": _vm.isActive }
        },
        [_vm._t("default")],
        2
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-bc349160", esExports)
  }
}

/***/ }),
/* 101 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 102 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("input", {
      attrs: { type: "text", "data-alpha": _vm.alpha },
      domProps: { value: _vm.value }
    })
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-cbcbfcea", esExports)
  }
}

/***/ }),
/* 103 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_MediaUploader_vue__ = __webpack_require__(32);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_48d72da8_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_MediaUploader_vue__ = __webpack_require__(105);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(104)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_MediaUploader_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_48d72da8_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_MediaUploader_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/admin/components/fields/MediaUploader.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-48d72da8", Component.options)
  } else {
    hotAPI.reload("data-v-48d72da8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 104 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 105 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "media-gallery-container" }, [
    _c(
      "div",
      { staticClass: "media-gallery-status-status" },
      [
        _vm.has_image
          ? [
              _c("span", { staticClass: "media-gallery-status-title" }, [
                _vm._v(_vm._s(_vm.count_images) + " Images Selected")
              ]),
              _vm._v(" "),
              _c(
                "span",
                {
                  staticClass: "media-gallery-clear",
                  on: { click: _vm.clearImages }
                },
                [_vm._v("(Clear)")]
              )
            ]
          : _vm._e(),
        _vm._v(" "),
        !_vm.has_image
          ? [
              _c("span", { staticClass: "media-gallery-status-title" }, [
                _vm._v("No Images Selected")
              ])
            ]
          : _vm._e()
      ],
      2
    ),
    _vm._v(" "),
    _c(
      "div",
      {
        staticClass: "media-gallery-preview",
        class: { "has-items": _vm.has_image }
      },
      [
        _c(
          "div",
          { staticClass: "media-gallery-list" },
          _vm._l(_vm.thumbnails, function(image) {
            return _c("div", { staticClass: "media-gallery-list--item" }, [
              _c("img", {
                staticClass: "media-gallery-list--item-image",
                attrs: { src: image, alt: "" }
              })
            ])
          }),
          0
        )
      ]
    ),
    _vm._v(" "),
    _c("div", { staticClass: "media-gallery-button" }, [
      _c(
        "button",
        {
          staticClass:
            "mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised mdl-media-button"
        },
        [_vm._v("\n\t\t\t" + _vm._s(_vm.buttonText) + "\n\t\t")]
      )
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-48d72da8", esExports)
  }
}

/***/ }),
/* 106 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Background_vue__ = __webpack_require__(33);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_97a59a38_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Background_vue__ = __webpack_require__(111);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(107)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Background_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_97a59a38_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Background_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/admin/components/fields/Background.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-97a59a38", Component.options)
  } else {
    hotAPI.reload("data-v-97a59a38", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 107 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 108 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_BackgroundImage_vue__ = __webpack_require__(34);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ca99b4f2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_BackgroundImage_vue__ = __webpack_require__(110);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(109)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_BackgroundImage_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ca99b4f2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_BackgroundImage_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/admin/components/fields/BackgroundImage.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ca99b4f2", Component.options)
  } else {
    hotAPI.reload("data-v-ca99b4f2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 109 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 110 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "carousel-slider-control-background-image" },
    [
      _c(
        "div",
        { staticClass: "carousel-slider-control-background-image--view" },
        [
          _vm.has_image
            ? _c(
                "div",
                {
                  staticClass:
                    "carousel-slider-control-background-image--thumbnail"
                },
                [_c("img", { attrs: { src: _vm.value.src, alt: "" } })]
              )
            : _vm._e(),
          _vm._v(" "),
          !_vm.has_image
            ? _c(
                "div",
                {
                  staticClass:
                    "carousel-slider-control-background-image--placeholder"
                },
                [_vm._v(_vm._s(_vm.placeholderText) + "\n\t\t")]
              )
            : _vm._e(),
          _vm._v(" "),
          _c(
            "div",
            {
              staticClass: "carousel-slider-control-background-image--actions"
            },
            [
              _vm.has_image
                ? _c(
                    "button",
                    { staticClass: "button", on: { click: _vm.clearImages } },
                    [_vm._v(_vm._s(_vm.removeButtonText))]
                  )
                : _vm._e(),
              _vm._v(" "),
              !_vm.has_image
                ? _c(
                    "button",
                    {
                      staticClass: "button",
                      on: { click: _vm.openMediaModal }
                    },
                    [_vm._v(_vm._s(_vm.buttonText))]
                  )
                : _vm._e()
            ]
          )
        ]
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-ca99b4f2", esExports)
  }
}

/***/ }),
/* 111 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "carousel-slider-control-background" },
    [
      _c(
        "div",
        { staticClass: "background-color" },
        [
          _c("h4", [_vm._v("Background Color")]),
          _vm._v(" "),
          _c("color-picker", {
            model: {
              value: _vm.value.color,
              callback: function($$v) {
                _vm.$set(_vm.value, "color", $$v)
              },
              expression: "value.color"
            }
          })
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "background-image" },
        [
          _c("h4", [_vm._v("Background Image")]),
          _vm._v(" "),
          _c("background-image", {
            model: {
              value: _vm.value.image,
              callback: function($$v) {
                _vm.$set(_vm.value, "image", $$v)
              },
              expression: "value.image"
            }
          })
        ],
        1
      ),
      _vm._v(" "),
      _vm.has_image
        ? [
            _vm.is_enabled("overlay-color")
              ? _c(
                  "div",
                  { staticClass: "background-color" },
                  [
                    _c("h4", [_vm._v("Background Overlay")]),
                    _vm._v(" "),
                    _c("color-picker", {
                      model: {
                        value: _vm.value.overlay_color,
                        callback: function($$v) {
                          _vm.$set(_vm.value, "overlay_color", $$v)
                        },
                        expression: "value.overlay_color"
                      }
                    })
                  ],
                  1
                )
              : _vm._e(),
            _vm._v(" "),
            _vm.is_enabled("repeat")
              ? _c("div", { staticClass: "background-repeat" }, [
                  _c("h4", [_vm._v("Background Repeat")]),
                  _vm._v(" "),
                  _c(
                    "select",
                    {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.value.repeat,
                          expression: "value.repeat"
                        }
                      ],
                      staticClass: "widefat",
                      on: {
                        change: function($event) {
                          var $$selectedVal = Array.prototype.filter
                            .call($event.target.options, function(o) {
                              return o.selected
                            })
                            .map(function(o) {
                              var val = "_value" in o ? o._value : o.value
                              return val
                            })
                          _vm.$set(
                            _vm.value,
                            "repeat",
                            $event.target.multiple
                              ? $$selectedVal
                              : $$selectedVal[0]
                          )
                        }
                      }
                    },
                    _vm._l(_vm.background_repeat, function(_repeat) {
                      return _c("option", {
                        domProps: {
                          value: _repeat.value,
                          innerHTML: _vm._s(_repeat.label)
                        }
                      })
                    }),
                    0
                  )
                ])
              : _vm._e(),
            _vm._v(" "),
            _vm.is_enabled("position")
              ? _c("div", { staticClass: "background-position" }, [
                  _c("h4", [_vm._v("Background Position")]),
                  _vm._v(" "),
                  _c(
                    "select",
                    {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.value.position,
                          expression: "value.position"
                        }
                      ],
                      staticClass: "widefat",
                      on: {
                        change: function($event) {
                          var $$selectedVal = Array.prototype.filter
                            .call($event.target.options, function(o) {
                              return o.selected
                            })
                            .map(function(o) {
                              var val = "_value" in o ? o._value : o.value
                              return val
                            })
                          _vm.$set(
                            _vm.value,
                            "position",
                            $event.target.multiple
                              ? $$selectedVal
                              : $$selectedVal[0]
                          )
                        }
                      }
                    },
                    _vm._l(_vm.background_position, function(_position) {
                      return _c("option", {
                        domProps: {
                          value: _position.value,
                          innerHTML: _vm._s(_position.label)
                        }
                      })
                    }),
                    0
                  )
                ])
              : _vm._e(),
            _vm._v(" "),
            _vm.is_enabled("size")
              ? _c("div", { staticClass: "background-size" }, [
                  _c("h4", [_vm._v("Background Size")]),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "buttonset" },
                    [
                      _vm._l(_vm.background_size, function(_size) {
                        return [
                          _c("input", {
                            directives: [
                              {
                                name: "model",
                                rawName: "v-model",
                                value: _vm.value.size,
                                expression: "value.size"
                              }
                            ],
                            staticClass: "switch-input screen-reader-text",
                            attrs: {
                              type: "radio",
                              id: _vm.get_size_id(_size.value)
                            },
                            domProps: {
                              value: _size.value,
                              checked: _vm._q(_vm.value.size, _size.value)
                            },
                            on: {
                              change: function($event) {
                                _vm.$set(_vm.value, "size", _size.value)
                              }
                            }
                          }),
                          _vm._v(" "),
                          _c("label", {
                            staticClass: "switch-label switch-label-off",
                            attrs: { for: _vm.get_size_id(_size.value) },
                            domProps: { innerHTML: _vm._s(_size.label) }
                          })
                        ]
                      })
                    ],
                    2
                  )
                ])
              : _vm._e(),
            _vm._v(" "),
            _vm.is_enabled("attachment")
              ? _c("div", { staticClass: "background-attachment" }, [
                  _c("h4", [_vm._v("Background Attachment")]),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "buttonset" },
                    [
                      _vm._l(_vm.background_attachment, function(_attachment) {
                        return [
                          _c("input", {
                            directives: [
                              {
                                name: "model",
                                rawName: "v-model",
                                value: _vm.value.attachment,
                                expression: "value.attachment"
                              }
                            ],
                            staticClass: "switch-input screen-reader-text",
                            attrs: {
                              type: "radio",
                              id: _vm.get_attachment_id(_attachment.value)
                            },
                            domProps: {
                              value: _attachment.value,
                              checked: _vm._q(
                                _vm.value.attachment,
                                _attachment.value
                              )
                            },
                            on: {
                              change: function($event) {
                                _vm.$set(
                                  _vm.value,
                                  "attachment",
                                  _attachment.value
                                )
                              }
                            }
                          }),
                          _vm._v(" "),
                          _c("label", {
                            staticClass: "switch-label switch-label-on",
                            attrs: {
                              for: _vm.get_attachment_id(_attachment.value)
                            },
                            domProps: { innerHTML: _vm._s(_attachment.label) }
                          })
                        ]
                      })
                    ],
                    2
                  )
                ])
              : _vm._e(),
            _vm._v(" "),
            _vm.is_enabled("effect")
              ? _c("div", { staticClass: "background-effect" }, [
                  _c("h4", [_vm._v("Ken Burns Effect")]),
                  _vm._v(" "),
                  _c(
                    "select",
                    {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.value.effect,
                          expression: "value.effect"
                        }
                      ],
                      staticClass: "widefat",
                      on: {
                        change: function($event) {
                          var $$selectedVal = Array.prototype.filter
                            .call($event.target.options, function(o) {
                              return o.selected
                            })
                            .map(function(o) {
                              var val = "_value" in o ? o._value : o.value
                              return val
                            })
                          _vm.$set(
                            _vm.value,
                            "effect",
                            $event.target.multiple
                              ? $$selectedVal
                              : $$selectedVal[0]
                          )
                        }
                      }
                    },
                    [
                      _c("option", { attrs: { value: "" } }, [_vm._v("None")]),
                      _vm._v(" "),
                      _c("option", { attrs: { value: "zoom-in" } }, [
                        _vm._v("Zoom In")
                      ]),
                      _vm._v(" "),
                      _c("option", { attrs: { value: "zoom-out" } }, [
                        _vm._v("Zoom Out")
                      ])
                    ]
                  )
                ])
              : _vm._e()
          ]
        : _vm._e()
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-97a59a38", esExports)
  }
}

/***/ }),
/* 112 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_RichText_vue__ = __webpack_require__(35);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7f4e2bdf_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_RichText_vue__ = __webpack_require__(114);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(113)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_RichText_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7f4e2bdf_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_RichText_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/admin/components/fields/RichText.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7f4e2bdf", Component.options)
  } else {
    hotAPI.reload("data-v-7f4e2bdf", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 113 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 114 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "carousel-slider-control-rich-text" }, [
    _vm.is_enabled("text")
      ? _c("div", { staticClass: "carousel-slider-control-rich-text--input" }, [
          _c("h5", [_vm._v("Text")]),
          _vm._v(" "),
          _c("textarea", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.value.text,
                expression: "value.text"
              }
            ],
            attrs: { rows: "3" },
            domProps: { value: _vm.value.text },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.value, "text", $event.target.value)
              }
            }
          })
        ])
      : _vm._e(),
    _vm._v(" "),
    _vm.is_enabled("font-family")
      ? _c(
          "div",
          { staticClass: "carousel-slider-control-rich-text--font-family" },
          [_c("h5", [_vm._v("Font Family")]), _vm._v(" "), _vm._m(0)]
        )
      : _vm._e(),
    _vm._v(" "),
    _vm.is_enabled("font-weight")
      ? _c(
          "div",
          { staticClass: "carousel-slider-control-rich-text--variant" },
          [_c("h5", [_vm._v("Variant")]), _vm._v(" "), _vm._m(1)]
        )
      : _vm._e(),
    _vm._v(" "),
    _vm.is_enabled("font-size")
      ? _c(
          "div",
          { staticClass: "carousel-slider-control-rich-text--font-size" },
          [
            _c("h5", [_vm._v("Font Size")]),
            _vm._v(" "),
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.value.font_size,
                  expression: "value.font_size"
                }
              ],
              attrs: { type: "text" },
              domProps: { value: _vm.value.font_size },
              on: {
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.$set(_vm.value, "font_size", $event.target.value)
                }
              }
            })
          ]
        )
      : _vm._e(),
    _vm._v(" "),
    _vm.is_enabled("line-height")
      ? _c(
          "div",
          { staticClass: "carousel-slider-control-rich-text--line-height" },
          [
            _c("h5", [_vm._v("Line Height")]),
            _vm._v(" "),
            _c("input", { attrs: { type: "text", value: "" } })
          ]
        )
      : _vm._e(),
    _vm._v(" "),
    _vm.is_enabled("letter-spacing")
      ? _c(
          "div",
          { staticClass: "carousel-slider-control-rich-text--letter-spacing" },
          [
            _c("h5", [_vm._v("Letter Spacing")]),
            _vm._v(" "),
            _c("input", { attrs: { type: "text", value: "" } })
          ]
        )
      : _vm._e(),
    _vm._v(" "),
    _vm.is_enabled("word-spacing")
      ? _c(
          "div",
          { staticClass: "carousel-slider-control-rich-text--word-spacing" },
          [
            _c("h5", [_vm._v("Word Spacing")]),
            _vm._v(" "),
            _c("input", { attrs: { type: "text", value: "" } })
          ]
        )
      : _vm._e(),
    _vm._v(" "),
    _vm.is_enabled("text-align")
      ? _c(
          "div",
          { staticClass: "carousel-slider-control-rich-text--text-align" },
          [_c("h5", [_vm._v("Text Align")]), _vm._v(" "), _vm._m(2)]
        )
      : _vm._e(),
    _vm._v(" "),
    _vm.is_enabled("text-transform")
      ? _c(
          "div",
          { staticClass: "carousel-slider-control-rich-text--text-transform" },
          [
            _c("h5", [_vm._v("Text Transform")]),
            _vm._v(" "),
            _c(
              "select",
              {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.value.text_transform,
                    expression: "value.text_transform"
                  }
                ],
                on: {
                  change: function($event) {
                    var $$selectedVal = Array.prototype.filter
                      .call($event.target.options, function(o) {
                        return o.selected
                      })
                      .map(function(o) {
                        var val = "_value" in o ? o._value : o.value
                        return val
                      })
                    _vm.$set(
                      _vm.value,
                      "text_transform",
                      $event.target.multiple ? $$selectedVal : $$selectedVal[0]
                    )
                  }
                }
              },
              [
                _c("option", { attrs: { value: "none" } }, [_vm._v("None")]),
                _vm._v(" "),
                _c("option", { attrs: { value: "capitalize" } }, [
                  _vm._v("Capitalize")
                ]),
                _vm._v(" "),
                _c("option", { attrs: { value: "uppercase" } }, [
                  _vm._v("Uppercase")
                ]),
                _vm._v(" "),
                _c("option", { attrs: { value: "lowercase" } }, [
                  _vm._v("Lowercase")
                ]),
                _vm._v(" "),
                _c("option", { attrs: { value: "initial" } }, [
                  _vm._v("Initial")
                ]),
                _vm._v(" "),
                _c("option", { attrs: { value: "inherit" } }, [
                  _vm._v("Inherit")
                ])
              ]
            )
          ]
        )
      : _vm._e(),
    _vm._v(" "),
    _vm.is_enabled("text-decoration")
      ? _c(
          "div",
          { staticClass: "carousel-slider-control-rich-text--text-decoration" },
          [
            _c("h5", [_vm._v("Text Decoration")]),
            _vm._v(" "),
            _c(
              "select",
              {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.value.text_decoration,
                    expression: "value.text_decoration"
                  }
                ],
                on: {
                  change: function($event) {
                    var $$selectedVal = Array.prototype.filter
                      .call($event.target.options, function(o) {
                        return o.selected
                      })
                      .map(function(o) {
                        var val = "_value" in o ? o._value : o.value
                        return val
                      })
                    _vm.$set(
                      _vm.value,
                      "text_decoration",
                      $event.target.multiple ? $$selectedVal : $$selectedVal[0]
                    )
                  }
                }
              },
              [
                _c("option", { attrs: { value: "none" } }, [_vm._v("None")]),
                _vm._v(" "),
                _c("option", { attrs: { value: "underline" } }, [
                  _vm._v("Underline")
                ]),
                _vm._v(" "),
                _c("option", { attrs: { value: "overline" } }, [
                  _vm._v("Overline")
                ]),
                _vm._v(" "),
                _c("option", { attrs: { value: "line-through" } }, [
                  _vm._v("Line-Through")
                ]),
                _vm._v(" "),
                _c("option", { attrs: { value: "initial" } }, [
                  _vm._v("Initial")
                ]),
                _vm._v(" "),
                _c("option", { attrs: { value: "inherit" } }, [
                  _vm._v("Inherit")
                ])
              ]
            )
          ]
        )
      : _vm._e(),
    _vm._v(" "),
    _vm.is_enabled("margin-top")
      ? _c(
          "div",
          { staticClass: "carousel-slider-control-rich-text--margin-top" },
          [
            _c("h5", [_vm._v("Margin Top")]),
            _vm._v(" "),
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.value.margin_top,
                  expression: "value.margin_top"
                }
              ],
              attrs: { type: "text" },
              domProps: { value: _vm.value.margin_top },
              on: {
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.$set(_vm.value, "margin_top", $event.target.value)
                }
              }
            })
          ]
        )
      : _vm._e(),
    _vm._v(" "),
    _vm.is_enabled("margin-bottom")
      ? _c(
          "div",
          { staticClass: "carousel-slider-control-rich-text--margin-bottom" },
          [
            _c("h5", [_vm._v("Margin Bottom")]),
            _vm._v(" "),
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.value.margin_bottom,
                  expression: "value.margin_bottom"
                }
              ],
              attrs: { type: "text" },
              domProps: { value: _vm.value.margin_bottom },
              on: {
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.$set(_vm.value, "margin_bottom", $event.target.value)
                }
              }
            })
          ]
        )
      : _vm._e(),
    _vm._v(" "),
    _vm.is_enabled("color")
      ? _c(
          "div",
          { staticClass: "carousel-slider-control-rich-text--color" },
          [
            _c("h5", [_vm._v("Color")]),
            _vm._v(" "),
            _c("color-picker", {
              model: {
                value: _vm.value.color,
                callback: function($$v) {
                  _vm.$set(_vm.value, "color", $$v)
                },
                expression: "value.color"
              }
            })
          ],
          1
        )
      : _vm._e()
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "select",
      {
        staticClass: "widefat",
        attrs: { id: "shapla-typography-font-family" }
      },
      [_c("option", { attrs: { value: "default" } }, [_vm._v("Default")])]
    )
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "select",
      { staticClass: "widefat", attrs: { id: "shapla-typography-variant" } },
      [_c("option", { attrs: { value: "default" } }, [_vm._v("Default")])]
    )
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "text-align-choices" }, [
      _c("input", {
        attrs: {
          type: "radio",
          value: "inherit",
          name: "_customize-typography-text-align-radio-",
          id: "-text-align-inherit"
        }
      }),
      _vm._v(" "),
      _c("label", { attrs: { for: "-text-align-inherit" } }, [
        _c("span", {
          staticClass: "dashicons dashicons-editor-removeformatting"
        }),
        _vm._v(" "),
        _c("span", { staticClass: "screen-reader-text" }, [_vm._v("Inherit")])
      ]),
      _vm._v(" "),
      _c("input", {
        attrs: {
          type: "radio",
          value: "left",
          name: "_customize-typography-text-align-radio-",
          id: "-text-align-left"
        }
      }),
      _vm._v(" "),
      _c("label", { attrs: { for: "-text-align-left" } }, [
        _c("span", { staticClass: "dashicons dashicons-editor-alignleft" }),
        _vm._v(" "),
        _c("span", { staticClass: "screen-reader-text" }, [_vm._v("Left")])
      ]),
      _vm._v(" "),
      _c("input", {
        attrs: {
          type: "radio",
          value: "center",
          name: "_customize-typography-text-align-radio-",
          id: "-text-align-center"
        }
      }),
      _vm._v(" "),
      _c("label", { attrs: { for: "-text-align-center" } }, [
        _c("span", { staticClass: "dashicons dashicons-editor-aligncenter" }),
        _vm._v(" "),
        _c("span", { staticClass: "screen-reader-text" }, [_vm._v("Center")])
      ]),
      _vm._v(" "),
      _c("input", {
        attrs: {
          type: "radio",
          value: "right",
          name: "_customize-typography-text-align-radio-",
          id: "-text-align-right"
        }
      }),
      _vm._v(" "),
      _c("label", { attrs: { for: "-text-align-right" } }, [
        _c("span", { staticClass: "dashicons dashicons-editor-alignright" }),
        _vm._v(" "),
        _c("span", { staticClass: "screen-reader-text" }, [_vm._v("Right")])
      ]),
      _vm._v(" "),
      _c("input", {
        attrs: {
          type: "radio",
          value: "justify",
          name: "_customize-typography-text-align-radio-",
          id: "-text-align-justify"
        }
      }),
      _vm._v(" "),
      _c("label", { attrs: { for: "-text-align-justify" } }, [
        _c("span", { staticClass: "dashicons dashicons-editor-justify" }),
        _vm._v(" "),
        _c("span", { staticClass: "screen-reader-text" }, [_vm._v("Justify")])
      ])
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-7f4e2bdf", esExports)
  }
}

/***/ }),
/* 115 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_ButtonGenerator_vue__ = __webpack_require__(36);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_d110b30a_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_ButtonGenerator_vue__ = __webpack_require__(119);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(116)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-d110b30a"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_ButtonGenerator_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_d110b30a_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_ButtonGenerator_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/admin/components/fields/ButtonGenerator.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d110b30a", Component.options)
  } else {
    hotAPI.reload("data-v-d110b30a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 116 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 117 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 118 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "label",
    {
      staticClass: "mdl-radio-button mdl-js-radio-button mdl-js-ripple-effect",
      class: _vm.getClasses
    },
    [
      _c("input", {
        staticClass: "mdl-radio-button__input",
        attrs: { type: "radio" },
        domProps: { checked: _vm.shouldBeChecked, value: _vm.value },
        on: { change: _vm.updateInput }
      }),
      _vm._v(" "),
      _c(
        "span",
        { staticClass: "mdl-radio-button__label" },
        [_vm._t("default", [_vm._v(_vm._s(_vm.label))])],
        2
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6db9daa4", esExports)
  }
}

/***/ }),
/* 119 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "carousel-slider-control-button-generator" },
    [
      _c(
        "div",
        { staticClass: "carousel-slider-control-button-generator--text" },
        [
          _c("h4", [_vm._v("Button Text")]),
          _vm._v(" "),
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.value.text,
                expression: "value.text"
              }
            ],
            attrs: { type: "text" },
            domProps: { value: _vm.value.text },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.value, "text", $event.target.value)
              }
            }
          })
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "carousel-slider-control-button-generator--url" },
        [
          _c("h4", [_vm._v("Button Link")]),
          _vm._v(" "),
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.value.url,
                expression: "value.url"
              }
            ],
            attrs: { type: "url" },
            domProps: { value: _vm.value.url },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.value, "url", $event.target.value)
              }
            }
          })
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "carousel-slider-control-button-generator--target" },
        [
          _c("h4", [_vm._v("Button Link Target")]),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "mdl-radio-button-container" },
            [
              _c(
                "radio-button",
                {
                  attrs: { value: "_self" },
                  model: {
                    value: _vm.value.target,
                    callback: function($$v) {
                      _vm.$set(_vm.value, "target", $$v)
                    },
                    expression: "value.target"
                  }
                },
                [_vm._v("Save Window")]
              ),
              _vm._v(" "),
              _c(
                "radio-button",
                {
                  attrs: { value: "_blank" },
                  model: {
                    value: _vm.value.target,
                    callback: function($$v) {
                      _vm.$set(_vm.value, "target", $$v)
                    },
                    expression: "value.target"
                  }
                },
                [_vm._v("New Window")]
              )
            ],
            1
          )
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "carousel-slider-control-button-generator--type" },
        [
          _c("h4", [_vm._v("Button Type")]),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "mdl-radio-button-container" },
            [
              _c(
                "radio-button",
                {
                  attrs: { value: "normal" },
                  model: {
                    value: _vm.value.type,
                    callback: function($$v) {
                      _vm.$set(_vm.value, "type", $$v)
                    },
                    expression: "value.type"
                  }
                },
                [_vm._v("Normal")]
              ),
              _vm._v(" "),
              _c(
                "radio-button",
                {
                  attrs: { value: "stroke" },
                  model: {
                    value: _vm.value.type,
                    callback: function($$v) {
                      _vm.$set(_vm.value, "type", $$v)
                    },
                    expression: "value.type"
                  }
                },
                [_vm._v("Stroke")]
              )
            ],
            1
          )
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "carousel-slider-control-button-generator--size" },
        [
          _c("h4", [_vm._v("Button Size")]),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "mdl-radio-button-container" },
            [
              _c(
                "radio-button",
                {
                  attrs: { value: "large" },
                  model: {
                    value: _vm.value.size,
                    callback: function($$v) {
                      _vm.$set(_vm.value, "size", $$v)
                    },
                    expression: "value.size"
                  }
                },
                [_vm._v("Large")]
              ),
              _vm._v(" "),
              _c(
                "radio-button",
                {
                  attrs: { value: "medium" },
                  model: {
                    value: _vm.value.size,
                    callback: function($$v) {
                      _vm.$set(_vm.value, "size", $$v)
                    },
                    expression: "value.size"
                  }
                },
                [_vm._v("Medium")]
              ),
              _vm._v(" "),
              _c(
                "radio-button",
                {
                  attrs: { value: "small" },
                  model: {
                    value: _vm.value.size,
                    callback: function($$v) {
                      _vm.$set(_vm.value, "size", $$v)
                    },
                    expression: "value.size"
                  }
                },
                [_vm._v("Small")]
              )
            ],
            1
          )
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "carousel-slider-control-button-generator--border-width"
        },
        [
          _c("h4", [_vm._v("Border Width")]),
          _vm._v(" "),
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.value.border_width,
                expression: "value.border_width"
              }
            ],
            attrs: { type: "text" },
            domProps: { value: _vm.value.border_width },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.value, "border_width", $event.target.value)
              }
            }
          })
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "carousel-slider-control-button-generator--border-radius"
        },
        [
          _c("h4", [_vm._v("Border Radius")]),
          _vm._v(" "),
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.value.border_radius,
                expression: "value.border_radius"
              }
            ],
            attrs: { type: "text" },
            domProps: { value: _vm.value.border_radius },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.value, "border_radius", $event.target.value)
              }
            }
          })
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass:
            "carousel-slider-control-button-generator--background-color"
        },
        [
          _c("h4", [_vm._v("Background Color")]),
          _vm._v(" "),
          _c("color-picker", {
            model: {
              value: _vm.value.background_color,
              callback: function($$v) {
                _vm.$set(_vm.value, "background_color", $$v)
              },
              expression: "value.background_color"
            }
          })
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "carousel-slider-control-button-generator--color" },
        [
          _c("h4", [_vm._v("Text Color")]),
          _vm._v(" "),
          _c("color-picker", {
            model: {
              value: _vm.value.color,
              callback: function($$v) {
                _vm.$set(_vm.value, "color", $$v)
              },
              expression: "value.color"
            }
          })
        ],
        1
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-d110b30a", esExports)
  }
}

/***/ }),
/* 120 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlSlider_vue__ = __webpack_require__(39);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_28c88a37_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlSlider_vue__ = __webpack_require__(122);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(121)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlSlider_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_28c88a37_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlSlider_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/material-design-lite/slider/mdlSlider.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-28c88a37", Component.options)
  } else {
    hotAPI.reload("data-v-28c88a37", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 121 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 122 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "mdl-slider" }, [
    _c("input", {
      staticClass: "mdl-slider__range",
      attrs: { type: "range", min: _vm.min, max: _vm.max, step: _vm.step },
      domProps: { value: _vm.value },
      on: {
        input: function($event) {
          _vm.triggerInput($event)
        }
      }
    }),
    _vm._v(" "),
    _c(
      "div",
      {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: _vm.showInput,
            expression: "showInput"
          }
        ],
        staticClass: "mdl-slider__input-container"
      },
      [
        _c("input", {
          staticClass: "mdl-slider__input",
          attrs: { type: "number", min: _vm.min, max: _vm.max, step: _vm.step },
          domProps: { value: _vm.value },
          on: {
            input: function($event) {
              _vm.triggerInput($event)
            }
          }
        })
      ]
    ),
    _vm._v(" "),
    _c(
      "div",
      {
        directives: [
          {
            name: "show",
            rawName: "v-show",
            value: _vm.showReset,
            expression: "showReset"
          }
        ],
        staticClass: "mdl-slider__reset",
        attrs: { title: "Reset to default value" },
        on: { click: _vm.resetToDefault }
      },
      [
        _c("mdl-button", { attrs: { type: "icon", color: "primary" } }, [
          _c(
            "svg",
            {
              staticClass: "mdl-slider__reset-icon",
              attrs: {
                xmlns: "http://www.w3.org/2000/svg",
                width: "24",
                height: "24",
                viewBox: "0 0 24 24"
              }
            },
            [
              _c("path", { attrs: { fill: "none", d: "M0 0h24v24H0V0z" } }),
              _vm._v(" "),
              _c("path", {
                attrs: {
                  d:
                    "M14 12c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm-2-9c-4.97 0-9 4.03-9 9H0l4 4 4-4H5c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.51 0-2.91-.49-4.06-1.3l-1.42 1.44C8.04 20.3 9.94 21 12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"
                }
              })
            ]
          )
        ])
      ],
      1
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-28c88a37", esExports)
  }
}

/***/ }),
/* 123 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlSwitch_vue__ = __webpack_require__(40);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6d60981d_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlSwitch_vue__ = __webpack_require__(126);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(124)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlSwitch_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6d60981d_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlSwitch_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/material-design-lite/switch/mdlSwitch.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6d60981d", Component.options)
  } else {
    hotAPI.reload("data-v-6d60981d", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 124 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 125 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MaterialSwitch; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var MaterialSwitch = function () {

	/**
  * Class constructor for Checkbox MDL component.
  * Implements MDL component design pattern defined at:
  * https://github.com/jasonmayes/mdl-component-design-pattern
  *
  * @constructor
  * @param {HTMLElement} element The element that will be upgraded.
  */
	function MaterialSwitch(element) {
		_classCallCheck(this, MaterialSwitch);

		this.element_ = element;

		/**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
		this.Constant_ = {
			TINY_TIMEOUT: 0.001
		};

		/**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
		this.CssClasses_ = {
			INPUT: 'mdl-switch__input',
			TRACK: 'mdl-switch__track',
			THUMB: 'mdl-switch__thumb',
			FOCUS_HELPER: 'mdl-switch__focus-helper',
			RIPPLE_EFFECT: 'mdl-js-ripple-effect',
			RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
			RIPPLE_CONTAINER: 'mdl-switch__ripple-container',
			RIPPLE_CENTER: 'mdl-ripple--center',
			RIPPLE: 'mdl-ripple',
			IS_FOCUSED: 'is-focused',
			IS_DISABLED: 'is-disabled',
			IS_CHECKED: 'is-checked'
		};

		// Initialize instance.
		this.init();
	}

	/**
  * Handle change of state.
  *
  * @param {Event} event The event that fired.
  * @private
  */


	_createClass(MaterialSwitch, [{
		key: 'onChange_',
		value: function onChange_(event) {
			this.updateClasses_();
		}
	}, {
		key: 'onFocus_',


		/**
   * Handle focus of element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
		value: function onFocus_(event) {
			this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
		}
	}, {
		key: 'onBlur_',


		/**
   * Handle lost focus of element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
		value: function onBlur_(event) {
			this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
		}
	}, {
		key: 'onMouseUp_',


		/**
   * Handle mouseup.
   *
   * @param {Event} event The event that fired.
   * @private
   */
		value: function onMouseUp_(event) {
			this.blur_();
		}
	}, {
		key: 'updateClasses_',


		/**
   * Handle class updates.
   *
   * @private
   */
		value: function updateClasses_() {
			this.checkDisabled();
			this.checkToggleState();
		}
	}, {
		key: 'blur_',


		/**
   * Add blur.
   *
   * @private
   */
		value: function blur_() {
			// TODO: figure out why there's a focus event being fired after our blur,
			// so that we can avoid this hack.
			window.setTimeout(function () {
				this.inputElement_.blur();
			}.bind(this), /** @type {number} */this.Constant_.TINY_TIMEOUT);
		}
	}, {
		key: 'checkDisabled',


		// Public methods.

		/**
   * Check the components disabled state.
   *
   * @public
   */
		value: function checkDisabled() {
			if (this.inputElement_.disabled) {
				this.element_.classList.add(this.CssClasses_.IS_DISABLED);
			} else {
				this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
			}
		}
	}, {
		key: 'checkToggleState',


		/**
   * Check the components toggled state.
   *
   * @public
   */
		value: function checkToggleState() {
			if (this.inputElement_.checked) {
				this.element_.classList.add(this.CssClasses_.IS_CHECKED);
			} else {
				this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
			}
		}
	}, {
		key: 'disable',


		/**
   * Disable switch.
   *
   * @public
   */
		value: function disable() {
			this.inputElement_.disabled = true;
			this.updateClasses_();
		}
	}, {
		key: 'enable',


		/**
   * Enable switch.
   *
   * @public
   */
		value: function enable() {
			this.inputElement_.disabled = false;
			this.updateClasses_();
		}
	}, {
		key: 'on',


		/**
   * Activate switch.
   *
   * @public
   */
		value: function on() {
			this.inputElement_.checked = true;
			this.updateClasses_();
		}
	}, {
		key: 'off',


		/**
   * Deactivate switch.
   *
   * @public
   */
		value: function off() {
			this.inputElement_.checked = false;
			this.updateClasses_();
		}
	}, {
		key: 'init',


		/**
   * Initialize element.
   */
		value: function init() {
			if (this.element_) {
				this.inputElement_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);

				var track = document.createElement('div');
				track.classList.add(this.CssClasses_.TRACK);

				var thumb = document.createElement('div');
				thumb.classList.add(this.CssClasses_.THUMB);

				var focusHelper = document.createElement('span');
				focusHelper.classList.add(this.CssClasses_.FOCUS_HELPER);

				thumb.appendChild(focusHelper);

				this.element_.appendChild(track);
				this.element_.appendChild(thumb);

				this.boundMouseUpHandler = this.onMouseUp_.bind(this);

				if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
					this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
					this.rippleContainerElement_ = document.createElement('span');
					this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
					this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_EFFECT);
					this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CENTER);
					this.rippleContainerElement_.addEventListener('mouseup', this.boundMouseUpHandler);

					var ripple = document.createElement('span');
					ripple.classList.add(this.CssClasses_.RIPPLE);

					this.rippleContainerElement_.appendChild(ripple);
					this.element_.appendChild(this.rippleContainerElement_);
				}

				this.boundChangeHandler = this.onChange_.bind(this);
				this.boundFocusHandler = this.onFocus_.bind(this);
				this.boundBlurHandler = this.onBlur_.bind(this);

				this.inputElement_.addEventListener('change', this.boundChangeHandler);
				this.inputElement_.addEventListener('focus', this.boundFocusHandler);
				this.inputElement_.addEventListener('blur', this.boundBlurHandler);
				this.element_.addEventListener('mouseup', this.boundMouseUpHandler);

				this.updateClasses_();
				this.element_.classList.add('is-upgraded');
			}
		}
	}]);

	return MaterialSwitch;
}();



/***/ }),
/* 126 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "label",
    {
      staticClass: "mdl-switch mdl-js-switch mdl-js-ripple-effect is-upgraded",
      class: { "is-checked": _vm.shouldBeChecked }
    },
    [
      _c("input", {
        staticClass: "mdl-switch__input",
        attrs: { type: "checkbox", disabled: _vm.disabled },
        domProps: { checked: _vm.shouldBeChecked, value: _vm.value },
        on: { change: _vm.updateInput }
      }),
      _vm._v(" "),
      _c(
        "span",
        { staticClass: "mdl-switch__label" },
        [_vm._t("default", [_vm._v(_vm._s(_vm.label))])],
        2
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6d60981d", esExports)
  }
}

/***/ }),
/* 127 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlTooltip_vue__ = __webpack_require__(41);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_51ab436e_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlTooltip_vue__ = __webpack_require__(130);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(128)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlTooltip_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_51ab436e_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlTooltip_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/material-design-lite/tooltip/mdlTooltip.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-51ab436e", Component.options)
  } else {
    hotAPI.reload("data-v-51ab436e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 128 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 129 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MaterialTooltip; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var MaterialTooltip = function () {
	/**
  * Class constructor for Tooltip MDL component.
  * Implements MDL component design pattern defined at:
  * https://github.com/jasonmayes/mdl-component-design-pattern
  *
  * @constructor
  * @param {HTMLElement} element The element that will be upgraded.
  */
	function MaterialTooltip(element) {
		_classCallCheck(this, MaterialTooltip);

		this.element_ = element;

		/**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
		MaterialTooltip.prototype.Constant_ = {};

		/**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
		MaterialTooltip.prototype.CssClasses_ = {
			IS_ACTIVE: 'is-active',
			BOTTOM: 'mdl-tooltip--bottom',
			LEFT: 'mdl-tooltip--left',
			RIGHT: 'mdl-tooltip--right',
			TOP: 'mdl-tooltip--top'
		};

		// Initialize instance.
		this.init();
	}

	/**
  * Handle mouseenter for tooltip.
  *
  * @param {Event} event The event that fired.
  * @private
  */


	_createClass(MaterialTooltip, [{
		key: 'handleMouseEnter_',
		value: function handleMouseEnter_(event) {
			var props = event.target.getBoundingClientRect();
			var left = props.left + props.width / 2;
			var top = props.top + props.height / 2;
			var marginLeft = -1 * (this.element_.offsetWidth / 2);
			var marginTop = -1 * (this.element_.offsetHeight / 2);

			if (this.element_.classList.contains(this.CssClasses_.LEFT) || this.element_.classList.contains(this.CssClasses_.RIGHT)) {
				left = props.width / 2;
				if (top + marginTop < 0) {
					this.element_.style.top = '0';
					this.element_.style.marginTop = '0';
				} else {
					this.element_.style.top = top + 'px';
					this.element_.style.marginTop = marginTop + 'px';
				}
			} else {
				if (left + marginLeft < 0) {
					this.element_.style.left = '0';
					this.element_.style.marginLeft = '0';
				} else {
					this.element_.style.left = left + 'px';
					this.element_.style.marginLeft = marginLeft + 'px';
				}
			}

			if (this.element_.classList.contains(this.CssClasses_.TOP)) {
				this.element_.style.top = props.top - this.element_.offsetHeight - 10 + 'px';
			} else if (this.element_.classList.contains(this.CssClasses_.RIGHT)) {
				this.element_.style.left = props.left + props.width + 10 + 'px';
			} else if (this.element_.classList.contains(this.CssClasses_.LEFT)) {
				this.element_.style.left = props.left - this.element_.offsetWidth - 10 + 'px';
			} else {
				this.element_.style.top = props.top + props.height + 10 + 'px';
			}

			this.element_.classList.add(this.CssClasses_.IS_ACTIVE);
		}

		/**
   * Hide tooltip on mouseleave or scroll
   *
   * @private
   */

	}, {
		key: 'hideTooltip_',
		value: function hideTooltip_() {
			this.element_.classList.remove(this.CssClasses_.IS_ACTIVE);
		}

		/**
   * Initialize element.
   */

	}, {
		key: 'init',
		value: function init() {

			if (this.element_) {
				var forElId = this.element_.getAttribute('for') || this.element_.getAttribute('data-mdl-for');

				if (forElId) {
					this.forElement_ = document.getElementById(forElId);
				}

				if (this.forElement_) {
					// It's left here because it prevents accidental text selection on Android
					if (!this.forElement_.hasAttribute('tabindex')) {
						this.forElement_.setAttribute('tabindex', '0');
					}

					this.boundMouseEnterHandler = this.handleMouseEnter_.bind(this);
					this.boundMouseLeaveAndScrollHandler = this.hideTooltip_.bind(this);
					this.forElement_.addEventListener('mouseenter', this.boundMouseEnterHandler, false);
					this.forElement_.addEventListener('touchend', this.boundMouseEnterHandler, false);
					this.forElement_.addEventListener('mouseleave', this.boundMouseLeaveAndScrollHandler, false);
					window.addEventListener('scroll', this.boundMouseLeaveAndScrollHandler, true);
					window.addEventListener('touchstart', this.boundMouseLeaveAndScrollHandler);
				}
			}
		}
	}]);

	return MaterialTooltip;
}();



/***/ }),
/* 130 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("span", { staticClass: "mdl-tooltip--container" }, [
    _c(
      "span",
      { staticClass: "mdl-tooltip--icon", attrs: { id: _vm.id } },
      [
        _vm._t("label", [
          _c(
            "svg",
            {
              attrs: {
                xmlns: "http://www.w3.org/2000/svg",
                width: "24",
                height: "24",
                viewBox: "0 0 24 24"
              }
            },
            [
              _c("path", { attrs: { fill: "none", d: "M0 0h24v24H0V0z" } }),
              _vm._v(" "),
              _c("path", {
                attrs: {
                  d:
                    "M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"
                }
              })
            ]
          )
        ])
      ],
      2
    ),
    _vm._v(" "),
    _c(
      "span",
      {
        staticClass: "mdl-tooltip",
        class: _vm.getClass,
        attrs: { "data-mdl-for": _vm.id }
      },
      [_vm._t("default")],
      2
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-51ab436e", esExports)
  }
}

/***/ }),
/* 131 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlTextfield_vue__ = __webpack_require__(42);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5ee97d49_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlTextfield_vue__ = __webpack_require__(134);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(132)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlTextfield_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5ee97d49_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlTextfield_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/material-design-lite/textfield/mdlTextfield.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5ee97d49", Component.options)
  } else {
    hotAPI.reload("data-v-5ee97d49", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 132 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 133 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MaterialTextfield; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var MaterialTextfield = function () {

	/**
  * Class constructor for Textfield MDL component.
  * Implements MDL component design pattern defined at:
  * https://github.com/jasonmayes/mdl-component-design-pattern
  *
  * @constructor
  * @param {HTMLElement} element The element that will be upgraded.
  */
	function MaterialTextfield(element) {
		_classCallCheck(this, MaterialTextfield);

		this.element_ = element;

		/**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
		this.Constant_ = {
			NO_MAX_ROWS: -1,
			MAX_ROWS_ATTRIBUTE: 'maxrows'
		};

		/**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
		this.CssClasses_ = {
			LABEL: 'mdl-textfield__label',
			INPUT: 'mdl-textfield__input',
			IS_DIRTY: 'is-dirty',
			IS_FOCUSED: 'is-focused',
			IS_DISABLED: 'is-disabled',
			IS_INVALID: 'is-invalid',
			IS_UPGRADED: 'is-upgraded',
			HAS_PLACEHOLDER: 'has-placeholder'
		};

		this.maxRows = this.Constant_.NO_MAX_ROWS;

		// Initialize instance.
		this.init();
	}

	/**
  * Handle input being entered.
  *
  * @param {Event} event The event that fired.
  * @private
  */


	_createClass(MaterialTextfield, [{
		key: 'onKeyDown_',
		value: function onKeyDown_(event) {
			var currentRowCount = event.target.value.split('\n').length;
			if (event.keyCode === 13) {
				if (currentRowCount >= this.maxRows) {
					event.preventDefault();
				}
			}
		}

		/**
   * Handle focus.
   *
   * @param {Event} event The event that fired.
   * @private
   */

	}, {
		key: 'onFocus_',
		value: function onFocus_(event) {
			this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
		}

		/**
   * Handle lost focus.
   *
   * @param {Event} event The event that fired.
   * @private
   */

	}, {
		key: 'onBlur_',
		value: function onBlur_(event) {
			this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
		}

		/**
   * Handle reset event from out side.
   *
   * @param {Event} event The event that fired.
   * @private
   */

	}, {
		key: 'onReset_',
		value: function onReset_(event) {
			this.updateClasses_();
		}

		/**
   * Handle class updates.
   *
   * @private
   */

	}, {
		key: 'updateClasses_',
		value: function updateClasses_() {
			this.checkDisabled();
			this.checkValidity();
			this.checkDirty();
			this.checkFocus();
		}

		/**
   * Check the disabled state and update field accordingly.
   *
   * @public
   */

	}, {
		key: 'checkDisabled',
		value: function checkDisabled() {
			if (this.input_.disabled) {
				this.element_.classList.add(this.CssClasses_.IS_DISABLED);
			} else {
				this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
			}
		}

		/**
   * Check the focus state and update field accordingly.
   *
   * @public
   */

	}, {
		key: 'checkFocus',
		value: function checkFocus() {
			if (Boolean(this.element_.querySelector(':focus'))) {
				this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
			} else {
				this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
			}
		}

		/**
   * Check the validity state and update field accordingly.
   *
   * @public
   */

	}, {
		key: 'checkValidity',
		value: function checkValidity() {
			if (this.input_.validity) {
				if (this.input_.validity.valid) {
					this.element_.classList.remove(this.CssClasses_.IS_INVALID);
				} else {
					this.element_.classList.add(this.CssClasses_.IS_INVALID);
				}
			}
		}

		/**
   * Check the dirty state and update field accordingly.
   *
   * @public
   */

	}, {
		key: 'checkDirty',
		value: function checkDirty() {
			if (this.input_.value && this.input_.value.length > 0) {
				this.element_.classList.add(this.CssClasses_.IS_DIRTY);
			} else {
				this.element_.classList.remove(this.CssClasses_.IS_DIRTY);
			}
		}

		/**
   * Disable text field.
   *
   * @public
   */

	}, {
		key: 'disable',
		value: function disable() {
			this.input_.disabled = true;
			this.updateClasses_();
		}

		/**
   * Enable text field.
   *
   * @public
   */

	}, {
		key: 'enable',
		value: function enable() {
			this.input_.disabled = false;
			this.updateClasses_();
		}

		/**
   * Update text field value.
   *
   * @param {string} value The value to which to set the control (optional).
   * @public
   */

	}, {
		key: 'change',
		value: function change(value) {

			this.input_.value = value || '';
			this.updateClasses_();
		}

		/**
   * Initialize element.
   */

	}, {
		key: 'init',
		value: function init() {

			if (this.element_) {
				this.label_ = this.element_.querySelector('.' + this.CssClasses_.LABEL);
				this.input_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);

				if (this.input_) {
					if (this.input_.hasAttribute(
					/** @type {string} */this.Constant_.MAX_ROWS_ATTRIBUTE)) {
						this.maxRows = parseInt(this.input_.getAttribute(
						/** @type {string} */this.Constant_.MAX_ROWS_ATTRIBUTE), 10);
						if (isNaN(this.maxRows)) {
							this.maxRows = this.Constant_.NO_MAX_ROWS;
						}
					}

					if (this.input_.hasAttribute('placeholder')) {
						this.element_.classList.add(this.CssClasses_.HAS_PLACEHOLDER);
					}

					this.boundUpdateClassesHandler = this.updateClasses_.bind(this);
					this.boundFocusHandler = this.onFocus_.bind(this);
					this.boundBlurHandler = this.onBlur_.bind(this);
					this.boundResetHandler = this.onReset_.bind(this);
					this.input_.addEventListener('input', this.boundUpdateClassesHandler);
					this.input_.addEventListener('focus', this.boundFocusHandler);
					this.input_.addEventListener('blur', this.boundBlurHandler);
					this.input_.addEventListener('reset', this.boundResetHandler);

					if (this.maxRows !== this.Constant_.NO_MAX_ROWS) {
						// TODO: This should handle pasting multi line text.
						// Currently doesn't.
						this.boundKeyDownHandler = this.onKeyDown_.bind(this);
						this.input_.addEventListener('keydown', this.boundKeyDownHandler);
					}
					var invalid = this.element_.classList.contains(this.CssClasses_.IS_INVALID);
					this.updateClasses_();
					this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
					if (invalid) {
						this.element_.classList.add(this.CssClasses_.IS_INVALID);
					}
					if (this.input_.hasAttribute('autofocus')) {
						this.element_.focus();
						this.checkFocus();
					}
				}
			}
		}
	}]);

	return MaterialTextfield;
}();



/***/ }),
/* 134 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass:
        "mdl-textfield mdl-js-textfield mdl-textfield--floating-label"
    },
    [
      _vm.multiline
        ? [
            _c("textarea", {
              staticClass: "mdl-textfield__input",
              attrs: { rows: _vm.rows, id: _vm.field_id },
              domProps: { value: _vm.value },
              on: {
                input: function($event) {
                  _vm.$emit("input", $event.target.value)
                }
              }
            })
          ]
        : [
            _c("input", {
              staticClass: "mdl-textfield__input",
              attrs: { type: _vm.type, id: _vm.field_id },
              domProps: { value: _vm.value },
              on: {
                input: function($event) {
                  _vm.$emit("input", $event.target.value)
                }
              }
            })
          ],
      _vm._v(" "),
      _c("label", {
        staticClass: "mdl-textfield__label",
        attrs: { for: _vm.field_id },
        domProps: { innerHTML: _vm._s(_vm.label) }
      }),
      _vm._v(" "),
      _c("span", {
        staticClass: "mdl-textfield__error",
        domProps: { innerHTML: _vm._s(_vm.helptext) }
      })
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-5ee97d49", esExports)
  }
}

/***/ }),
/* 135 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "carousel-slider-edit-page" },
    [
      _c("h1", { staticClass: "wp-heading-inline" }, [_vm._v("Edit Slider")]),
      _vm._v(" "),
      _c("div", { staticClass: "clear" }),
      _vm._v(" "),
      _c("div", { staticClass: "carousel-slider-content" }, [
        _c("div", { attrs: { id: "titlediv" } }, [
          _c("div", { attrs: { id: "titlewrap" } }, [
            _c(
              "label",
              {
                staticClass: "screen-reader-text",
                attrs: { id: "title-prompt-text", for: "title" }
              },
              [_vm._v("Enter title here")]
            ),
            _vm._v(" "),
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.slider.title,
                  expression: "slider.title"
                }
              ],
              attrs: {
                type: "text",
                name: "post_title",
                size: "30",
                id: "title",
                spellcheck: "true",
                autocomplete: "off"
              },
              domProps: { value: _vm.slider.title },
              on: {
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.$set(_vm.slider, "title", $event.target.value)
                }
              }
            })
          ])
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "carousel-slider-preview" },
          [
            _vm.slider.type === "image-carousel"
              ? [_c("image-carousel", { attrs: { options: _vm.slider } })]
              : _vm._e(),
            _vm._v(" "),
            _vm.slider.type === "image-carousel-url"
              ? [_c("image-carousel-url", { attrs: { options: _vm.slider } })]
              : _vm._e(),
            _vm._v(" "),
            _vm.slider.type === "video-carousel"
              ? [_c("video-carousel", { attrs: { options: _vm.slider } })]
              : _vm._e(),
            _vm._v(" "),
            _vm.slider.type === "hero-banner-slider"
              ? [_c("hero-carousel", { attrs: { options: _vm.slider } })]
              : _vm._e(),
            _vm._v(" "),
            _vm.slider.type === "post-carousel"
              ? [_c("post-carousel", { attrs: { options: _vm.slider } })]
              : _vm._e()
          ],
          2
        )
      ]),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "carousel-slider-sidebar" },
        _vm._l(_vm._sections, function(section) {
          return _c(
            "accordion",
            {
              key: section.id,
              attrs: { title: section.title, active: section.active }
            },
            [
              _vm._l(_vm._fields, function(field) {
                return field.section === section.id
                  ? [
                      _c(
                        "div",
                        {
                          staticClass: "carousel-slider-control__field",
                          attrs: { "data-type": field.type }
                        },
                        [
                          "gallery" !== field.type
                            ? _c(
                                "label",
                                {
                                  staticClass: "carousel-slider-control__label",
                                  attrs: { for: field.id }
                                },
                                [
                                  _vm._v(
                                    "\n\t\t\t\t\t\t" +
                                      _vm._s(field.label) +
                                      "\n\t\t\t\t\t\t"
                                  ),
                                  field.description
                                    ? [
                                        _c(
                                          "mdl-tooltip",
                                          { attrs: { large: true } },
                                          [
                                            _c("div", {
                                              domProps: {
                                                innerHTML: _vm._s(
                                                  field.description
                                                )
                                              }
                                            })
                                          ]
                                        )
                                      ]
                                    : _vm._e()
                                ],
                                2
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          "repeater" === field.type
                            ? [
                                _c(
                                  "draggable",
                                  {
                                    model: {
                                      value: _vm.slider[field.id],
                                      callback: function($$v) {
                                        _vm.$set(_vm.slider, field.id, $$v)
                                      },
                                      expression: "slider[field.id]"
                                    }
                                  },
                                  [
                                    _vm._l(_vm.slider[field.id], function(
                                      item,
                                      index
                                    ) {
                                      return [
                                        _c(
                                          "accordion-repeater",
                                          {
                                            key: index + 1,
                                            attrs: {
                                              title: _vm.getItemTitle(index)
                                            },
                                            on: {
                                              "click:clear": function($event) {
                                                _vm.clearItem(
                                                  item,
                                                  _vm.slider[field.id]
                                                )
                                              },
                                              "click:copy": function($event) {
                                                _vm.copyItem(
                                                  item,
                                                  _vm.slider[field.id]
                                                )
                                              }
                                            }
                                          },
                                          [
                                            _vm._l(field.fields, function(
                                              _field
                                            ) {
                                              return [
                                                _vm.isTextfield(_field.type)
                                                  ? [
                                                      _c(
                                                        "div",
                                                        {
                                                          staticClass:
                                                            "carousel-slider-control__field"
                                                        },
                                                        [
                                                          _c(
                                                            "label",
                                                            {
                                                              staticClass:
                                                                "carousel-slider-control__label"
                                                            },
                                                            [
                                                              _vm._v(
                                                                _vm._s(
                                                                  _field.label
                                                                )
                                                              )
                                                            ]
                                                          ),
                                                          _vm._v(" "),
                                                          _field.type ===
                                                          "checkbox"
                                                            ? _c("input", {
                                                                directives: [
                                                                  {
                                                                    name:
                                                                      "model",
                                                                    rawName:
                                                                      "v-model",
                                                                    value:
                                                                      item[
                                                                        _field
                                                                          .id
                                                                      ],
                                                                    expression:
                                                                      "item[_field.id]"
                                                                  }
                                                                ],
                                                                staticClass:
                                                                  "widefat",
                                                                attrs: {
                                                                  type:
                                                                    "checkbox"
                                                                },
                                                                domProps: {
                                                                  checked: Array.isArray(
                                                                    item[
                                                                      _field.id
                                                                    ]
                                                                  )
                                                                    ? _vm._i(
                                                                        item[
                                                                          _field
                                                                            .id
                                                                        ],
                                                                        null
                                                                      ) > -1
                                                                    : item[
                                                                        _field
                                                                          .id
                                                                      ]
                                                                },
                                                                on: {
                                                                  change: function(
                                                                    $event
                                                                  ) {
                                                                    var $$a =
                                                                        item[
                                                                          _field
                                                                            .id
                                                                        ],
                                                                      $$el =
                                                                        $event.target,
                                                                      $$c = $$el.checked
                                                                        ? true
                                                                        : false
                                                                    if (
                                                                      Array.isArray(
                                                                        $$a
                                                                      )
                                                                    ) {
                                                                      var $$v = null,
                                                                        $$i = _vm._i(
                                                                          $$a,
                                                                          $$v
                                                                        )
                                                                      if (
                                                                        $$el.checked
                                                                      ) {
                                                                        $$i <
                                                                          0 &&
                                                                          _vm.$set(
                                                                            item,
                                                                            _field.id,
                                                                            $$a.concat(
                                                                              [
                                                                                $$v
                                                                              ]
                                                                            )
                                                                          )
                                                                      } else {
                                                                        $$i >
                                                                          -1 &&
                                                                          _vm.$set(
                                                                            item,
                                                                            _field.id,
                                                                            $$a
                                                                              .slice(
                                                                                0,
                                                                                $$i
                                                                              )
                                                                              .concat(
                                                                                $$a.slice(
                                                                                  $$i +
                                                                                    1
                                                                                )
                                                                              )
                                                                          )
                                                                      }
                                                                    } else {
                                                                      _vm.$set(
                                                                        item,
                                                                        _field.id,
                                                                        $$c
                                                                      )
                                                                    }
                                                                  }
                                                                }
                                                              })
                                                            : _field.type ===
                                                              "radio"
                                                            ? _c("input", {
                                                                directives: [
                                                                  {
                                                                    name:
                                                                      "model",
                                                                    rawName:
                                                                      "v-model",
                                                                    value:
                                                                      item[
                                                                        _field
                                                                          .id
                                                                      ],
                                                                    expression:
                                                                      "item[_field.id]"
                                                                  }
                                                                ],
                                                                staticClass:
                                                                  "widefat",
                                                                attrs: {
                                                                  type: "radio"
                                                                },
                                                                domProps: {
                                                                  checked: _vm._q(
                                                                    item[
                                                                      _field.id
                                                                    ],
                                                                    null
                                                                  )
                                                                },
                                                                on: {
                                                                  change: function(
                                                                    $event
                                                                  ) {
                                                                    _vm.$set(
                                                                      item,
                                                                      _field.id,
                                                                      null
                                                                    )
                                                                  }
                                                                }
                                                              })
                                                            : _c("input", {
                                                                directives: [
                                                                  {
                                                                    name:
                                                                      "model",
                                                                    rawName:
                                                                      "v-model",
                                                                    value:
                                                                      item[
                                                                        _field
                                                                          .id
                                                                      ],
                                                                    expression:
                                                                      "item[_field.id]"
                                                                  }
                                                                ],
                                                                staticClass:
                                                                  "widefat",
                                                                attrs: {
                                                                  type:
                                                                    _field.type
                                                                },
                                                                domProps: {
                                                                  value:
                                                                    item[
                                                                      _field.id
                                                                    ]
                                                                },
                                                                on: {
                                                                  input: function(
                                                                    $event
                                                                  ) {
                                                                    if (
                                                                      $event
                                                                        .target
                                                                        .composing
                                                                    ) {
                                                                      return
                                                                    }
                                                                    _vm.$set(
                                                                      item,
                                                                      _field.id,
                                                                      $event
                                                                        .target
                                                                        .value
                                                                    )
                                                                  }
                                                                }
                                                              })
                                                        ]
                                                      )
                                                    ]
                                                  : _vm._e(),
                                                _vm._v(" "),
                                                "textarea" === _field.type
                                                  ? [
                                                      _c(
                                                        "div",
                                                        {
                                                          staticClass:
                                                            "carousel-slider-control__field"
                                                        },
                                                        [
                                                          _c(
                                                            "label",
                                                            {
                                                              staticClass:
                                                                "carousel-slider-control__label"
                                                            },
                                                            [
                                                              _vm._v(
                                                                _vm._s(
                                                                  _field.label
                                                                )
                                                              )
                                                            ]
                                                          ),
                                                          _vm._v(" "),
                                                          _c("textarea", {
                                                            directives: [
                                                              {
                                                                name: "model",
                                                                rawName:
                                                                  "v-model",
                                                                value:
                                                                  item[
                                                                    _field.id
                                                                  ],
                                                                expression:
                                                                  "item[_field.id]"
                                                              }
                                                            ],
                                                            staticClass:
                                                              "widefat",
                                                            attrs: {
                                                              rows:
                                                                _field
                                                                  .input_attrs
                                                                  .rows
                                                            },
                                                            domProps: {
                                                              value:
                                                                item[_field.id]
                                                            },
                                                            on: {
                                                              input: function(
                                                                $event
                                                              ) {
                                                                if (
                                                                  $event.target
                                                                    .composing
                                                                ) {
                                                                  return
                                                                }
                                                                _vm.$set(
                                                                  item,
                                                                  _field.id,
                                                                  $event.target
                                                                    .value
                                                                )
                                                              }
                                                            }
                                                          })
                                                        ]
                                                      )
                                                    ]
                                                  : _vm._e(),
                                                _vm._v(" "),
                                                "background" === _field.type
                                                  ? [
                                                      _c(
                                                        "accordion",
                                                        {
                                                          attrs: {
                                                            title: _field.label
                                                          }
                                                        },
                                                        [
                                                          _c("background", {
                                                            attrs: {
                                                              supports:
                                                                _field.supports
                                                            },
                                                            model: {
                                                              value:
                                                                item[_field.id],
                                                              callback: function(
                                                                $$v
                                                              ) {
                                                                _vm.$set(
                                                                  item,
                                                                  _field.id,
                                                                  $$v
                                                                )
                                                              },
                                                              expression:
                                                                "item[_field.id]"
                                                            }
                                                          })
                                                        ],
                                                        1
                                                      )
                                                    ]
                                                  : _vm._e(),
                                                _vm._v(" "),
                                                "rich-text" === _field.type
                                                  ? [
                                                      _c(
                                                        "accordion",
                                                        {
                                                          attrs: {
                                                            title: _field.label
                                                          }
                                                        },
                                                        [
                                                          _c("rich-text", {
                                                            attrs: {
                                                              supports:
                                                                _field.supports
                                                            },
                                                            model: {
                                                              value:
                                                                item[_field.id],
                                                              callback: function(
                                                                $$v
                                                              ) {
                                                                _vm.$set(
                                                                  item,
                                                                  _field.id,
                                                                  $$v
                                                                )
                                                              },
                                                              expression:
                                                                "item[_field.id]"
                                                            }
                                                          })
                                                        ],
                                                        1
                                                      )
                                                    ]
                                                  : _vm._e(),
                                                _vm._v(" "),
                                                "button-generator" ===
                                                _field.type
                                                  ? [
                                                      _c(
                                                        "accordion",
                                                        {
                                                          attrs: {
                                                            title: _field.label
                                                          }
                                                        },
                                                        [
                                                          _c(
                                                            "button-generator",
                                                            {
                                                              attrs: {
                                                                supports:
                                                                  _field.supports
                                                              },
                                                              model: {
                                                                value:
                                                                  item[
                                                                    _field.id
                                                                  ],
                                                                callback: function(
                                                                  $$v
                                                                ) {
                                                                  _vm.$set(
                                                                    item,
                                                                    _field.id,
                                                                    $$v
                                                                  )
                                                                },
                                                                expression:
                                                                  "item[_field.id]"
                                                              }
                                                            }
                                                          )
                                                        ],
                                                        1
                                                      )
                                                    ]
                                                  : _vm._e(),
                                                _vm._v(" "),
                                                "radio-button" === _field.type
                                                  ? [
                                                      _c(
                                                        "div",
                                                        {
                                                          staticClass:
                                                            "carousel-slider-control__field"
                                                        },
                                                        [
                                                          _c(
                                                            "label",
                                                            {
                                                              staticClass:
                                                                "carousel-slider-control__label"
                                                            },
                                                            [
                                                              _vm._v(
                                                                _vm._s(
                                                                  _field.label
                                                                )
                                                              )
                                                            ]
                                                          ),
                                                          _vm._v(" "),
                                                          _c(
                                                            "div",
                                                            {
                                                              staticClass:
                                                                "mdl-radio-button-container"
                                                            },
                                                            _vm._l(
                                                              _field.choices,
                                                              function(
                                                                value,
                                                                key
                                                              ) {
                                                                return _c(
                                                                  "mdl-radio-button",
                                                                  {
                                                                    key: key,
                                                                    attrs: {
                                                                      value: key
                                                                    },
                                                                    model: {
                                                                      value:
                                                                        item[
                                                                          _field
                                                                            .id
                                                                        ],
                                                                      callback: function(
                                                                        $$v
                                                                      ) {
                                                                        _vm.$set(
                                                                          item,
                                                                          _field.id,
                                                                          $$v
                                                                        )
                                                                      },
                                                                      expression:
                                                                        "item[_field.id]"
                                                                    }
                                                                  },
                                                                  [
                                                                    _vm._v(
                                                                      " " +
                                                                        _vm._s(
                                                                          value
                                                                        ) +
                                                                        "\n\t\t\t\t\t\t\t\t\t\t\t\t\t"
                                                                    )
                                                                  ]
                                                                )
                                                              }
                                                            ),
                                                            1
                                                          )
                                                        ]
                                                      )
                                                    ]
                                                  : _vm._e()
                                              ]
                                            })
                                          ],
                                          2
                                        )
                                      ]
                                    })
                                  ],
                                  2
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "media-gallery-button" },
                                  [
                                    _c(
                                      "mdl-button",
                                      {
                                        attrs: {
                                          type: "raised",
                                          color: "default"
                                        },
                                        on: {
                                          click: function($event) {
                                            _vm.addRepeaterItem(
                                              field,
                                              _vm.slider[field.id]
                                            )
                                          }
                                        }
                                      },
                                      [
                                        _vm._v(
                                          _vm._s(field.button_text) +
                                            "\n\t\t\t\t\t\t\t"
                                        )
                                      ]
                                    )
                                  ],
                                  1
                                )
                              ]
                            : _vm._e(),
                          _vm._v(" "),
                          "select" === field.type
                            ? [
                                _c(
                                  "select",
                                  {
                                    directives: [
                                      {
                                        name: "model",
                                        rawName: "v-model",
                                        value: _vm.slider[field.id],
                                        expression: "slider[field.id]"
                                      }
                                    ],
                                    staticClass:
                                      "carousel-slider-control__input",
                                    attrs: { id: field.id },
                                    on: {
                                      change: function($event) {
                                        var $$selectedVal = Array.prototype.filter
                                          .call($event.target.options, function(
                                            o
                                          ) {
                                            return o.selected
                                          })
                                          .map(function(o) {
                                            var val =
                                              "_value" in o ? o._value : o.value
                                            return val
                                          })
                                        _vm.$set(
                                          _vm.slider,
                                          field.id,
                                          $event.target.multiple
                                            ? $$selectedVal
                                            : $$selectedVal[0]
                                        )
                                      }
                                    }
                                  },
                                  _vm._l(field.choices, function(choice, key) {
                                    return _c(
                                      "option",
                                      { domProps: { value: key } },
                                      [_vm._v(_vm._s(choice))]
                                    )
                                  }),
                                  0
                                )
                              ]
                            : _vm._e(),
                          _vm._v(" "),
                          "slider" === field.type
                            ? [
                                _c("mdl-slider", {
                                  attrs: {
                                    default: field.default,
                                    min: _vm.getMin(field),
                                    max: _vm.getMax(field),
                                    step: _vm.getStep(field)
                                  },
                                  model: {
                                    value: _vm.slider[field.id],
                                    callback: function($$v) {
                                      _vm.$set(_vm.slider, field.id, $$v)
                                    },
                                    expression: "slider[field.id]"
                                  }
                                })
                              ]
                            : _vm._e(),
                          _vm._v(" "),
                          "switch" === field.type
                            ? [
                                _c("mdl-switch", {
                                  model: {
                                    value: _vm.slider[field.id],
                                    callback: function($$v) {
                                      _vm.$set(_vm.slider, field.id, $$v)
                                    },
                                    expression: "slider[field.id]"
                                  }
                                })
                              ]
                            : _vm._e(),
                          _vm._v(" "),
                          "color" === field.type
                            ? [
                                _c("color-picker", {
                                  attrs: { "default-color": field.default },
                                  model: {
                                    value: _vm.slider[field.id],
                                    callback: function($$v) {
                                      _vm.$set(_vm.slider, field.id, $$v)
                                    },
                                    expression: "slider[field.id]"
                                  }
                                })
                              ]
                            : _vm._e(),
                          _vm._v(" "),
                          "radio-button" === field.type
                            ? [
                                _c(
                                  "div",
                                  { staticClass: "mdl-radio-button-container" },
                                  _vm._l(field.choices, function(value, key) {
                                    return _c(
                                      "mdl-radio-button",
                                      {
                                        key: key,
                                        attrs: { value: key },
                                        model: {
                                          value: _vm.slider[field.id],
                                          callback: function($$v) {
                                            _vm.$set(_vm.slider, field.id, $$v)
                                          },
                                          expression: "slider[field.id]"
                                        }
                                      },
                                      [
                                        _vm._v(
                                          _vm._s(value) + "\n\t\t\t\t\t\t\t"
                                        )
                                      ]
                                    )
                                  }),
                                  1
                                )
                              ]
                            : _vm._e(),
                          _vm._v(" "),
                          "gallery" === field.type
                            ? [
                                _c("media-uploader", {
                                  attrs: { multiple: true },
                                  model: {
                                    value: _vm.slider[field.id],
                                    callback: function($$v) {
                                      _vm.$set(_vm.slider, field.id, $$v)
                                    },
                                    expression: "slider[field.id]"
                                  }
                                })
                              ]
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.isTextfield(field.type)
                            ? [
                                field.type === "checkbox"
                                  ? _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: _vm.slider[field.id],
                                          expression: "slider[field.id]"
                                        }
                                      ],
                                      staticClass: "widefat",
                                      attrs: { type: "checkbox" },
                                      domProps: {
                                        checked: Array.isArray(
                                          _vm.slider[field.id]
                                        )
                                          ? _vm._i(_vm.slider[field.id], null) >
                                            -1
                                          : _vm.slider[field.id]
                                      },
                                      on: {
                                        change: function($event) {
                                          var $$a = _vm.slider[field.id],
                                            $$el = $event.target,
                                            $$c = $$el.checked ? true : false
                                          if (Array.isArray($$a)) {
                                            var $$v = null,
                                              $$i = _vm._i($$a, $$v)
                                            if ($$el.checked) {
                                              $$i < 0 &&
                                                _vm.$set(
                                                  _vm.slider,
                                                  field.id,
                                                  $$a.concat([$$v])
                                                )
                                            } else {
                                              $$i > -1 &&
                                                _vm.$set(
                                                  _vm.slider,
                                                  field.id,
                                                  $$a
                                                    .slice(0, $$i)
                                                    .concat($$a.slice($$i + 1))
                                                )
                                            }
                                          } else {
                                            _vm.$set(_vm.slider, field.id, $$c)
                                          }
                                        }
                                      }
                                    })
                                  : field.type === "radio"
                                  ? _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: _vm.slider[field.id],
                                          expression: "slider[field.id]"
                                        }
                                      ],
                                      staticClass: "widefat",
                                      attrs: { type: "radio" },
                                      domProps: {
                                        checked: _vm._q(
                                          _vm.slider[field.id],
                                          null
                                        )
                                      },
                                      on: {
                                        change: function($event) {
                                          _vm.$set(_vm.slider, field.id, null)
                                        }
                                      }
                                    })
                                  : _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: _vm.slider[field.id],
                                          expression: "slider[field.id]"
                                        }
                                      ],
                                      staticClass: "widefat",
                                      attrs: { type: field.type },
                                      domProps: { value: _vm.slider[field.id] },
                                      on: {
                                        input: function($event) {
                                          if ($event.target.composing) {
                                            return
                                          }
                                          _vm.$set(
                                            _vm.slider,
                                            field.id,
                                            $event.target.value
                                          )
                                        }
                                      }
                                    })
                              ]
                            : _vm._e()
                        ],
                        2
                      )
                    ]
                  : _vm._e()
              })
            ],
            2
          )
        }),
        1
      ),
      _vm._v(" "),
      _c("mdl-fab", { on: { click: _vm.saveSlider } }, [
        _c(
          "svg",
          {
            attrs: {
              xmlns: "http://www.w3.org/2000/svg",
              width: "24",
              height: "24",
              viewBox: "0 0 24 24"
            }
          },
          [
            _c("path", { attrs: { fill: "none", d: "M0 0h24v24H0V0z" } }),
            _vm._v(" "),
            _c("path", {
              attrs: {
                fill: "white",
                d:
                  "M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z"
              }
            })
          ]
        )
      ]),
      _vm._v(" "),
      _c(
        "div",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.loading,
              expression: "loading"
            }
          ],
          staticClass: "carousel-slider-spinner"
        },
        [_c("mdl-spinner", { attrs: { active: _vm.loading } })],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-07801d0a", esExports)
  }
}

/***/ }),
/* 136 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * As we are using hash based navigation, hack fix
 * to highlight the current selected menu
 *
 * Requires jQuery
 */
function menuFix(slug) {
    var $ = jQuery;

    var menuRoot = $('#toplevel_page_' + slug);
    var currentUrl = window.location.href;
    var currentPath = currentUrl.substr(currentUrl.indexOf('admin.php'));

    menuRoot.on('click', 'a', function () {
        var self = $(this);

        $('ul.wp-submenu li', menuRoot).removeClass('current');

        if (self.hasClass('wp-has-submenu')) {
            $('li.wp-first-item', menuRoot).addClass('current');
        } else {
            self.parents('li').addClass('current');
        }
    });

    $('ul.wp-submenu a', menuRoot).each(function (index, el) {
        if ($(el).attr('href') === currentPath) {
            $(el).parent().addClass('current');
        }
    });
}

/* harmony default export */ __webpack_exports__["a"] = (menuFix);

/***/ }),
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__carousel_js__ = __webpack_require__(2);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
	name: "PostCarousel",
	mixins: [__WEBPACK_IMPORTED_MODULE_0__carousel_js__["a" /* carousel */]],
	props: {
		options: { type: Object, required: true }
	},
	watch: {
		options: function options(newValue, oldValue) {
			this.rebuildCarousel();
		}
	},
	mounted: function mounted() {
		this.initCarousel();
	}
});

/***/ }),
/* 171 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_PostCarousel_vue__ = __webpack_require__(170);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_b26a2ea6_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_PostCarousel_vue__ = __webpack_require__(173);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(172)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-b26a2ea6"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_PostCarousel_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_b26a2ea6_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_PostCarousel_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/admin/components/sliders/PostCarousel.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-b26a2ea6", Component.options)
  } else {
    hotAPI.reload("data-v-b26a2ea6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 172 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 173 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { class: _vm.outer_classes }, [
    _c(
      "div",
      {
        class: _vm.slider_classes,
        attrs: {
          id: _vm.slider_id,
          "data-carousel_slider": "true",
          "data-slide-type": _vm.options.type
        }
      },
      _vm._l(_vm.options.posts, function(post) {
        return _c("div", { staticClass: "carousel-slider-post" }, [
          post.thumbnail
            ? _c(
                "a",
                {
                  staticClass: "carousel-slider-post__thumbnail",
                  attrs: { href: post.link }
                },
                [_c("img", { attrs: { src: post.thumbnail.src, alt: "" } })]
              )
            : _vm._e(),
          _vm._v(" "),
          _c("header", { staticClass: "carousel-slider-post__header" }, [
            _c(
              "div",
              { staticClass: "carousel-slider-post__cat-links" },
              [
                _vm._l(post.categories, function(category, cat_index) {
                  return [
                    cat_index > 0 ? [_vm._v(",")] : _vm._e(),
                    _vm._v(" "),
                    _c("a", { attrs: { href: category.link } }, [
                      _vm._v(_vm._s(category.name))
                    ])
                  ]
                })
              ],
              2
            ),
            _vm._v(" "),
            _c("h2", { staticClass: "carousel-slider-post__title" }, [
              _c("a", { attrs: { href: post.link, rel: "bookmark" } }, [
                _vm._v(_vm._s(post.title))
              ])
            ])
          ]),
          _vm._v(" "),
          _c("div", {
            staticClass: "carousel-slider-post__summary",
            domProps: { innerHTML: _vm._s(post.excerpt) }
          }),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "carousel-slider-post__tags-links" },
            [
              _vm._l(post.tags, function(tag, tag_index) {
                return [
                  tag_index > 0 ? [_vm._v(",")] : _vm._e(),
                  _vm._v(" "),
                  _c("a", { attrs: { href: tag.link } }, [
                    _vm._v(_vm._s(tag.name))
                  ])
                ]
              })
            ],
            2
          ),
          _vm._v(" "),
          _c("footer", { staticClass: "carousel-slider-post__footer" }, [
            _c("span", { staticClass: "carousel-slider-post__byline" }, [
              _c("span", { staticClass: "carousel-slider-post__vcard" }, [
                _c("img", { attrs: { src: post.author.avatar } })
              ]),
              _vm._v(" "),
              _c("span", { staticClass: "carousel-slider-post__author" }, [
                _vm._v("\n\t\t\t\t\t\tby "),
                _c(
                  "a",
                  { staticClass: "url fn n", attrs: { href: post.author.url } },
                  [_vm._v(_vm._s(post.author.name))]
                )
              ])
            ]),
            _vm._v(" "),
            _c("span", { staticClass: "carousel-slider-post__posted-on" }, [
              _c("a", { attrs: { href: post.link, rel: "bookmark" } }, [
                _vm._v(_vm._s(post.date.updated))
              ])
            ])
          ])
        ])
      }),
      0
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-b26a2ea6", esExports)
  }
}

/***/ })
],[43]);
//# sourceMappingURL=admin-vue.js.map