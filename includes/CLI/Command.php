<?php

namespace CarouselSlider\CLI;

use CarouselSlider\Templates\GalleryImageCarousel;
use WP_CLI;
use WP_CLI_Command;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Command extends WP_CLI_Command {
	/**
	 * Display Carousel Slider Information
	 *
	 * @subcommand info
	 */
	public function info() {
		WP_CLI::success( 'Welcome to the Carousel Slider WP-CLI Extension!' );
		WP_CLI::line( '' );
		WP_CLI::line( '- Carousel Slider Version: ' . CAROUSEL_SLIDER_VERSION );
		WP_CLI::line( '- Carousel Slider Directory: ' . CAROUSEL_SLIDER_PATH );
		WP_CLI::line( '- Carousel Slider Public URL: ' . CAROUSEL_SLIDER_URL );
		WP_CLI::line( '' );
	}

	/**
	 * Create Slider
	 *
	 * ## OPTIONS
	 *
	 * <name>
	 * : The name of the slider to create.
	 *
	 * [--type=<type>]
	 * : Carousel slider slider type.
	 * ---
	 * default: image-carousel
	 * options:
	 *  - image-carousel
	 *  - image-carousel-url
	 *  - post-carousel
	 *  - product-carousel
	 *  - video-carousel
	 *  - hero-banner-slider
	 * ---
	 *
	 * ## EXAMPLES
	 *    wp carousel-slider create_slider --type='post-carousel'
	 */
	public function create_slider( $args, $assoc_args ) {
		$slider_id = 0;
		list( $slider_title ) = $args;
		$type = $assoc_args['type'];

		if ( 'image-carousel' == $type ) {
			$slider_id = GalleryImageCarousel::create( $slider_title );
		}

		if ( ! $slider_id ) {
			WP_CLI::error( __( 'Could not create slider.', 'carousel-slider' ) );

			return;
		}

		$response = sprintf( __( "#%s - %s has been created successfully.", "carousel-slider" ), $slider_id, $slider_title );
		WP_CLI::success( $response );
	}

	/**
	 * Delete a slider by slider id
	 *
	 * ## OPTIONS
	 *
	 * <id>
	 * : The slider id.
	 *
	 * @param $args
	 */
	public function delete_slider( $args ) {
		list( $id ) = $args;

		if ( wp_delete_post( $id, true ) ) {
			WP_CLI::success( "#{$id} has been deleted successfully." );
		}
	}

	/**
	 * Delete all sliders
	 */
	public function delete_sliders() {
		WP_CLI::success( 'Carousel Slider: all sliders has been deleted successfully.' );
	}
}
