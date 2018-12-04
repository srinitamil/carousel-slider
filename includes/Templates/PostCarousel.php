<?php

namespace CarouselSlider\Templates;

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

class PostCarousel extends Template {

	/**
	 * Get default image carousel settings
	 *
	 * @return array
	 */
	public static function get_default_settings() {
		$settings = wp_parse_args( array(
			'_slide_type'       => 'post-carousel',
			// Post Carousel Settings
			'_post_query_type'  => 'latest_posts',
			'_post_date_after'  => '',
			'_post_date_before' => '',
			'_post_categories'  => '',
			'_post_tags'        => '',
			'_post_in'          => '',
			'_posts_per_page'   => '12',
			'_post_orderby'     => 'ID',
			'_post_order'       => 'DESC',
			'_post_height'      => '450',
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
			$slider_title = 'Post Carousel with Latest Post';
		}

		$post_id = Template::create_slider( $slider_title );

		if ( ! $post_id ) {
			return 0;
		}

		$data       = wp_parse_args( $args, self::get_default_settings() );
		$query_type = $data['_post_query_type'];

		if ( 'specific_posts' == $query_type ) {
			if ( empty( $data['_post_in'] ) ) {
				$posts_ids        = self::get_random_posts_ids();
				$posts_ids        = is_array( $posts_ids ) ? implode( ',', $posts_ids ) : $posts_ids;
				$data['_post_in'] = $posts_ids;
			}
		}

		if ( 'post_categories' == $query_type ) {
			if ( empty( $data['_post_categories'] ) ) {
				$categories_ids           = self::get_post_categories_ids();
				$categories_ids           = is_array( $categories_ids ) ? implode( ',', $categories_ids ) : $categories_ids;
				$data['_post_categories'] = $categories_ids;
			}
		}

		if ( 'post_tags' == $query_type ) {
			if ( empty( $data['_post_tags'] ) ) {
				$tags_ids           = self::get_post_tags_ids();
				$tags_ids           = is_array( $tags_ids ) ? implode( ',', $tags_ids ) : $tags_ids;
				$data['_post_tags'] = $tags_ids;
			}
		}

		if ( 'date_range' == $query_type ) {
			if ( empty( $data['_post_date_after'] ) ) {
				$data['_post_date_after'] = date( 'Y-m-d', strtotime( '-3 years' ) );
			}

			if ( empty( $data['_post_date_before'] ) ) {
				$data['_post_date_before'] = date( 'Y-m-d', strtotime( '-2 hours' ) );
			}
		}

		foreach ( $data as $meta_key => $meta_value ) {
			update_post_meta( $post_id, $meta_key, $meta_value );
		}

		return $post_id;
	}

	/**
	 * Get random posts ID
	 *
	 * @param int $per_page
	 *
	 * @return array List of posts ID.
	 */
	private static function get_random_posts_ids( $per_page = 10 ) {
		$args = array(
			'post_type'      => 'post',
			'post_status'    => 'publish',
			'orderby'        => 'rand',
			'posts_per_page' => $per_page,
		);

		$_posts    = get_posts( $args );
		$posts_ids = wp_list_pluck( $_posts, 'ID' );

		return $posts_ids;
	}

	/**
	 * Get random post categories id
	 *
	 * @param int $per_page
	 *
	 * @return array List of categories id.
	 */
	private static function get_post_categories_ids( $per_page = 5 ) {
		$terms     = get_terms( array(
			'taxonomy'   => 'category',
			'hide_empty' => true,
			'number'     => $per_page,
		) );
		$terms_ids = wp_list_pluck( $terms, 'term_id' );

		return $terms_ids;
	}

	/**
	 * Get random post tags id
	 *
	 * @param int $per_page
	 *
	 * @return array|\WP_Term[] List of tags id.
	 */
	private static function get_post_tags_ids( $per_page = 5 ) {
		$terms     = get_terms( array(
			'taxonomy'   => 'post_tag',
			'hide_empty' => true,
			'number'     => $per_page,
		) );
		$terms_ids = wp_list_pluck( $terms, 'term_id' );

		return $terms_ids;
	}
}
