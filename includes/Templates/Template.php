<?php

namespace CarouselSlider\Templates;

use CarouselSlider\Supports\Utils;

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

class Template {
	/**
	 * Get default image carousel settings
	 *
	 * @return array
	 */
	protected static function get_default_settings() {
		$default = array(
			// General Settings
			'_image_size'                  => 'medium',
			'_stage_padding'               => (string) 0,
			'_margin_right'                => (string) Utils::get_default_setting( 'margin_right' ),
			'_lazy_load_image'             => Utils::get_default_setting( 'lazy_load_image' ),
			'_inifnity_loop'               => 'on',
			'_auto_width'                  => 'off',
			// Autoplay Settings
			'_autoplay'                    => 'on',
			'_autoplay_pause'              => 'on',
			'_autoplay_timeout'            => '5000',
			'_autoplay_speed'              => '500',
			// Navigation Settings
			'_nav_button'                  => 'always',
			'_slide_by'                    => 'page',
			'_arrow_position'              => 'outside',
			'_arrow_size'                  => '48',
			'_dot_nav'                     => 'on',// Always
			'_bullet_position'             => 'center',
			'_bullet_size'                 => '10',
			'_bullet_shape'                => 'circle',
			'_nav_color'                   => Utils::get_default_setting( 'nav_color' ),
			'_nav_active_color'            => Utils::get_default_setting( 'nav_active_color' ),
			// Responsive Settings
			'_items_portrait_mobile'       => '1',
			'_items_small_portrait_tablet' => '2',
			'_items_portrait_tablet'       => '3',
			'_items_small_desktop'         => '4',
			'_items_desktop'               => '5',
			'_items'                       => '6',
		);

		return $default;
	}

	/**
	 * Get list of images sorted by its width and height
	 *
	 * @param string $image_size
	 * @param int $per_page
	 *
	 * @return array
	 */
	protected static function get_images( $image_size = 'full', $per_page = 100 ) {
		$args        = array(
			'order'          => 'DESC',
			'post_type'      => 'attachment',
			'post_mime_type' => 'image',
			'post_status'    => 'any',
			'posts_per_page' => $per_page,
		);
		$attachments = get_posts( $args );

		$images = array();

		foreach ( $attachments as $index => $attachment ) {
			if ( ! $attachment instanceof \WP_Post ) {
				continue;
			}

			if ( ! in_array( $attachment->post_mime_type, array( 'image/jpeg', 'image/png' ) ) ) {
				continue;
			}

			$src        = wp_get_attachment_image_src( $attachment->ID, $image_size );
			$_link_url  = get_post_meta( $attachment->ID, '_carousel_slider_link_url', true );
			$_image_alt = get_post_meta( $attachment->ID, '_wp_attachment_image_alt', true );

			$images[] = array(
				'id'           => $attachment->ID,
				'title'        => $attachment->post_title,
				'description'  => $attachment->post_content,
				'caption'      => $attachment->post_excerpt,
				'alt_text'     => $_image_alt,
				'link_url'     => $_link_url,
				'image_src'    => $src[0],
				'image_width'  => $src[1],
				'image_height' => $src[2],
			);
		}

		$widths  = wp_list_pluck( $images, 'image_width' );
		$heights = wp_list_pluck( $images, 'image_height' );

		// Sort the $images with $widths and $heights descending
		array_multisort( $widths, SORT_DESC, $heights, SORT_DESC, $images );

		return $images;
	}

	/**
	 * @param $slider_title
	 *
	 * @return int|\WP_Error The post ID on success. The value 0 or \WP_Error on failure.
	 */
	protected static function create_slider( $slider_title ) {
		$post_id = wp_insert_post( array(
			'post_title'     => $slider_title,
			'post_status'    => 'publish',
			'post_type'      => 'carousels',
			'comment_status' => 'closed',
			'ping_status'    => 'closed',
		) );

		return $post_id;
	}
}