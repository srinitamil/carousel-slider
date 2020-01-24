const carousel = {

	props: {
		options: {type: Object, required: true}
	},
	computed: {
		outer_classes() {
			let classes = ['carousel-slider-outer'];
			classes.push('carousel-slider-' + this.options.id);
			classes.push('carousel-slider-' + this.options.type);

			return classes;
		},
		btnStyles() {
			return {
				"--cs-nav-color": this.options.nav_color,
				"--cs-nav-hover-color": this.options.nav_active_color,
			};
		},
		slider_id() {
			return 'id-' + this.options.id;
		},
		slider_classes() {
			let classes = ['owl-carousel', 'carousel-slider'];
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

			// caption and title visibility
			if (this.options.show_image_title  === true) {
				classes.push('visible-title');
			}
			else {
				classes.push('hide-title');
			}
			// caption and title visibility
			if (this.options.show_image_caption === true) {
				classes.push('visible-caption');
			}else
			{
				classes.push('hide-caption');
			}

			return classes;
		},
		owl_options() {
			console.log(this.options.categories);
			return {
				stagePadding: this.options.stage_padding,
				nav: this.options.arrow_nav,
				nav_color: this.options.nav_color,
				categories: this.options.categories,
				nav_active_color: this.options.nav_active_color,
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
					0: {items: this.options.items_mobile},
					480: {items: this.options.items_mobile_landscape},
					768: {items: this.options.items_tablet},
					980: {items: this.options.items_desktop_small},
					1200: {items: this.options.items_desktop},
					1500: {items: this.options.items_desktop_large},
				},
				navText: [
					'<svg class="carousel-slider-nav-icon"  viewBox="0 0 20 20"><path d="M14 5l-5 5 5 5-1 2-7-7 7-7z"></path></svg>',
					'<svg class="carousel-slider-nav-icon"  viewBox="0 0 20 20"><path d="M6 15l5-5-5-5 1-2 7 7-7 7z"></path></svg>',
				],
			};
		}
	},
	methods: {
		initCarousel() {
			let slider = window.jQuery(this.$el).find("[data-carousel_slider]");
			slider.owlCarousel(this.owl_options);
		},
		rebuildCarousel() {
			let slider = window.jQuery(this.$el).find("[data-carousel_slider]");
			slider.owlCarousel('destroy');
			setTimeout(function (options) {
				console.log(options);
				slider.owlCarousel(options);
			}, 10, this.owl_options);
		},
	}
};

export {carousel}
