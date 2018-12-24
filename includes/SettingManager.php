<?php

namespace CarouselSlider;

use CarouselSlider\Supports\Collection;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class SettingManager extends Collection {
	/**
	 * @var ViewManager
	 */
	private static $instance;

	/**
	 * @return ViewManager
	 */
	public static function init() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * ModuleManager constructor.
	 */
	public function __construct() {
		$this->set( 'image-carousel', 'CarouselSlider\\Modules\\ImageCarousel\\Setting' );
		$this->set( 'image-carousel-url', 'CarouselSlider\\Modules\\ImageCarouselUrl\\Setting' );

		/**
		 * Give other plugin option to add their own action(s)
		 */
		do_action( 'carousel_slider/modules/settings', $this );
	}

	/**
	 * Get collection item for key
	 *
	 * @param string $key The data key
	 * @param mixed $default The default value to return if data key does not exist
	 *
	 * @return mixed The key's value, or the default value
	 */
	public function get( $key, $default = null ) {
		if ( ! $this->has( $key ) ) {
			return $default;
		}

		return '\\' . ltrim( $this->collections[ $key ], '\\' );
	}
}
