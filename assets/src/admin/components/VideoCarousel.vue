<template>
	<div :class="outer_classes">
		<div :id='slider_id' :class='slider_classes' data-carousel_slider="true" :data-slide-type='options.type'>
			<div class="carousel-slider-item-video" v-for="video in options.videos">
				<div class="carousel-slider-video-wrapper">
					<a class="magnific-popup" :href="video.url">
						<div class="carousel-slider-video-play-icon"></div>
						<div class="carousel-slider-video-overlay"></div>
						<img class="owl-lazy" :src="video.thumbnail.large"/>
					</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {carousel} from '../../mixins/carousel.js';

	export default {
		name: "VideoCarousel",
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
