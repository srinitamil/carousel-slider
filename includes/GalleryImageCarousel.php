<?php

namespace CarouselSlider;

use CarouselSlider\Abstracts\Carousel;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class GalleryImageCarousel extends Carousel {

	/**
	 * Represent current class as array
	 *
	 * @return array
	 */
	public function to_array() {
		$data                       = parent::to_array();
		$data['show_image_title']   = $this->show_image_title();
		$data['show_image_caption'] = $this->show_image_caption();
		$data['show_lightbox']      = $this->show_lightbox();
		$data['image_target']       = $this->get_image_target();
		$data['images']             = $this->get_images();

		return $data;
	}

	/**
	 * Get images ids
	 *
	 * @return array
	 */
	public function get_images_ids() {
		return $this->get_prop( 'images_ids' );
	}

	/**
	 * Show image title
	 *
	 * @return bool
	 */
	public function show_image_title() {
		return $this->is_checked( $this->get_prop( 'show_image_title' ) );
	}

	/**
	 * Show image caption
	 *
	 * @return bool
	 */
	public function show_image_caption() {
		return $this->is_checked( $this->get_prop( 'show_image_caption' ) );
	}

	/**
	 * Show image lightbox gallery
	 *
	 * @return bool
	 */
	public function show_lightbox() {
		return $this->is_checked( $this->get_prop( 'show_lightbox' ) );
	}

	/**
	 * Get image target
	 *
	 * @return string
	 */
	public function get_image_target() {
		$target = $this->get_prop( 'image_target' );

		return in_array( $target, array( '_self', '_blank' ) ) ? $target : '_self';
	}

	/**
	 * Get images
	 *
	 * @return array
	 */
	public function get_images() {
		$images  = array();
		$_images = get_posts( array(
			'post_type'      => 'attachment',
			'post__in'       => $this->get_images_ids(),
			'posts_per_page' => - 1
		) );

		foreach ( $_images as $image ) {
			$image_src      = wp_get_attachment_image_src( $image->ID, $this->get_image_size() );
			$image_link_url = get_post_meta( $image->ID, "_carousel_slider_link_url", true );
			$alt_text       = trim( strip_tags( get_post_meta( $image->ID, '_wp_attachment_image_alt', true ) ) );
			$images[]       = array(
				'id'               => $image->ID,
				'title'            => $image->post_title,
				'caption'          => $image->post_excerpt,
				'image_alt'        => $alt_text,
				'image_target_url' => $image_link_url,
				'image_src'        => $image_src[0],
				'image_width'      => $image_src[1],
				'image_height'     => $image_src[2],
			);
		}

		return $images;
	}

	/**
	 * Read slider data
	 */
	protected function read_slider_data() {
		parent::read_slider_data();
		$this->data['show_image_title']   = $this->get_meta( '_show_attachment_title' );
		$this->data['show_image_caption'] = $this->get_meta( '_show_attachment_caption' );
		$this->data['show_lightbox']      = $this->get_meta( '_image_lightbox' );
		$this->data['image_target']       = $this->get_meta( '_image_target' );
		$this->data['images_ids']         = $this->get_images_ids_meta();
	}

	/**
	 * Get images ids
	 *
	 * @return array
	 */
	protected function get_images_ids_meta() {
		$new        = $this->get_meta( '_images_ids' );
		$old        = $this->get_meta( '_wpdh_image_ids' );
		$images_ids = ! empty( $new ) ? $new : $old;
		$images_ids = is_string( $images_ids ) ? explode( ',', $images_ids ) : $images_ids;
		$images_ids = count( $images_ids ) ? array_filter( array_map( 'intval', $images_ids ) ) : array();

		return $images_ids;
	}

	/**
	 * Get properties to meta keys
	 *
	 * @return array
	 */
	protected static function props_to_meta_key() {
		$keys = parent::props_to_meta_key();

		$keys['images_ids']         = '_images_ids';
		$keys['show_image_title']   = '_show_attachment_title';
		$keys['show_image_caption'] = '_show_attachment_caption';
		$keys['show_lightbox']      = '_image_lightbox';
		$keys['image_target']       = '_image_target';

		return $keys;
	}
}
