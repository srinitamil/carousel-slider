<?php

namespace CarouselSlider;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class GutenbergBlock {

	/**
	 * @var self
	 */
	private static $instance;

	/**
	 * Ensures only one instance of this class is loaded or can be loaded.
	 *
	 * @return self
	 */
	public static function init() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();

			add_filter( 'block_categories', array( self::$instance, 'block_categories' ), 10, 2 );
			add_action( 'init', array( self::$instance, 'register_block_type' ) );
		}

		return self::$instance;
	}

	/**
	 * Filter the default array of block categories.
	 *
	 * @param array $default_categories Array of block categories.
	 * @param \WP_Post $post Post being loaded.
	 *
	 * @return array
	 */
	public function block_categories( $default_categories, $post ) {
		return array_merge( $default_categories,
			array(
				array(
					'slug'  => 'carousel-slider',
					'title' => __( 'Carousel Slider', 'carousel-slider' ),
					'icon'  => 'dashicons-slides',
				),
			)
		);
	}

	public function register_block_type() {
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}
		wp_register_script( 'carousel-slider-gutenberg-block',
			CAROUSEL_SLIDER_ASSETS . '/blocks/image-carousel-block.js',
			array( 'wp-blocks', 'wp-element', 'wp-components' )
		);

		wp_register_style( 'carousel-slider-gutenberg-block',
			CAROUSEL_SLIDER_ASSETS . '/blocks/image-carousel-block.css',
			array( 'wp-edit-blocks' )
		);

		wp_localize_script( 'carousel-slider-gutenberg-block', 'carousel_slider_i18n',
			self::block()
		);

		register_block_type( 'carousel-slider/slider', array(
			'editor_script' => 'carousel-slider-gutenberg-block',
			'editor_style'  => 'carousel-slider-gutenberg-block',
		) );
	}

	private static function block() {
		$_sliders = get_posts( array(
			'posts_per_page' => - 1,
			'orderby'        => 'date',
			'order'          => 'DESC',
			'post_type'      => 'carousels',
			'post_status'    => 'publish',
		) );

		$sliders = array(
			array(
				'value' => '',
				'label' => '-- Choose a slider --',
			)
		);
		foreach ( $_sliders as $form ) {
			if ( ! $form instanceof \WP_Post ) {
				continue;
			}

			$sliders[] = array(
				'value' => intval( $form->ID ),
				'label' => get_the_title( $form ),
			);
		}

		return array(
			'sliders'         => $sliders,
			'site_url'        => site_url( '/' ),
			'block_logo'      => CAROUSEL_SLIDER_ASSETS . '/img/logo.svg',
			'block_title'     => __( 'Carousel Slider', 'carousel-slider' ),
			'selected_slider' => __( 'Selected Slider', 'carousel-slider' ),
		);
	}
}