<template>
	<div class="mdl-dialog" :class="{'mdl-dialog--open':open}">
		<div class="mdl-dialog__scrim"></div>
		<div class="mdl-dialog__container">
			<div class="mdl-dialog__surface">
				<h4 class="mdl-dialog__title" v-show="hasTitle">{{title}}</h4>
				<div class="mdl-dialog__content" v-show="hasContent">
					<slot></slot>
				</div>
				<div class="mdl-dialog__actions">
					<slot name="actions">
						<mdl-button color="accent" @click="handleAccept">{{accept}}</mdl-button>
						<mdl-button @click="handleCancel">{{cancel}}</mdl-button>
					</slot>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import mdlButton from '../button/mdlButton.vue';

	export default {
		name: "mdlDialog",
		components: {mdlButton},
		props: {
			open: {type: Boolean, default: false},
			title: {type: String, default: ''},
			accept: {type: String, default: 'Ok'},
			cancel: {type: String, default: 'Cancel'}
		},
		computed: {
			hasTitle() {
				return !!this.title;
			},
			hasContent() {
				return !!this.$slots.default;
			}
		},
		methods: {
			handleCancel() {
				this.$emit('cancel');
			},
			handleAccept() {
				this.$emit('accept');
			}
		}
	}
</script>

<style lang="scss">
	@import "dialog";
</style>
