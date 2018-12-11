<?php

namespace CarouselSlider;

use CarouselSlider\Supports\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Test {

	/**
	 * The instance of the class
	 *
	 * @var self
	 */
	private static $instance;

	/**
	 * Only one instance of the class can be loaded
	 *
	 * @return self
	 */
	public static function init() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();

			add_action( 'wp_ajax_carousel_slider_test', array( self::$instance, 'test' ) );
			add_action( 'wp_ajax_nopriv_carousel_slider_test', array( self::$instance, 'test' ) );
		}

		return self::$instance;
	}

	public static function test() {
		/** @var \CarouselSlider\Modules\HeroCarousel\Slider $slider */
		$slider = Utils::get_slider( 1522 );
		wp_send_json( $slider );
		die();
	}
}