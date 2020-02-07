<template>
	<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
		<template v-if="multiline">
			<textarea class="mdl-textfield__input" :rows="rows" :id="field_id" :value="value"
					  @input="$emit('input', $event.target.value)"></textarea>
		</template>
		<template v-else>
			<input class="mdl-textfield__input" :type="type" :id="field_id" :value="value"
				   @input="$emit('input', $event.target.value)">
		</template>
		<label class="mdl-textfield__label" :for="field_id" v-html="label"></label>
		<span class="mdl-textfield__error" v-html="helptext"></span>
	</div>
</template>

<script>
	import {MaterialTextfield} from "./MaterialTextfield.js";

	export default {
		name: "mdlTextfield",
		props: {
			id: {type: String},
			type: {type: String, default: 'text'},
			label: {type: String},
			value: {type: [String, Number]},
			helptext: {type: String},
			multiline: {type: Boolean, default: false},
			fullwidth: {type: Boolean, default: false},
			rows: {type: Number, default: 3},
			cols: {type: Number, default: 40},
		},
		computed: {
			field_id() {
				if (this.id) {
					return this.id;
				}

				return this.__uuid;
			}
		},
		data() {
			return {}
		},
		mounted() {
			new MaterialTextfield(this.$el);
		}
	}
</script>

<style lang="scss">
	@import "textfield";

	// Need to overwrite for WordPress admin
	.mdl-textfield__input {
		border: none !important;
		border-bottom: 1px solid $input-text-bottom-border-color !important;
		color: inherit !important;
		box-shadow: none !important;
	}
</style>
