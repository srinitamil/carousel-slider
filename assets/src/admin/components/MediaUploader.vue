<template>
	<div>
		<button class="button media-uploader-button">{{buttonText}}</button>
		<div class="media-gallery-preview" :class="{'has-items': ids.length}" v-if="multiple">
			<div class="media-gallery-list">
				<div class="media-gallery-list--item" v-for="image in thumbnails">
					<img class="media-gallery-list--item-image" :src="image" alt="">
				</div>
			</div>
		</div>
		<template v-if="!multiple">
			<div v-html="getImage(value)" style="display: none;"></div>
			<div class="media-gallery-preview is-single-image" :class="{'has-items': !!imageSrc}" v-if="!!imageSrc">
				<div class="media-gallery-list">
					<div class="media-gallery-list--item">
						<img class="media-gallery-list--item-image" :src="imageSrc" alt="">
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
	export default {
		name: "MediaUploader",
		props: {
			buttonText: {type: String, default: 'Add Image'},
			multiple: {type: Boolean, default: false},
			modalTitle: {type: String, default: 'Add Image'},
			modalButtonText: {type: String, default: 'Add image'},
			value: {type: [String, Number], default: ''},
		},
		data() {
			return {
				ids: [],
				images: [],
				imageSrc: '',
			}
		},
		computed: {
			formatted_value() {
				let value = parseInt(this.value);
				return [value];
			},
			images_ids() {
				if (!this.multiple) {
					return this.ids.length ? this.ids[0] : '';
				}
				return this.ids;
			},
			thumbnails() {
				return this.images.map((image) => {
					if (image.thumbnail) {
						return image.thumbnail.url;
					}
					if (image.full) {
						return image.full.url;
					}
				});
			}
		},
		mounted() {
			if (this.value) {
				this.getImages(this.formatted_value);
			}
			let self = this, button = self.$el.querySelector('.media-uploader-button');
			button.addEventListener('click', function (event) {
				event.preventDefault();
				// Accepts an optional object hash to override default values.
				let frame = new wp.media({
					frame: 'select',
					title: self.modalTitle,
					multiple: self.multiple,

					library: {
						order: 'ASC',
						orderby: 'title',
						type: 'image',
						search: null,
						uploadedTo: null
					},

					button: {
						text: self.modalButtonText
					}
				});

				frame.on('select', function () {

					let collection = frame.state().get('selection'),
							ids = [], sizes = [];

					collection.each(function (attachment) {
						ids.push(attachment.id);
						sizes.push(attachment.attributes.sizes);
					});

					self.ids = ids;
					self.images = sizes;
					self.$emit('input', self.images_ids);
				});

				// Open the modal.
				frame.open();
			});
		},
		methods: {
			getImage(imageId) {
				let wpApiSettings = window.wpApiSettings, $ = window.jQuery, self = this;
				let url = wpApiSettings.root + wpApiSettings.versionString + 'media/' + imageId;
				let nonce = wpApiSettings.nonce;
				$.ajax({
					url: url,
					method: 'GET',
					success: function (response) {
						if (response.source_url) {
							self.imageSrc = response.source_url;
						}
					}
				});
			},
			getImages(include) {
				let wpApiSettings = window.wpApiSettings, $ = window.jQuery, self = this;
				let url = wpApiSettings.root + wpApiSettings.versionString + 'media';
				let nonce = wpApiSettings.nonce;

				$.ajax({
					url: url,
					method: 'GET',
					data: {
						include: include,
					},
					success: function (response) {
						console.log(response);
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.media-gallery-preview {
		display: flex;
		flex-wrap: wrap;

		&.has-items {
			margin: 10px 0;
		}
	}

	.media-gallery-list {
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		margin-left: -5px;
		margin-right: -5px;

		&--item {
			display: inline-block;
			background: #fff;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
			margin: 5px;
		}

		&--item-image {
			margin: 5px;
			display: block;
			height: auto;
			max-height: 48px;
			width: 48px;
		}
	}
</style>
