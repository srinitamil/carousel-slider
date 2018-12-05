<?php

namespace CarouselSlider\CLI;

use CarouselSlider\Supports\Utils;
use CarouselSlider\Templates\GalleryImageCarousel;
use CarouselSlider\Templates\HeroCarousel;
use CarouselSlider\Templates\PostCarousel;
use CarouselSlider\Templates\ProductCarousel;
use CarouselSlider\Templates\UrlImageCarousel;
use CarouselSlider\Templates\VideoCarousel;
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
	 * [--post-query=<post-query>]
	 * : Post carousel query type.
	 * ---
	 * default: latest_posts
	 * options:
	 *  - latest_posts
	 *  - date_range
	 *  - post_categories
	 *  - post_tags
	 *  - specific_posts
	 * ---
	 *
	 * [--date-from=<date-from>]
	 * : Post carousel query starting date.
	 *
	 * [--date-to=<date-to>]
	 * : Post carousel query starting date.
	 *
	 * [--post-categories=<post-categories>]
	 * : Comma separated post category id
	 *
	 * [--post-tags=<post-tags>]
	 * : Comma separated post tag id
	 *
	 * [--post-in=<post-in>]
	 * : Comma separated post id
	 *
	 * ## EXAMPLES
	 *
	 * wp carousel-slider create_slider 'Post Carousel - LP' --type='post-carousel'
	 * wp carousel-slider create_slider 'Post Carousel - LP' --type='post-carousel' --post-query='latest_posts'
	 * wp carousel-slider create_slider 'Post Carousel - SP' --type='post-carousel' --post-query='specific_posts'
	 * wp carousel-slider create_slider 'Post Carousel - DR' --type='post-carousel' --post-query='date_range'
	 * wp carousel-slider create_slider 'Post Carousel - PC' --type='post-carousel' --post-query='post_categories'
	 * wp carousel-slider create_slider 'Post Carousel - PT' --type='post-carousel' --post-query='post_tags'
	 */
	public function create_slider( $args, $assoc_args ) {
		$slider_id = 0;
		list( $slider_title ) = $args;
		$type       = ! empty( $assoc_args['type'] ) ? $assoc_args['type'] : 'image-carousel';
		$post_query = ! empty( $assoc_args['post-query'] ) ? $assoc_args['post-query'] : 'latest_posts';

		if ( 'image-carousel' == $type ) {
			$slider_id = GalleryImageCarousel::create( $slider_title, array(
				'_created_via' => 'wp-cli',
			) );
		}

		if ( 'image-carousel-url' == $type ) {
			$slider_id = UrlImageCarousel::create( $slider_title, array(
				'_created_via' => 'wp-cli',
			) );
		}

		if ( 'video-carousel' == $type ) {
			$slider_id = VideoCarousel::create( $slider_title, array(
				'_created_via' => 'wp-cli',
			) );
		}

		if ( 'post-carousel' == $type ) {
			$date_from       = ! empty( $assoc_args['date-from'] ) ? $assoc_args['date-from'] : '';
			$date_to         = ! empty( $assoc_args['date-to'] ) ? $assoc_args['date-to'] : '';
			$post_categories = ! empty( $assoc_args['post-categories'] ) ? $assoc_args['post-categories'] : '';
			$post_tags       = ! empty( $assoc_args['post-tags'] ) ? $assoc_args['post-tags'] : '';
			$post_in         = ! empty( $assoc_args['post-in'] ) ? $assoc_args['post-in'] : '';
			$post_args       = array(
				'_created_via'      => 'wp-cli',
				'_post_query_type'  => $post_query,
				'_post_date_after'  => $date_from,
				'_post_date_before' => $date_to,
				'_post_categories'  => $post_categories,
				'_post_tags'        => $post_tags,
				'_post_in'          => $post_in,
			);

			$slider_id = PostCarousel::create( $slider_title, $post_args );
		}

		if ( ! $slider_id ) {
			WP_CLI::error( __( 'Could not create slider.', 'carousel-slider' ) );

			return;
		}

		$response = sprintf( __( "#%s - %s has been created successfully.", "carousel-slider" ), $slider_id, $slider_title );
		WP_CLI::success( $response );
	}

	/**
	 * Create sliders for testing
	 */
	public function create_sliders() {
		$ids     = array();
		$sliders = array(
			array( 'type' => 'hero-banner-slider', 'title' => 'Test: Hero Carousel', 'args' => array() ),
			array( 'type' => 'image-carousel', 'title' => 'Test: Image Carousel - Gallery', 'args' => array() ),
			array( 'type' => 'image-carousel-url', 'title' => 'Test: Image Carousel - URL', 'args' => array() ),
			array( 'type' => 'video-carousel', 'title' => 'Test: Video Carousel - Youtube', 'args' => array() ),
			// Post Carousel
			array(
				'type'  => 'post-carousel',
				'title' => 'Test: Post Carousel - Latest Posts',
				'args'  => array( '_post_query_type' => 'latest_posts' )
			),
			array(
				'type'  => 'post-carousel',
				'title' => 'Test: Post Carousel - Date Range',
				'args'  => array( '_post_query_type' => 'date_range' )
			),
			array(
				'type'  => 'post-carousel',
				'title' => 'Test: Post Carousel - Categories',
				'args'  => array( '_post_query_type' => 'post_categories' )
			),
			array(
				'type'  => 'post-carousel',
				'title' => 'Test: Post Carousel - Tags',
				'args'  => array( '_post_query_type' => 'post_tags' )
			),
			array(
				'type'  => 'post-carousel',
				'title' => 'Test: Post Carousel - IDs',
				'args'  => array( '_post_query_type' => 'specific_posts' )
			),
			// Product Carousel
			array(
				'type'  => 'product-carousel',
				'title' => 'Test: Product Carousel - IDs',
				'args'  => array( '_product_query_type' => 'specific_products' )
			),
			array(
				'type'  => 'product-carousel',
				'title' => 'Test: Product Carousel - Categories',
				'args'  => array( '_product_query_type' => 'product_categories' )
			),
			array(
				'type'  => 'product-carousel',
				'title' => 'Test: Product Carousel - Tags',
				'args'  => array( '_product_query_type' => 'product_tags' )
			),
			array(
				'type'  => 'product-carousel',
				'title' => 'Test: Product Carousel - Recent Products',
				'args'  => array( '_product_query_type' => 'query_product', '_product_query' => 'recent' )
			),
			array(
				'type'  => 'product-carousel',
				'title' => 'Test: Product Carousel - Featured Products',
				'args'  => array( '_product_query_type' => 'query_product', '_product_query' => 'featured' )
			),
			array(
				'type'  => 'product-carousel',
				'title' => 'Test: Product Carousel - Sale Products',
				'args'  => array( '_product_query_type' => 'query_product', '_product_query' => 'sale' )
			),
			array(
				'type'  => 'product-carousel',
				'title' => 'Test: Product Carousel - Best Selling Products',
				'args'  => array( '_product_query_type' => 'query_product', '_product_query' => 'best_selling' )
			),
			array(
				'type'  => 'product-carousel',
				'title' => 'Test: Product Carousel - Top Rated Products',
				'args'  => array( '_product_query_type' => 'query_product', '_product_query' => 'top_rated' )
			),
			array(
				'type'  => 'product-carousel',
				'title' => 'Test: Product Carousel - Product Categories List',
				'args'  => array(
					'_product_query_type' => 'query_product',
					'_product_query'      => 'product_categories_list'
				)
			),
		);

		foreach ( $sliders as $slider ) {
			switch ( $slider['type'] ) {
				case 'image-carousel';
					$ids[] = GalleryImageCarousel::create( $slider['title'], $slider['args'] );
					WP_CLI::line( "{$slider['title']} has been created successfully." );
					break;
				case 'image-carousel-url';
					$ids[] = UrlImageCarousel::create( $slider['title'], $slider['args'] );
					WP_CLI::line( "{$slider['title']} has been created successfully." );
					break;
				case 'video-carousel';
					$ids[] = VideoCarousel::create( $slider['title'], $slider['args'] );
					WP_CLI::line( "{$slider['title']} has been created successfully." );
					break;
				case 'post-carousel';
					$ids[] = PostCarousel::create( $slider['title'], $slider['args'] );
					WP_CLI::line( "{$slider['title']} has been created successfully." );
					break;
				case 'hero-banner-slider';
					$ids[] = HeroCarousel::create( $slider['title'], $slider['args'] );
					WP_CLI::line( "{$slider['title']} has been created successfully." );
					break;
				case 'product-carousel';
					$ids[] = ProductCarousel::create( $slider['title'], $slider['args'] );
					WP_CLI::line( "{$slider['title']} has been created successfully." );
					break;
			}
		}

		Utils::create_test_page( $ids );

		WP_CLI::success( "All test sliders has been created successfully." );
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
		/** @var \WP_Post[] $sliders */
		$sliders = get_posts( array( 'post_type' => 'carousels', 'post_status' => 'any', 'numberposts' => - 1 ) );
		foreach ( $sliders as $slider ) {
			if ( wp_delete_post( $slider->ID, true ) ) {
				WP_CLI::line( "Carousel Slider #{$slider->ID} has been deleted successfully." );
			}
		}
		WP_CLI::success( 'Carousel Slider: all sliders has been deleted successfully.' );
	}
}
