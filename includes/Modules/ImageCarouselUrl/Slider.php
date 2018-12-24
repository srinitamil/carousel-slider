<?php

namespace CarouselSlider\Modules\ImageCarouselUrl;

use CarouselSlider\Abstracts\AbstractSlider;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Slider extends AbstractSlider {
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
		$data['images_urls']        = $this->get_image_urls();
		$data['images']             = $this->get_images();

		return $data;
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
	 * Get image urls
	 *
	 * @return array
	 */
	public function get_image_urls() {
		return $this->get_prop( 'images_urls' );
	}

	/**
	 * Get images
	 *
	 * @return array
	 */
	public function get_images() {
		$_urls = $this->get_image_urls();
		$urls  = array();
		foreach ( $_urls as $url ) {
			@list( $width, $height ) = array( '', '' );

			// If it fails to get width and height from url,
			// It should not generate any error
			try {
				@list( $width, $height ) = getimagesize( $url['url'] );
			} catch ( \Exception $e ) {

			}
			$urls[] = array(
				'title'            => $url['title'],
				'caption'          => $url['caption'],
				'image_alt'        => $url['alt'],
				'image_target_url' => $url['link_url'],
				'image_src'        => $url['url'],
				'image_width'      => $width,
				'image_height'     => $height,
			);
		}


		return $urls;
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
		$this->data['images_urls']        = $this->get_meta( '_images_urls' );
	}

	/**
	 * Get properties to meta keys
	 *
	 * @return array
	 */
	protected static function props_to_meta_key() {
		$keys = parent::props_to_meta_key();

		$keys['images_urls']        = '_images_urls';
		$keys['show_image_title']   = '_show_attachment_title';
		$keys['show_image_caption'] = '_show_attachment_caption';
		$keys['show_lightbox']      = '_image_lightbox';
		$keys['image_target']       = '_image_target';

		return $keys;
	}
}
