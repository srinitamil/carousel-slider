<template>
	<div class="carousel-slider-list-page">
		<h1 class="wp-heading-inline">Sliders</h1>

		<mdl-fab @click="openModal">+</mdl-fab>
		<mdl-modal :active="modalActive" @close="closeModal" title="Add New Slider">
			<p>
				<mdl-radio v-model="sliderType" value="image-carousel">Image Carousel</mdl-radio>
			</p>
			<p>
				<mdl-radio v-model="sliderType" value="image-carousel-url">Image Carousel (URL)</mdl-radio>
			</p>
			<p>
				<mdl-radio v-model="sliderType" value="post-carousel">Post Carousel</mdl-radio>
			</p>
			<p>
				<mdl-radio v-model="sliderType" value="product-carousel">Product Carousel</mdl-radio>
			</p>
			<p>
				<mdl-radio v-model="sliderType" value="video-carousel">Video Carousel</mdl-radio>
			</p>
			<p>
				<mdl-radio v-model="sliderType" value="hero-banner-slider">Hero Banner Slider</mdl-radio>
			</p>
		</mdl-modal>
	</div>
</template>

<script>
	import mdlFab from '../../material-design-lite/button/mdlFab.vue';
	import mdlModal from '../../material-design-lite/modal/mdlModal.vue';
	import mdlRadio from '../../material-design-lite/radio/mdlRadio.vue';

	export default {
		name: "Home",
		components: {mdlFab, mdlModal, mdlRadio},
		data() {
			return {
				modalActive: false,
				sliderType: 'image-carousel',
			}
		},
		methods: {
			openModal() {
				this.modalActive = true;
			},
			closeModal() {
				this.modalActive = false;
			}
		}
	}
</script>

<style lang="scss">
	.carousel-slider-list-page {
		.mdl-button--fab {
			position: fixed;
			bottom: 20px;
			right: 20px;
			z-index: 100;
		}
	}
</style>
