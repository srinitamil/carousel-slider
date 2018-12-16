<template>
	<div>
		<h1 class="title">Settings page</h1>

	</div>
</template>

<script>
	export default {
		name: "Settings",
		components: {},
		data() {
			return {
				checked: ['on'],
				checked2: true,
				radio: 'on',
				switch1: 'off',
				slider1: 50,
				checkbox_label: 'This is a checkbox',
				snackbar: {
					message: 'This is snackbar initial message.',
					timeout: 2000,
				}
			}
		},
		mounted() {

		}
	}
</script>

<style lang="scss">
</style>
