<template>
	<div>
		<input type="text"  value="red" >
		{{value}}
	</div>
</template>

<script>
	export default {
		name: "ColorPicker",
		model: {prop: 'value', event: 'change'},
		props: {
			value: {type: String, default: ''},
			defaultColor: {default: false},
			alpha: {type: Boolean, default: true},
		},
		data() {
			return {
				color:'',
			}
		},
		methods : {
			check() {
				//console.log(this.value);
			}
		},
		mounted() {
			this.check();
			let $ = window.jQuery, self = this, element = $(this.$el).find('input');
			element.wpColorPicker({
				defaultColor: self.defaultColor,
				change: function (event, ui) {
					self.$emit('input', ui.color.toString());
					this.color = ui.color.toString();
					//console.log(this.color);
				},
			});
		}
	}
</script>

<style scoped>

</style>
