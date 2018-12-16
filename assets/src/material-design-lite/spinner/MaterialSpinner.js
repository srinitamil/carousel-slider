class MaterialSpinner {

	/**
	 * Class constructor for Spinner MDL component.
	 * Implements MDL component design pattern defined at:
	 * https://github.com/jasonmayes/mdl-component-design-pattern
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 * @constructor
	 */
	constructor(element) {
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
	createLayer(index) {
		let layer = document.createElement('div');
		layer.classList.add(this.CssClasses_.MDL_SPINNER_LAYER);
		layer.classList.add(this.CssClasses_.MDL_SPINNER_LAYER + '-' + index);

		let leftClipper = document.createElement('div');
		leftClipper.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE_CLIPPER);
		leftClipper.classList.add(this.CssClasses_.MDL_SPINNER_LEFT);

		let gapPatch = document.createElement('div');
		gapPatch.classList.add(this.CssClasses_.MDL_SPINNER_GAP_PATCH);

		let rightClipper = document.createElement('div');
		rightClipper.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE_CLIPPER);
		rightClipper.classList.add(this.CssClasses_.MDL_SPINNER_RIGHT);

		let circleOwners = [leftClipper, gapPatch, rightClipper];

		for (let i = 0; i < circleOwners.length; i++) {
			let circle = document.createElement('div');
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
	stop() {
		this.element_.classList.remove('is-active');
	};

	/**
	 * Starts the spinner animation.
	 * Public method for users who need to manually start the spinner for any reason
	 * (instead of just adding the 'is-active' class to their markup).
	 *
	 * @public
	 */
	start() {
		this.element_.classList.add('is-active');
	};

	/**
	 * Initialize element.
	 */
	init() {
		if (this.element_) {
			for (let i = 1; i <= this.Constant_.MDL_SPINNER_LAYER_COUNT; i++) {
				this.createLayer(i);
			}

			this.element_.classList.add('is-upgraded');
		}
	};
}

export {MaterialSpinner}
