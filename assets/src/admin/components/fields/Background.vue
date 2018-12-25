<template>
	<div class="carousel-slider-control-background">

		<!-- background-color -->
		<div class="background-color">
			<h4>Background Color</h4>
			<input type="text" data-default-color="" data-alpha="true" :value="value.color"
				   class="shapla-color-control"/>
		</div>

		<!-- background-image -->
		<div class="background-image">
			<h4>Background Image</h4>
			<div class="attachment-media-view background-image-upload">
				<div class="thumbnail thumbnail-image">
					<img src="" alt=""/>
				</div>
				<div class="placeholder">No File Selected</div>
				<div class="actions">
					<button class="button background-image-upload-remove-button">Remove</button>
					<button type="button" class="button background-image-upload-button">Select File</button>
				</div>
			</div>
		</div>

		<!-- background-repeat -->
		<div class="background-repeat">
			<h4>Background Repeat</h4>
			<select class="widefat">
				<option v-for="_repeat in background_repeat" :value="_repeat.value" v-html="_repeat.label"></option>
			</select>
		</div>

		<!-- background-position -->
		<div class="background-position">
			<h4>Background Position</h4>
			<select class="widefat">
				<option v-for="_position in background_position" :value="_position.value"
						v-html="_position.label"></option>
			</select>
		</div>

		<!-- background-size -->
		<div class="background-size">
			<h4>Background Size</h4>
			<div class="buttonset">
				<template v-for="_size in background_size">
					<input class="switch-input screen-reader-text" type="radio" :value="_size.value">
					<label class="switch-label switch-label-off" for="" v-html="_size.label"> </label>
				</template>
			</div>
		</div>

		<!-- background-attachment -->
		<div class="background-attachment">
			<h4>Background Attachment</h4>
			<div class="buttonset">
				<template v-for="_attachment in background_attachment">
					<input class="switch-input screen-reader-text" type="radio" :value="_attachment.value" id="">
					<label class="switch-label switch-label-on" for="" v-html="_attachment.label"></label>
				</template>
			</div>
		</div>

	</div>
</template>

<script>
	export default {
		name: "Background",
		props: {
			value: {
				type: Object, default: function () {
					return {
						attachment: 'fixed',
						size: 'cover',
						position: 'center center',
						repeat: 'no-repeat',
					}
				}
			}
		},
		computed: {
			background_attachment() {
				return [
					{value: 'fixed', label: 'Fixed'},
					{value: 'scroll', label: 'Scroll'},
				]
			},
			background_size() {
				return [
					{value: 'cover', label: 'Cover'},
					{value: 'contain', label: 'Contain'},
					{value: 'auto', label: 'Auto'},
				]
			},
			background_position() {
				return [
					{value: 'left top', label: 'Left Top'},
					{value: 'left center', label: 'Left Center'},
					{value: 'left bottom', label: 'Left Bottom'},
					{value: 'right top', label: 'Right Top'},
					{value: 'right center', label: 'Right Center'},
					{value: 'right bottom', label: 'Right Bottom'},
					{value: 'center top', label: 'Center Top'},
					{value: 'center center', label: 'Center Center'},
					{value: 'center bottom', label: 'Center Bottom'},
				];
			},
			background_repeat() {
				return [
					{value: 'no-repeat', label: 'No Repeat'},
					{value: 'repeat', label: 'Repeat All'},
					{value: 'repeat-x', label: 'Repeat Horizontally'},
					{value: 'repeat-y', label: 'Repeat Vertically'},
				];
			},
		},
	}
</script>

<style lang="scss">
	.carousel-slider-control-background {
		position: relative;

		.background-attachment h4,
		.background-color h4,
		.background-position h4,
		.background-repeat h4,
		.background-size h4 {
			margin-bottom: 5px;
		}

		.background-attachment .buttonset,
		.background-size .buttonset {
			display: flex;
			flex-wrap: wrap;

			.switch-label {
				background: rgba(0, 0, 0, 0.05);
				border: 1px solid rgba(0, 0, 0, 0.1);
				color: #555;
				padding: 0.5em 1em;
				margin: 0;
				text-align: center;
				flex-grow: 1;
			}

			.switch-input:checked + .switch-label {
				background-color: #3498DB;
				color: #fff;
			}
		}

		.placeholder {
			width: 100%;
			position: relative;
			text-align: center;
			cursor: default;
			border: 1px dashed #b4b9be;
			box-sizing: border-box;
			padding: 9px 0;
			line-height: 20px;
		}
	}
</style>
