<?php

namespace CarouselSlider;

use CarouselSlider\Modules\HeroCarousel\HeroCarousel;
use CarouselSlider\Modules\ImageCarousel\ImageCarousel;
use CarouselSlider\Supports\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Test {
	private static $instance;

	public static function init() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();

			add_action( 'wp_ajax_carousel_slider_test', array( self::$instance, 'test' ) );
			add_action( 'wp_ajax_nopriv_carousel_slider_test', array( self::$instance, 'test' ) );
		}

		return self::$instance;
	}

	public static function test() {
		/** @var HeroCarousel $slider */
		$slider = Utils::get_slider( 2465 );
		var_dump( $slider->get_content() );
		die();
	}
}