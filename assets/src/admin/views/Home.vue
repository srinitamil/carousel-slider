<template>
	<div class="carousel-slider-list-page">
		<h1 class="wp-heading-inline">Sliders</h1>

		<mdl-fab @click="runAction">+</mdl-fab>
	</div>
</template>

<script>
	import mdlFab from '../../material-design-lite/button/mdlFab.vue';

	export default {
		name: "Home",
		components: {mdlFab},
		data() {
			return {
				switch1: false,
				radio1: 'both',
				checked: ['on'],
				checked2: true,
			}
		},
		methods: {
			runAction() {
				console.log('process delete icon.');
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
