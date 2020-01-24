<template>
	<div :class="outer_classes" :style="btnStyles">
		<div :id='slider_id' :class='slider_classes' data-carousel_slider="true" :data-slide-type='options.type'>
			<div v-for="image in options.images_urls" class="carousel-slider__item">
				<img class="owl-lazy" :src="image.url" :alt="image.alt"/>
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
		name: "ImageCarouselUrl",
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
		}
	}
</script>

<style lang="scss">
	.owl-carousel.hide-title h4.title {
		display: none;
	}

	.owl-carousel.hide-caption p.caption {
		display: none;
	}

	.owl-carousel.visible-title h4.title {
		display: block;
	}

	.owl-carousel.visible-caption p.caption {
		display: block;
	}
</style>
