<template>
	<div :class="outer_classes" :style="btnStyles">
		<div :id='slider_id' :class='slider_classes' data-carousel_slider="true" :data-slide-type='options.type'>
			<div v-for="image in options.images" class="carousel-slider__item">
				<img class="owl-lazy" :src="image.image_src" :width="image.image_width"
					 :height="image.image_height" :alt="image.image_alt"/>
				<div class="carousel-slider__caption">
					<h4 class="title">{{image.title}}</h4>
					<p class="caption"> {{image.caption}} </p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {carousel} from './carousel.js';

	export default {
		name: "ImageCarousel",
		mixins: [carousel],
		props: {
			options: {type: Object, required: true}
		},
		watch: {
			options(newValue, oldValue) {
				this.rebuildCarousel();
			}
		},
		mounted() {
			this.initCarousel();
		},
	}
</script>

<style lang="scss">
	svg.carousel-slider-nav-icon {
		fill: var(--cs-nav-color);
	}
	.carousel-slider .owl-dots .owl-dot span{
		background: var(--cs-nav-color);
	}
	.carousel-slider .owl-dots .owl-dot.active span, .carousel-slider .owl-dots .owl-dot:hover span
	{
		background: var(--cs-nav-hover-color);
	}
</style>
