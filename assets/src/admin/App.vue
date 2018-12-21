<template>
	<div class="carousel-slider-app">
		<router-view></router-view>
		<mdl-snackbar></mdl-snackbar>
	</div>
</template>

<script>
	import mdlSnackbar from '../material-design-lite/snackbar/mdlSnackbar.vue';

	export default {
		name: 'App',
		components: {mdlSnackbar}
	}
</script>

<style lang="scss">
	@import "../material-design-lite/ripple/ripple";

	.carousel-slider-app {
		box-sizing: border-box;

		* {
			box-sizing: border-box;
		}
	}
</style>
