<template>
	<div class="carousel-slider-edit-page">
		<h1 class="wp-heading-inline">Edit Slider</h1>
		<div class="clear"></div>
		<div class="carousel-slider-content">
			<div id="titlediv">
				<div id="titlewrap">
					<label class="screen-reader-text" id="title-prompt-text" for="title">Enter title here</label>
					<input type="text" name="post_title" size="30" v-model="slider.title" id="title"
						   spellcheck="true" autocomplete="off">
				</div>
			</div>
		</div>
		<div class="carousel-slider-sidebar">
			<accordion v-for="section in sections" :title="section.title" :key="section.id">
				<template v-for="field in fields" v-if="field.section === section.id">
					<div class="carousel-slider-control__field" :data-type="field.type">
						<label class="carousel-slider-control__label" :for="field.id">{{field.label}}</label>
						<template v-if="'select' === field.type">
							<select :id="field.id" v-model="slider[field.id]" class="carousel-slider-control__input">
								<option v-for="(choice, key) in field.choices" :value="key">{{choice}}</option>
							</select>
						</template>
						<template v-if="'slider' === field.type">
							<mdl-slider v-model="slider[field.id]" :default="field.default" :min="getMin(field)"
										:max="getMax(field)" :step="getStep(field)"></mdl-slider>
						</template>
						<template v-if="'switch' === field.type">
							<mdl-switch v-model="slider[field.id]"></mdl-switch>
						</template>
						<template v-if="'color' === field.type">
							<color-picker v-model="slider[field.id]" :default-color="field.default"></color-picker>
						</template>
						<template v-if="'radio-button' === field.type">
							<div class="mdl-radio-button-container">
								<mdl-radio-button v-for="(value, key) in field.choices" :key="key"
												  v-model="slider[field.id]" :value="key">{{value}}
								</mdl-radio-button>
							</div>
						</template>
					</div>
				</template>
			</accordion>
		</div>
		<mdl-fab @click="saveSlider">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
				<path fill="none" d="M0 0h24v24H0V0z"/>
				<path fill="white"
					  d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z"/>
			</svg>
		</mdl-fab>
	</div>
</template>

<script>
	import Accordion from '../components/Accordion.vue';
	import ColorPicker from '../components/ColorPicker.vue';
	import mdlSlider from '../../material-design-lite/slider/mdlSlider.vue';
	import mdlSwitch from '../../material-design-lite/switch/mdlSwitch.vue';
	import mdlRadioButton from '../../material-design-lite/radio-button/mdlRadioButton.vue';
	import mdlFab from '../../material-design-lite/button/mdlFab.vue';

	export default {
		name: "Slider",
		components: {Accordion, mdlSlider, mdlSwitch, mdlRadioButton, ColorPicker, mdlFab},
		data() {
			return {
				id: 0,
				slider: {},
				sections: [],
				fields: [],
			}
		},
		mounted() {
			let settings = window.CAROUSEL_SLIDER_SETTINGS;
			this.sections = settings.sections;
			this.fields = settings.fields;
			this.id = parseInt(this.$route.params.id);
			this.getItem();
		},
		methods: {
			getItem() {
				let $ = window.jQuery, self = this;
				$.ajax({
					method: 'GET',
					url: carouselSliderSettings.root + '/sliders/' + self.id,
					success: function (response) {
						if (response.data) {
							self.slider = response.data;
						}
					}
				});
			},
			getMin(slider) {
				if (typeof slider.input_attrs.min !== "undefined") {
					return slider.input_attrs.min;
				}

				return 0;
			},
			getMax(slider) {
				if (typeof slider.input_attrs.max !== "undefined") {
					return slider.input_attrs.max;
				}

				return 100;
			},
			getStep(slider) {
				if (typeof slider.input_attrs.step !== "undefined") {
					return slider.input_attrs.step;
				}

				return 1;
			},
			saveSlider() {
				this.$root.$emit('show-snackbar', {
					message: 'Data hes been saved!',
				})
			}
		}
	}
</script>

<style lang="scss">
	.carousel-slider-edit-page {
		width: 100%;
		height: 100%;

		.mdl-button--fab {
			position: fixed;
			bottom: 20px;
			right: 20px;
			z-index: 100;
		}
	}

	.carousel-slider-control {
		&__field {
			&:not(:last-child) {
				margin-bottom: 15px;
				// padding-bottom: 15px;
			}
		}

		&__label, &__input {
			display: block;
			font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
			font-size: 13px;
			width: 100%;
		}

		&__label {
			color: rgba(#000, .85);
			margin-bottom: 10px;
		}

		&__input {
			background: #fff;
			height: 36px;
			line-height: 36px;
			margin: 1px;
			outline: 0;
			width: 100%;
			-webkit-tap-highlight-color: rgba(0, 0, 0, 0) !important;

			@media (min-width: 782px) {
				height: 28px;
				line-height: 28px;
			}
		}

		input, select, textarea {
			padding: 6px 8px;
			box-shadow: 0 0 0 transparent;
			transition: box-shadow 0.1s linear;
			border-radius: 4px;
			border: 1px solid #8d96a0;
			color: #555d66;
		}
	}

	.carousel-slider-content {
		float: left;
		display: block;
		width: calc(100% - 320px);
	}

	.carousel-slider-sidebar {
		margin: 0 0 20px 20px;
		width: 300px;
		background: white;
		min-height: 75vh;
		float: right;
	}

	.mdl-radio-button-container {
		display: flex;

		.mdl-radio-button:not(:last-child) {
			border-right: 1px solid rgba(#000, .45);
		}
	}
</style>
