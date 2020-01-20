<template>
	<div class="mdl-modal is-active" v-show="active">
		<div class="mdl-modal-background"></div>

		<div class="mdl-modal-content" v-show="!is_card">
			<slot></slot>
		</div>
		<button class="mdl-modal-close is-fixed is-large" aria-label="close" v-show="!is_card"
				@click.prevent="close"></button>

		<div class="mdl-modal-card" v-show="is_card">
			<div class="mdl-modal-card-head">
				<p class="mdl-modal-card-title">{{title}}</p>
				<button class="mdl-modal-close" aria-label="close" @click.prevent="close"></button>
			</div>
			<div class="mdl-modal-card-body">
				<slot></slot>
			</div>
			<!--	<div class="mdl-modal-card-foot is-pulled-right">
					<slot name="foot">
						<mdl-button @click.prevent="create">create</mdl-button>
					</slot>
					<slot name="foot">
						<mdl-button @click.prevent="close">Cancel</mdl-button>
					</slot>
				</div> -->
		</div>
	</div>
</template>

<script>
	import mdlButton from '../button/mdlButton.vue';

	export default {
		name: "mdlModal",

		components: {mdlButton},

		props: {
			active: {type: Boolean, required: true, default: false},
			title: {type: String, required: false, default: 'Untitled'},
			type: {type: String, required: false, default: 'card'},
		},

		data() {
			return {}
		},

		computed: {
			is_card() {
				return this.type === 'card';
			}
		},

		methods: {
			close() {
				this.$emit('close');
			},

		}
	}
</script>

<style lang="scss">
	@import "modal";
</style>
