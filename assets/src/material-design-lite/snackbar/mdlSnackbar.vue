<template>
	<div class="mdl-js-snackbar mdl-snackbar" :class="getClasses">
		<div class="mdl-snackbar__text"></div>
		<button class="mdl-snackbar__action" type="button"></button>
	</div>
</template>

<script>
	import {MaterialSnackbar} from './MaterialSnackbar.js';

	export default {
		name: "mdlSnackbar",
		model: {
			prop: 'options',
			event: 'queued'
		},
		props: {
			alignStart: {type: Boolean, default: false},
			options: {type: Object},
			event: {type: String, default: 'show-snackbar'},
			eventSource: {
				type: Object,
				required: false,
				default() {
					return this.$root
				}
			},
		},
		data() {
			return {
				mdlSnackbar: undefined
			}
		},
		computed: {
			getClasses() {
				return {
					'mdl-snackbar--align-start': this.alignStart,
				}
			}
		},
		watch: {
			options(newOptions) {
				if (newOptions && newOptions.message) {
					this.show(newOptions);
				}
			}
		},
		mounted() {
			this.mdlSnackbar = new MaterialSnackbar(this.$el);

			// Show initial message
			if (this.options && this.options.message) {
				this.show(this.options);
			}

			// if event specified use it, else if no snack prop then use default.
			this.eventSource.$on(this.event, this.show);
		},
		methods: {
			show(options) {
				this.mdlSnackbar.show(options);
			}
		}
	}
</script>

<style lang="scss">
	@import "snackbar";
</style>
