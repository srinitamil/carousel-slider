<?php

namespace CarouselSlider\Modules\HeroCarousel;

use CarouselSlider\Abstracts\AbstractSlider;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Slider extends AbstractSlider {

	/**
	 * Get available content animations
	 *
	 * @param bool $key_only
	 *
	 * @return array
	 */
	public static function get_available_animations( $key_only = false ) {
		$animations = array(
			''            => esc_html__( 'None', 'carousel-slider' ),
			'fadeInDown'  => esc_html__( 'Fade In Down', 'carousel-slider' ),
			'fadeInUp'    => esc_html__( 'Fade In Up', 'carousel-slider' ),
			'fadeInRight' => esc_html__( 'Fade In Right', 'carousel-slider' ),
			'fadeInLeft'  => esc_html__( 'Fade In Left', 'carousel-slider' ),
			'zoomIn'      => esc_html__( 'Zoom In', 'carousel-slider' ),
		);

		if ( $key_only ) {
			return array_keys( $animations );
		}

		return $animations;
	}

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


	/**
	 * Get content settings
	 *
	 * @param string $key
	 * @param mixed $default
	 *
	 * @return mixed|null
	 */
	public function get_content_settings( $key = null, $default = null ) {
		$settings = $this->get_prop( 'content_settings' );

		if ( ! is_null( $key ) ) {
			return isset( $settings[ $key ] ) ? $settings[ $key ] : $default;
		}

		return $settings;
	}

	/**
	 * Get slider content animation
	 *
	 * @param string $default
	 *
	 * @return string
	 */
	public function get_content_animation( $default = null ) {
		$animation = $this->get_content_settings( 'content_animation' );

		return in_array( $animation, static::get_available_animations( true ) ) ? $animation : $default;
	}

	/**
	 * Get content max width
	 *
	 * @param string $default
	 *
	 * @return string
	 */
	protected function get_content_width( $default = null ) {
		return $this->get_content_settings( 'content_width', $default );
	}

	/**
	 * Get slide content padding
	 *
	 * @param string $key
	 * @param string $default
	 *
	 * @return array|string
	 */
	protected function get_content_padding( $key = null, $default = null ) {
		$padding = (array) $this->get_content_settings( 'slide_padding', $default );

		if ( empty( $key ) ) {
			return $padding;
		}

		if ( ! in_array( $key, array( 'top', 'right', 'bottom', 'left' ) ) ) {
			return '';
		}

		return isset( $padding[ $key ] ) ? $padding[ $key ] : $default;
	}

	/**
	 * Get slider height
	 *
	 * @param string $default
	 *
	 * @return string
	 */
	protected function get_slider_height( $default = null ) {
		return $this->get_content_settings( 'slide_height', $default );
	}

	/**
	 * Get slider content
	 *
	 * @return array
	 */
	public function get_content() {
		$slides  = array();
		$_slides = $this->get_prop( 'content' );

		foreach ( $_slides as $slide ) {
			$slides[] = new SliderItem( $slide );
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