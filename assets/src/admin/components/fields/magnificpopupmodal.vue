<template>

	<div class="Modal mfp-hide" ref="modal">
		<div class="Modal__inner">
			<slot></slot>
		</div>
	</div>

</template>


<script>
	import _ from 'underscore'
	import $ from 'jquery'
	import 'magnific-popup'
	export default {
		name: 'magnific-popup-modal',
		props: {
			show: {
				type: Boolean,
				default: false
			},
			config: {
				type: Object,
				default: function () {
					return {
						// magnific defaults
						disableOn: null,
						mainClass: '',
						preloader: true,
						focus: '',
						closeOnContentClick: false,
						closeOnBgClick: false,
						closeBtnInside: true,
						showCloseBtn: true,
						enableEscapeKey: true,
						modal: false,
						alignTop: false,
						index: null,
						fixedContentPos: 'auto',
						fixedBgPos: 'auto',
						overflowY: 'auto',
						removalDelay: 0,
						// closeMarkup: '',
						// prependTo: document.body,
						autoFocusLast: true
					}
				}
			}
		},
		data () {
			return {
				visible: this.show
			}
		},
		mounted () {
			this[this.visible ? 'open' : 'close']()
		},
		methods: {
			/**
			 * Opens the modal
			 * @param {object} options Last chance to define options on this call to Magnific Popup's open() method
			 */
			open: function (options) {
				if (!!$.magnificPopup.instance.isOpen && this.visible) {
					return
				}
				let root = this
				let config = _.extend(
						this.config,
						{
							items: {
								src: $(this.$refs.modal),
								type: 'inline'
							},
							callbacks: {
								open: function () {
									root.visible = true
									root.$emit('open')
								},
								close: root.close
							}
						},
						options || {})
				$.magnificPopup.open(config)
			},
			/**
			 * Closes the modal
			 */
			close: function () {
				if (!$.magnificPopup.instance.isOpen && !this.visible) {
					return
				}
				this.visible = false
				$.magnificPopup.close()
				this.$emit('close')
			},
			/**
			 * Toggles modal open/closed
			 */
			toggle: function () {
				this[this.visible ? 'close' : 'open']()
			}
		}
	}
</script>


<style lang="scss">
	@import './node_modules/magnific-popup/src/css/main.scss';
	.mfp-content {
		text-align: center;
	}
	$module: '.Modal';
	#{$module} {
		display: inline-block;
		position: relative;
		&__inner {
			display: inline-block;
			text-align: left;
		}
		.mfp-close {
			width: auto;
			height: auto;
			font-size: 2em;
			line-height: 1;
			position: absolute;
			top: auto;
			right: auto;
			bottom: 100%;
			left: 100%;
			color: #fff;
			opacity: 1;
		}
	}
</style>
