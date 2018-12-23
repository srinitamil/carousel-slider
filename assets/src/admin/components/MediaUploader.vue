<template>
	<div class="media-gallery-container">
		<div class="media-gallery-status-status">
			<template v-if="has_image">
				<span class="media-gallery-status-title">{{count_images}} Images Selected</span>
				<span class="media-gallery-clear" @click="clearImages">(Clear)</span>
			</template>
			<template v-if="!has_image">
				<span class="media-gallery-status-title">No Images Selected</span>
			</template>
		</div>
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
		<div class="media-gallery-button">
			<mdl-button @click="openMediaFrame" type="raised" color="default">{{buttonText}}</mdl-button>
		</div>
	</div>
</template>

<script>
	import mdlButton from '../../material-design-lite/button/mdlButton.vue';

	export default {
		name: "MediaUploader",
		components: {mdlButton},
		props: {
			buttonText: {type: String, default: 'Add Images'},
			multiple: {type: Boolean, default: false},
			modalTitle: {type: String, default: 'Add Images'},
			modalButtonText: {type: String, default: 'Add images'},
			value: {type: Array, default: []},
		},
		data() {
			return {
				ids: [],
				images: [],
				imageSrc: '',
			}
		},
		computed: {
			count_images() {
				return this.value.length;
			},
			has_image() {
				return this.count_images > 0;
			},
			images_ids() {
				if (!this.multiple) {
					return this.ids.length ? this.ids[0] : '';
				}
				return this.ids;
			},
			thumbnails() {
				return this.images.map((image) => {
					if (typeof image.thumbnail.source_url !== "undefined") {
						return image.thumbnail.source_url;
					}
					if (typeof image.thumbnail.url !== "undefined") {
						return image.thumbnail.url;
					}
					if (typeof image.full.source_url !== "undefined") {
						return image.full.source_url;
					}
					if (typeof image.full.url !== "undefined") {
						return image.full.url;
					}
				});
			}
		},
		mounted() {
			if (this.value) {
				this.ids = this.value;
				this.getImages(this.value);
			}
		},
		methods: {
			loadImages(ids) {
				if (!ids) {
					return false;
				}
				let shortcode = new wp.shortcode({
					tag: 'gallery',
					attrs: {ids: ids},
					type: 'single'
				});

				let attachments = wp.media.gallery.attachments(shortcode);

				let selection = new wp.media.model.Selection(attachments.models, {
					props: attachments.props.toJSON(),
					multiple: true
				});

				selection.gallery = attachments.gallery;

				selection.more().done(function () {
					// Break ties with the query.
					selection.props.set({query: false});
					selection.unmirror();
					selection.props.unset('orderby');
				});

				return selection;
			},
			openMediaFrame() {
				let self = this, frame;
				let options = {
					frame: 'select',
					title: self.modalTitle,
					multiple: self.multiple,
					button: {text: self.modalButtonText}
				};

				frame = new wp.media(options).open();

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
			},
			getImage(imageId) {
				let wpApiSettings = window.wpApiSettings, $ = window.jQuery, self = this;
				let url = wpApiSettings.root + wpApiSettings.versionString + 'media/' + imageId;
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

				$.ajax({
					url: url,
					method: 'GET',
					data: {
						include: include,
					},
					success: function (images) {
						images.forEach((element) => {
							if (typeof element.media_details.sizes != "undefined") {
								self.images.push(element.media_details.sizes);
							} else {
								self.images.push({full: {url: element.source_url}});
							}
						});
					}
				});
			},
			clearImages() {
				if (confirm('Are you sure?')) {
					this.ids = [];
					this.images = [];
					this.$emit('input', []);
				}
			}
		}
	}
</script>

<style lang="scss">
	.media-gallery {
		&-button {
			margin-top: 15px;

			.mdl-button {
				width: 100%;
			}
		}

		&-clear {
			color: #b01b1b;
			cursor: pointer;
		}
	}

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
