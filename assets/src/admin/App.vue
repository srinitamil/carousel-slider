<template>
	<div class="carousel-slider-app">
		<router-view></router-view>
	</div>
</template>

<script>
	export default {
		name: 'App'
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
