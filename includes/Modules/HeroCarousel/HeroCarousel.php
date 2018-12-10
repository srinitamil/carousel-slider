<?php

namespace CarouselSlider\Modules\HeroCarousel;

use CarouselSlider\Abstracts\Carousel;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class HeroCarousel extends Carousel {
	/**
	 * Represent current class as array
	 *
	 * @return array
	 */
	public function to_array() {
		$data = parent::to_array();

		$data['content_settings'] = $this->get_content_settings();
		$data['content']          = $this->get_content();

		return $data;
	}

	public function get_content_settings() {
		$settings = $this->get_prop( 'content_settings' );

		return $settings;
	}

	public function get_content() {
		$slides  = array();
		$_slides = $this->get_prop( 'content' );

		foreach ( $_slides as $slide ) {
			$slides[] = new HeroCarouselItem( $slide );
		}

		return $slides;
	}

	/**
	 * Read slider data
	 */
	protected function read_slider_data() {
		parent::read_slider_data();
		$this->data['content_settings'] = $this->get_meta( '_content_slider_settings' );
		$this->data['content']          = $this->get_meta( '_content_slider' );
	}

	/**
	 * Get properties to meta keys
	 *
	 * @return array
	 */
	protected static function props_to_meta_key() {
		$keys = parent::props_to_meta_key();

		$keys['content_settings'] = '_content_slider_settings';
		$keys['content']          = '_content_slider';

		return $keys;
	}
}