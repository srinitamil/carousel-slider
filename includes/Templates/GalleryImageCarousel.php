<?php

namespace CarouselSlider\Templates;

use CarouselSlider\Supports\Utils;

class GalleryImageCarousel {

	/**
	 * Create gallery image carousel with random images
	 *
	 * @param string $slider_title
	 * @param array $args
	 *
	 * @return int The post ID on success. The value 0 on failure.
	 */
	public static function create( $slider_title = null, $args = array() ) {
		$images = self::get_images();
		$ids    = wp_list_pluck( $images, 'id' );
		$ids    = is_array( $ids ) ? implode( ',', $ids ) : $ids;

		if ( empty( $slider_title ) ) {
			$slider_title = 'Image Carousel with Dummy Data';
		}

		$default                    = self::get_default_settings();
		$default['_slide_type']     = 'image-carousel';
		$default['_wpdh_image_ids'] = $ids;

		$data = wp_parse_args( $args, $default );

		$post_id = wp_insert_post( array(
			'post_title'     => $slider_title,
			'post_status'    => 'publish',
			'post_type'      => 'carousels',
			'comment_status' => 'closed',
			'ping_status'    => 'closed',
		) );

		if ( ! $post_id ) {
			return 0;
		}

		foreach ( $data as $meta_key => $meta_value ) {
			update_post_meta( $post_id, $meta_key, $meta_value );
		}

		return $post_id;
	}

	/**
	 * Get list of images sorted by its width and height
	 *
	 * @param int $amount
	 * @param string $image_size
	 * @param int $per_page
	 *
	 * @return array
	 */
	public static function get_images( $amount = 10, $image_size = 'full', $per_page = 100 ) {
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

			$src = wp_get_attachment_image_src( $attachment->ID, $image_size );

			$images[] = array(
				'id'           => $attachment->ID,
				'title'        => $attachment->post_title,
				'image_src'    => $src[0],
				'image_width'  => $src[1],
				'image_height' => $src[2],
			);
		}

		$widths  = wp_list_pluck( $images, 'image_width' );
		$heights = wp_list_pluck( $images, 'image_height' );

		// Sort the $images with $widths and $heights descending
		array_multisort( $widths, SORT_DESC, $heights, SORT_DESC, $images );

		if ( $amount ) {
			$images = array_slice( $images, 0, $amount );
		}

		return $images;
	}

	/**
	 * Get default image carousel settings
	 *
	 * @return array
	 */
	public static function get_default_settings() {
		$default = array(
			// Image Carousel Settings
			'_show_attachment_title'       => 'off',
			'_show_attachment_caption'     => 'off',
			'_image_lightbox'              => 'on',
			'_image_target'                => '_self',
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
			'_items'                       => '6',
			'_items_desktop'               => '5',
			'_items_small_desktop'         => '4',
			'_items_portrait_tablet'       => '3',
			'_items_small_portrait_tablet' => '2',
			'_items_portrait_mobile'       => '1',
		);

		return $default;
	}
}
