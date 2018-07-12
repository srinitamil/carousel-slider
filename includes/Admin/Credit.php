<?php

namespace CarouselSlider\Admin;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Credit {

	/**
	 * @var Credit
	 */
	private static $instance;

	/**
	 * Ensures only one instance of this class is loaded or can be loaded.
	 *
	 * @return Credit
	 */
	public static function init() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();

			add_filter( 'admin_footer_text', array( self::$instance, 'admin_footer_text' ) );
		}

		return self::$instance;
	}

	/**
	 * Add custom footer text on plugins page.
	 *
	 * @param string $text
	 *
	 * @return string
	 */
	public function admin_footer_text( $text ) {
		global $post_type, $hook_suffix;

		$footer_text = sprintf(
			__( 'If you like %1$s Carousel Slider %2$s please leave us a %3$s rating. A huge thanks in advance!', 'carousel-slider' ),
			'<strong>',
			'</strong>',
			'<a href="https://wordpress.org/support/view/plugin-reviews/carousel-slider?filter=5#postform" target="_blank" data-rated="Thanks :)">&starf;&starf;&starf;&starf;&starf;</a>'
		);

		if ( $post_type == 'carousels' || $hook_suffix == 'carousels_page_carousel-slider-documentation' ) {
			return $footer_text;
		}

		return $text;
	}
}
