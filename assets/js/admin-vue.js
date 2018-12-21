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
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__material_design_lite_snackbar_mdlSnackbar_vue__ = __webpack_require__(134);
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
/* 6 */,
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_ListTable_vue__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_CopyToClipboard_vue__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__material_design_lite_button_mdlFab_vue__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__material_design_lite_modal_mdlModal_vue__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__material_design_lite_radio_mdlRadio_vue__ = __webpack_require__(47);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
	components: { ListTable: __WEBPACK_IMPORTED_MODULE_0__components_ListTable_vue__["a" /* default */], mdlFab: __WEBPACK_IMPORTED_MODULE_2__material_design_lite_button_mdlFab_vue__["a" /* default */], mdlModal: __WEBPACK_IMPORTED_MODULE_3__material_design_lite_modal_mdlModal_vue__["a" /* default */], mdlRadio: __WEBPACK_IMPORTED_MODULE_4__material_design_lite_radio_mdlRadio_vue__["a" /* default */], CopyToClipboard: __WEBPACK_IMPORTED_MODULE_1__components_CopyToClipboard_vue__["a" /* default */] },
	data: function data() {
		return {
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
				},
				error: function error() {
					self.rows = [];
				}
			});
		},
		trashItem: function trashItem(item) {
			var $ = window.jQuery,
			    self = this;
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
				}
			});
		},
		restoreItem: function restoreItem(item) {
			var $ = window.jQuery,
			    self = this;
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
				}
			});
		},
		deleteItem: function deleteItem(item) {
			var $ = window.jQuery,
			    self = this;
			$.ajax({
				url: carouselSliderSettings.root + '/sliders/' + item.id,
				method: 'DELETE',
				data: {
					force: true
				},
				success: function success() {
					self.$delete(self.rows, self.rows.indexOf(item));
					self.counts.trash -= 1;
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
				}
			});
		},
		deleteItems: function deleteItems(items) {
			var $ = window.jQuery,
			    self = this;
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
				}
			});
		},
		restoreItems: function restoreItems(items) {
			var $ = window.jQuery,
			    self = this;
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
				}
			});
		}
	}
});

/***/ }),
/* 8 */
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
/* 9 */
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
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MaterialButton_js__ = __webpack_require__(11);
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
/* 11 */
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
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__button_mdlButton_vue__ = __webpack_require__(13);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlButton_vue__ = __webpack_require__(14);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8ac316ce_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlButton_vue__ = __webpack_require__(45);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(44)
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
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MaterialButton_js__ = __webpack_require__(11);
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
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MaterialRadio_js__ = __webpack_require__(49);
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
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
	name: "Settings",
	components: {},
	data: function data() {
		return {
			checked: ['on'],
			checked2: true,
			radio: 'on',
			switch1: 'off',
			slider1: 50,
			checkbox_label: 'This is a checkbox',
			snackbar: {
				message: 'This is snackbar initial message.',
				timeout: 2000
			}
		};
	},
	mounted: function mounted() {}
});

/***/ }),
/* 17 */
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
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Accordion_vue__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_ColorPicker_vue__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__material_design_lite_slider_mdlSlider_vue__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__material_design_lite_switch_mdlSwitch_vue__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__material_design_lite_radio_button_mdlRadioButton_vue__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__material_design_lite_button_mdlFab_vue__ = __webpack_require__(39);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
	components: { Accordion: __WEBPACK_IMPORTED_MODULE_0__components_Accordion_vue__["a" /* default */], mdlSlider: __WEBPACK_IMPORTED_MODULE_2__material_design_lite_slider_mdlSlider_vue__["a" /* default */], mdlSwitch: __WEBPACK_IMPORTED_MODULE_3__material_design_lite_switch_mdlSwitch_vue__["a" /* default */], mdlRadioButton: __WEBPACK_IMPORTED_MODULE_4__material_design_lite_radio_button_mdlRadioButton_vue__["a" /* default */], ColorPicker: __WEBPACK_IMPORTED_MODULE_1__components_ColorPicker_vue__["a" /* default */], mdlFab: __WEBPACK_IMPORTED_MODULE_5__material_design_lite_button_mdlFab_vue__["a" /* default */] },
	data: function data() {
		return {
			id: 0,
			slider: {},
			sections: [],
			fields: []
		};
	},
	mounted: function mounted() {
		var settings = window.CAROUSEL_SLIDER_SETTINGS;
		this.sections = settings.sections;
		this.fields = settings.fields;
		this.id = parseInt(this.$route.params.id);
		this.getItem();
	},

	methods: {
		getItem: function getItem() {
			var $ = window.jQuery,
			    self = this;
			$.ajax({
				method: 'GET',
				url: carouselSliderSettings.root + '/sliders/' + self.id,
				success: function success(response) {
					if (response.data) {
						self.slider = response.data;
					}
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
			this.$root.$emit('show-snackbar', {
				message: 'Data hes been saved!'
			});
		}
	}
});

/***/ }),
/* 19 */,
/* 20 */
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
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__button_mdlButton_vue__ = __webpack_require__(13);
//
//
//
//
//
//
//
//
//
//
//
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
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MaterialSwitch_js__ = __webpack_require__(68);
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
/* 23 */
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
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__App_vue__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__routers_js__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_admin_menu_fix_js__ = __webpack_require__(74);





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
/* 25 */,
/* 26 */,
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__ = __webpack_require__(5);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6bc4b6d8_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_App_vue__ = __webpack_require__(29);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(28)
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
/* 28 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 29 */
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
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_router__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__views_Home_vue__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__views_Settings_vue__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__views_Documentation_vue__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__views_Slider_vue__ = __webpack_require__(58);







__WEBPACK_IMPORTED_MODULE_0_vue__["default"].use(__WEBPACK_IMPORTED_MODULE_1_vue_router__["default"]);

var routes = [{ path: '/', name: 'Home', component: __WEBPACK_IMPORTED_MODULE_2__views_Home_vue__["a" /* default */] }, { path: '/settings', name: 'Settings', component: __WEBPACK_IMPORTED_MODULE_3__views_Settings_vue__["a" /* default */] }, { path: '/help', name: 'Documentation', component: __WEBPACK_IMPORTED_MODULE_4__views_Documentation_vue__["a" /* default */] }, { path: '/:id', name: 'Slider', component: __WEBPACK_IMPORTED_MODULE_5__views_Slider_vue__["a" /* default */] }];

/* harmony default export */ __webpack_exports__["a"] = (new __WEBPACK_IMPORTED_MODULE_1_vue_router__["default"]({
	routes: routes // short for `routes: routes`
}));

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Home_vue__ = __webpack_require__(7);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2ceff6f9_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Home_vue__ = __webpack_require__(51);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(32)
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
/* 32 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_ListTable_vue__ = __webpack_require__(8);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_693f87a0_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_ListTable_vue__ = __webpack_require__(35);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(34)
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
/* 34 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 35 */
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
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_CopyToClipboard_vue__ = __webpack_require__(9);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3164d406_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_CopyToClipboard_vue__ = __webpack_require__(38);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(37)
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
/* 37 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 38 */
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
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlFab_vue__ = __webpack_require__(10);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_73c508b0_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlFab_vue__ = __webpack_require__(41);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(40)
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
/* 40 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 41 */
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
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlModal_vue__ = __webpack_require__(12);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_093bbac9_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlModal_vue__ = __webpack_require__(46);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(43)
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
/* 43 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 44 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 45 */
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
/* 46 */
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
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlRadio_vue__ = __webpack_require__(15);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_30167289_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlRadio_vue__ = __webpack_require__(50);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(48)
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
/* 48 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 49 */
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
/* 50 */
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
/* 51 */
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
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Settings_vue__ = __webpack_require__(16);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6bc5a986_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Settings_vue__ = __webpack_require__(54);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(53)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Settings_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6bc5a986_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Settings_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/admin/views/Settings.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6bc5a986", Component.options)
  } else {
    hotAPI.reload("data-v-6bc5a986", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 53 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 54 */
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
    return _c("div", [
      _c("h1", { staticClass: "title" }, [_vm._v("Settings page")])
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6bc5a986", esExports)
  }
}

/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Documentation_vue__ = __webpack_require__(17);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_cbacd8e0_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Documentation_vue__ = __webpack_require__(57);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(56)
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
/* 56 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 57 */
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
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Slider_vue__ = __webpack_require__(18);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_07801d0a_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Slider_vue__ = __webpack_require__(73);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(59)
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
/* 59 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 60 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Accordion_vue__ = __webpack_require__(20);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_596c37a8_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Accordion_vue__ = __webpack_require__(62);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(61)
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
/* 61 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 62 */
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
        { staticClass: "carousel-slider-accordion__panel" },
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
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlSlider_vue__ = __webpack_require__(21);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_28c88a37_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlSlider_vue__ = __webpack_require__(65);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(64)
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
/* 64 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 65 */
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
/* 66 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlSwitch_vue__ = __webpack_require__(22);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6d60981d_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlSwitch_vue__ = __webpack_require__(69);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(67)
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
/* 67 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 68 */
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
/* 69 */
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
/* 70 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlRadioButton_vue__ = __webpack_require__(23);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6db9daa4_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlRadioButton_vue__ = __webpack_require__(72);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(71)
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
/* 71 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

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
/* 73 */
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
        ])
      ]),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "carousel-slider-sidebar" },
        _vm._l(_vm.sections, function(section) {
          return _c(
            "accordion",
            { key: section.id, attrs: { title: section.title } },
            [
              _vm._l(_vm.fields, function(field) {
                return field.section === section.id
                  ? [
                      _c(
                        "div",
                        {
                          staticClass: "carousel-slider-control__field",
                          attrs: { "data-type": field.type }
                        },
                        [
                          _c(
                            "label",
                            {
                              staticClass: "carousel-slider-control__label",
                              attrs: { for: field.id }
                            },
                            [_vm._v(_vm._s(field.label))]
                          ),
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
      ])
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
/* 74 */
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
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */
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
				self.$emit('change', ui.color.toString());
				self.$emit('input', ui.color.toString());
			}
		});
	}
});

/***/ }),
/* 129 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_ColorPicker_vue__ = __webpack_require__(128);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_267901b1_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_ColorPicker_vue__ = __webpack_require__(131);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(130)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-267901b1"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_ColorPicker_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_267901b1_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_ColorPicker_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "assets/src/admin/components/ColorPicker.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-267901b1", Component.options)
  } else {
    hotAPI.reload("data-v-267901b1", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 130 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 131 */
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
    require("vue-hot-reload-api")      .rerender("data-v-267901b1", esExports)
  }
}

/***/ }),
/* 132 */,
/* 133 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__MaterialSnackbar_js__ = __webpack_require__(136);
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
/* 134 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_mdlSnackbar_vue__ = __webpack_require__(133);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_6d6e6182_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_mdlSnackbar_vue__ = __webpack_require__(137);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(135)
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
/* 135 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 136 */
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
/* 137 */
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

/***/ })
],[24]);
//# sourceMappingURL=admin-vue.js.map