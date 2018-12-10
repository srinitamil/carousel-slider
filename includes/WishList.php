<?php

namespace CarouselSlider;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class WishList {

	/**
	 * Show YITH Wishlist button on product slider
	 *
	 * @param \WC_Product $product
	 * @param \WP_Post $post
	 * @param $slider_id
	 */
	public static function button( $product, $post, $slider_id ) {
		$_product_wish_list = get_post_meta( $slider_id, '_product_wishlist', true );

		if ( defined( 'WC_VERSION' ) && version_compare( WC_VERSION, '3.0.0', '>=' ) ) {
			$product_id = $product->get_id();
		} else {
			$product_id = $post->ID;
		}

		if ( class_exists( 'YITH_WCWL' ) && $_product_wish_list == 'on' ) {
			echo do_shortcode( '[yith_wcwl_add_to_wishlist product_id="' . $product_id . '"]' );
		}
	}
}
