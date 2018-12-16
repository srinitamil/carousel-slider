<template>
	<label class="mdl-radio-button mdl-js-radio-button mdl-js-ripple-effect" :class="getClasses">
		<input type="radio" class="mdl-radio-button__input"
			   :checked="shouldBeChecked"
			   :value="value"
			   @change="updateInput"
		>
		<span class="mdl-radio-button__label"><slot>{{ label }}</slot></span>
	</label>
</template>

<script>
	import {MaterialRipple} from '../ripple/MaterialRipple.js';

	export default {
		name: "mdlRadioButton",
		model: {prop: 'modelValue', event: 'change'},
		props: {
			label: {type: String, default: '', required: false},
			value: {type: String,},
			modelValue: {default: ''},
		},
		mounted() {
			// new MaterialRipple(this.$el);
		},
		computed: {
			shouldBeChecked() {
				return this.modelValue === this.value
			},
			getClasses() {
				return {
					'is-checked': this.shouldBeChecked
				}
			}
		},
		methods: {
			updateInput() {
				this.$emit('change', this.value);
			}
		}
	}
</script>

<style lang="scss">
	@import "radio-button";
</style>
