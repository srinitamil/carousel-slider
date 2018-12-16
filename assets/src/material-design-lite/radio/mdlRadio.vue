<template>
	<label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" :class="getClasses">
		<input type="radio" class="mdl-radio__button"
			   :checked="shouldBeChecked"
			   :value="value"
			   @change="updateInput"
		>
		<span class="mdl-radio__label"><slot>{{ label }}</slot></span>
	</label>
</template>

<script>
	import {MaterialRadio} from './MaterialRadio.js';
	import {MaterialRipple} from '../ripple/MaterialRipple.js';

	export default {
		name: "mdlRadio",
		model: {prop: 'modelValue', event: 'change'},
		props: {
			label: {type: String, default: '', required: false},
			value: {type: String,},
			modelValue: {default: ''},
		},
		mounted() {
			new MaterialRadio(this.$el);
			new MaterialRipple(this.$el.querySelector('.mdl-js-ripple-effect'));
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
	@import "radio";
</style>
