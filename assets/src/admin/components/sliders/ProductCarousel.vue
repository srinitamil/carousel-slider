<template>
	<div :class="outer_classes" :style="btnStyles">
		<div :id='slider_id' :class='slider_classes' data-carousel_slider="true" :data-slide-type='options.type'>
			<div class="carousel-slider-product" v-for="product in options.products">
				<a class="carousel-slider-product__thumbnail" v-if="product.guid" :href="product.guid">
					<img :src="product.product_thumbnail" :alt="product.product_name">
				</a>
				<h2 class="carousel-slider-product__title">{{product.product_title}}</h2>
				<div v-html="product.product_price"> </div>
				<div v-html="product.add_to_cart"> </div>

			</div>
		</div>
	</div>
</template>

<script>
	import {carousel} from './carousel.js';

	export default {
		name: "ProductCarousel",
		mixins: [carousel],
		props: {
			options: {type: Object, required: true}
		},
		watch: {
			options(newValue, oldValue) {
				this.rebuildCarousel();
				console.log(newValue);
			}
		},
		mounted() {
			this.initCarousel();
		},
		methods: {
			dateToHuman(dateString) {
				let dateTime = new Date(dateString);
				return dateTime.toDateString();
			}
		}
	}
</script>

<style lang="scss">
	.carousel-slider-outer p.product.woocommerce.add_to_cart_inline {
			border: none !important;
			padding: 0px !important;
		}

	.carousel-slider-outer span.woocommerce-Price-amount.amount {
		display: block;
		margin-bottom: 15px;
	}

</style>
