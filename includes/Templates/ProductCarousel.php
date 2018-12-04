<?php

namespace CarouselSlider\Templates;

use CarouselSlider\Supports\Utils;

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

class ProductCarousel extends Template {

	/**
	 * Get default image carousel settings
	 *
	 * @return array
	 */
	public static function get_default_settings() {
		$settings = wp_parse_args( array(
			'_slide_type'                => 'product-carousel',
			// Product Carousel Settings
			'_product_query_type'        => 'query_product',
			'_product_query'             => 'recent',
			'_product_categories'        => '',
			'_product_tags'              => '',
			'_product_in'                => '',
			'_products_per_page'         => '12',
			'_product_title'             => 'on',
			'_product_rating'            => 'on',
			'_product_price'             => 'on',
			'_product_cart_button'       => 'on',
			'_product_onsale'            => 'on',
			'_product_wishlist'          => 'off',
			'_product_quick_view'        => 'off',
			'_product_title_color'       => Utils::get_default_setting( 'product_title_color' ),
			'_product_button_bg_color'   => Utils::get_default_setting( 'product_button_bg_color' ),
			'_product_button_text_color' => Utils::get_default_setting( 'product_button_text_color' ),
		), parent::get_default_settings() );

		return $settings;
	}

	/**
	 * Create gallery image carousel with random images
	 *
	 * @param string $slider_title
	 * @param array $args
	 *
	 * @return int The post ID on success. The value 0 on failure.
	 */
	public static function create( $slider_title = null, $args = array() ) {
		if ( empty( $slider_title ) ) {
			$slider_title = 'Product Carousel';
		}

		$post_id = Template::create_slider( $slider_title );

		if ( ! $post_id ) {
			return 0;
		}

		$data       = wp_parse_args( $args, self::get_default_settings() );
		$query_type = $data['_product_query_type'];

		if ( 'specific_products' == $query_type ) {
			if ( empty( $data['_product_in'] ) ) {
				$posts_ids           = self::get_random_products_ids();
				$posts_ids           = is_array( $posts_ids ) ? implode( ',', $posts_ids ) : $posts_ids;
				$data['_product_in'] = $posts_ids;
			}
		}

		if ( 'product_categories' == $query_type ) {
			if ( empty( $data['_product_categories'] ) ) {
				$categories_ids              = self::get_product_categories_ids();
				$categories_ids              = is_array( $categories_ids ) ? implode( ',', $categories_ids ) : $categories_ids;
				$data['_product_categories'] = $categories_ids;
			}
		}

		if ( 'product_tags' == $query_type ) {
			if ( empty( $data['_product_tags'] ) ) {
				$tags_ids              = self::get_product_tags_ids();
				$tags_ids              = is_array( $tags_ids ) ? implode( ',', $tags_ids ) : $tags_ids;
				$data['_product_tags'] = $tags_ids;
			}
		}

		if ( 'query_product' == $query_type ) {
			if ( empty( $data['_product_query'] ) ) {
				$data['_product_query'] = 'recent';
			}
		}

		foreach ( $data as $meta_key => $meta_value ) {
			update_post_meta( $post_id, $meta_key, $meta_value );
		}

		return $post_id;
	}

	/**
	 * Get random products ID
	 *
	 * @param int $per_page
	 *
	 * @return array List of products ID.
	 */
	private static function get_random_products_ids( $per_page = 10 ) {
		$args = array(
			'post_type'      => 'product',
			'post_status'    => 'publish',
			'orderby'        => 'rand',
			'posts_per_page' => $per_page,
		);

		$_posts    = get_posts( $args );
		$posts_ids = wp_list_pluck( $_posts, 'ID' );

		return $posts_ids;
	}

	/**
	 * Get random product categories id
	 *
	 * @param int $per_page
	 *
	 * @return array List of product categories id.
	 */
	private static function get_product_categories_ids( $per_page = 5 ) {
		$terms     = get_terms( array(
			'taxonomy'   => 'product_cat',
			'hide_empty' => true,
			'number'     => $per_page,
		) );
		$terms_ids = wp_list_pluck( $terms, 'term_id' );

		return $terms_ids;
	}

	/**
	 * Get random product tags id
	 *
	 * @param int $per_page
	 *
	 * @return array List of product tags id.
	 */
	private static function get_product_tags_ids( $per_page = 5 ) {
		$terms     = get_terms( array(
			'taxonomy'   => 'product_tag',
			'hide_empty' => true,
			'number'     => $per_page,
		) );
		$terms_ids = wp_list_pluck( $terms, 'term_id' );

		return $terms_ids;
	}
}
