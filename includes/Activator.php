<?php

namespace CarouselSlider;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Fired during plugin activation.
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since   1.6.0
 * @author  Sayful Islam <sayful.islam001@gmail.com>
 */
class Activator {

	/**
	 * @var Activator
	 */
	private static $instance = null;

	/**
	 * Ensures only one instance of this class is loaded or can be loaded.
	 *
	 * @return Activator
	 */
	public static function init() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();

			add_action( 'carousel_slider_activation', array( self::$instance, 'activate' ) );
		}

		return self::$instance;
	}

	/**
	 * Script that should load upon plugin activation
	 */
	public function activate() {
		// Add plugin version to database
		update_option( 'carousel_slider_version', CAROUSEL_SLIDER_VERSION );
	}
}
