<template>
	<div :class="outer_classes" :style="btnStyles">
		<div :id='slider_id' :class='slider_classes' data-carousel_slider="true" :data-slide-type='options.type'>
			<div class="carousel-slider-item-video" v-for="video in options.videos">
				<div class="carousel-slider-video-wrapper">
					<a class="magnific-popup" @click="openModal(video)">
						<div class="carousel-slider-video-play-icon"></div>
						<div class="carousel-slider-video-overlay"></div>
						<img class="owl-lazy" :src="video.thumbnail.large"/>
					</a>
				</div>
			</div>

			<magnific-popup-modal :show="true" :config="{closeOnBgClick:false}" ref="modal">
				<!-- Put whatever content you want in here -->
				<div style="background: white; padding:0.25em 1em;">

				</div>
			</magnific-popup-modal>

		</div>
	</div>
</template>

<script>
	import {carousel} from './carousel.js';
	import MagnificPopupModal from "../fields/magnificpopupmodal";

	export default {
		name: "VideoCarousel",
		mixins: [carousel],
		//config :{ items: { src: '#' + this.id, }, },
		props: {
			options: {type: Object, required: true}
		},
		watch: {
			options(newValue, oldValue) {
				this.rebuildCarousel();
			}
		},
		components: {
			MagnificPopupModal
		},
		methods: {
			openModal(video) {
				console.log(video.url);
				console.log(video.provider);
				let root = this
				let config = _.extend(
						this.config,
						{
							items: {
								src: jQuery(this.$refs.modal),
								type: 'inline'
							},
							callbacks: {
								open: function () {
									root.visible = true;
									root.$emit('open');
								},
								close: root.close
							}
						},
						{});

				this.$refs.modal.open(config)
			},
		},
		mounted() {
			this.initCarousel();
			let recaptchaScript = document.createElement('script');
		}
	}
</script>

<style lang="scss" scoped>

</style>
