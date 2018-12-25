<template>
	<div :class="outer_classes">
		<div :id='slider_id' :class='slider_classes' data-carousel_slider="true" :data-slide-type='options.type'>
			<div v-for="image in options.images_urls" class="carousel-slider__item">
				<img class="owl-lazy" :src="image.url" :alt="image.alt"/>
			</div>
		</div>
	</div>
</template>

<script>
	import {carousel} from '../../mixins/carousel.js';

	export default {
		name: "ImageCarouselUrl",
		mixins: [carousel],
		props: {
			options: {type: Object, required: true}
		},
		mounted() {
			let $ = window.jQuery, slider = $(this.$el).find("[data-carousel_slider]");
			let carousel = slider.owlCarousel(this.owl_options);
		}
	}
</script>

<style lang="scss">

</style>
