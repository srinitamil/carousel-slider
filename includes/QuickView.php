<?php

namespace CarouselSlider;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class QuickView {

	/**
	 * Show quick view button on product slider
	 *
	 * @param \WC_Product $product
	 * @param \WP_Post $post
	 * @param $slider_id
	 */
	public static function button( $product, $post, $slider_id ) {
		$_show_btn = get_post_meta( $slider_id, '_product_quick_view', true );

		if ( $_show_btn == 'on' ) {

			if ( defined( 'WC_VERSION' ) && version_compare( WC_VERSION, '3.0.0', '>=' ) ) {
				$product_id = $product->get_id();
			} else {
				$product_id = $post->ID;
			}

			wp_enqueue_script( 'magnific-popup' );

			$ajax_url = wp_nonce_url( add_query_arg( array(
				'ajax'       => 'true',
				'action'     => 'carousel_slider_quick_view',
				'product_id' => $product_id,
				'slide_id'   => $slider_id
			), admin_url( 'admin-ajax.php' ) ), 'carousel_slider_quick_view' );

			$quick_view_html = '<div style="clear: both;"></div>';
			$quick_view_html .= sprintf(
				'<a class="magnific-popup button quick_view" href="%1$s" data-product-id="%2$s">%3$s</a>',
				$ajax_url,
				$product_id,
				__( 'Quick View', 'carousel-slider' )
			);
			echo apply_filters( 'carousel_slider_product_quick_view', $quick_view_html, $product );
		}
	}

	/**
	 * Display quick view popup content
	 */
	public static function product() {
		if ( ! isset( $_GET['_wpnonce'], $_GET['product_id'], $_GET['slide_id'] ) ) {
			wp_die();
		}

		if ( ! wp_verify_nonce( $_GET['_wpnonce'], 'carousel_slider_quick_view' ) ) {
			wp_die();
		}

		global $product;
		$product = wc_get_product( intval( $_GET['product_id'] ) );

		?>
        <div id="pmid-<?php echo intval( $_GET['slide_id'] ); ?>" class="product carousel-slider__product-modal">

            <div class="images">
				<?php echo get_the_post_thumbnail( $product->get_id(), 'medium_large' ); ?>
				<?php if ( $product->is_on_sale() ) : ?>
					<?php echo apply_filters( 'woocommerce_sale_flash',
						'<span class="onsale">' . __( 'Sale!', 'carousel-slider' ) . '</span>', $product ); ?>
				<?php endif; ?>
            </div>

            <div class="summary entry-summary">

                <h1 class="product_title entry-title">
					<?php echo esc_attr( $product->get_title() ); ?>
                </h1>

                <div class="woocommerce-product-rating">
					<?php
					// Check if WooCommerce Version 3.0.0 or higher
					if ( function_exists( 'wc_get_rating_html' ) ) {
						echo wc_get_rating_html( $product->get_average_rating() );
					} elseif ( method_exists( $product, 'get_rating_html' ) ) {
						echo $product->get_rating_html();
					}
					?>
                </div>

                <div class="price">
					<?php
					if ( $product->get_price_html() ) {
						echo $product->get_price_html();
					}
					?>
                </div>

                <div class="description">
					<?php
					echo '<div style="clear: both;"></div>';
					echo apply_filters( 'woocommerce_short_description', $product->get_description() );
					?>
                </div>

                <div>
					<?php
					// Show button
					echo '<div style="clear: both;"></div>';
					if ( function_exists( 'woocommerce_template_loop_add_to_cart' ) ) {
						woocommerce_template_loop_add_to_cart();
					}
					?>
                </div>

            </div>
        </div>
		<?php
		wp_die();
	}
}
