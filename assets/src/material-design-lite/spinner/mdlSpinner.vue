<template>
	<div class="mdl-spinner mdl-js-spinner" :class="getClass"></div>
</template>

<script>
	import {MaterialSpinner} from './MaterialSpinner.js';

	export default {
		name: "mdlSpinner",
		props: {
			active: {type: Boolean, default: true},
			single: {type: Boolean, default: false},
		},
		data() {
			return {}
		},
		mounted() {
			new MaterialSpinner(this.$el);
		},
		computed: {
			getClass() {
				return {
					'is-active': this.active,
					'mdl-spinner--single-color': this.single,
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "spinner";
</style>
