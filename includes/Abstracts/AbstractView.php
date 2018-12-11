<?php

namespace CarouselSlider\Abstracts;

use CarouselSlider\Supports\DynamicStyle;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

abstract class AbstractView {

	/**
	 * @var int
	 */
	protected $slider_id = 0;

	/**
	 * @var int
	 */
	protected $total_slides = 0;

	/**
	 * @var AbstractSlider
	 */
	protected $slider;

	/**
	 * Render element.
	 * Generates the final HTML on the frontend.
	 */
	abstract public function render();

	/**
	 * Get slider CRUD class
	 *
	 * @return AbstractSlider
	 */
	public function get_slider() {
		return $this->slider;
	}

	/**
	 * Set slider CRUD class
	 *
	 * @param AbstractSlider $slider
	 */
	public function set_slider( $slider ) {
		if ( $slider instanceof AbstractSlider ) {
			$this->slider = $slider;
		}
	}

	/**
	 * Get numbers of slides of a slider
	 *
	 * @return int
	 */
	public function get_total_slides() {
		return $this->total_slides;
	}

	/**
	 * Set numbers of slides of a slider
	 *
	 * @param int $total_slides
	 */
	public function set_total_slides( $total_slides ) {
		$this->total_slides = $total_slides;
	}

	/**
	 * Get slider id
	 *
	 * @return int
	 */
	public function get_slider_id() {
		return $this->slider_id;
	}

	/**
	 * Set current slider id
	 *
	 * @param int $slider_id
	 */
	public function set_slider_id( $slider_id ) {
		$this->slider_id = $slider_id;
	}

	/**
	 * Get owl carousel options
	 *
	 * @return array
	 */
	public function owl_options() {
		$owl_setting = array(
			'stagePadding'       => $this->get_slider()->get_stage_padding(),
			'nav'                => $this->get_slider()->is_nav_enabled(),
			'dots'               => $this->get_slider()->is_dot_enabled(),
			'margin'             => $this->get_slider()->get_item_spacing(),
			'loop'               => $this->get_slider()->get_infinity_loop(),
			'autoplay'           => $this->get_slider()->get_autoplay(),
			'autoplayTimeout'    => $this->get_slider()->get_autoplay_timeout(),
			'autoplaySpeed'      => $this->get_slider()->get_autoplay_speed(),
			'autoplayHoverPause' => $this->get_slider()->get_autoplay_hover_pause(),
			'slideBy'            => $this->get_slider()->get_arrow_steps(),
			'lazyLoad'           => $this->get_slider()->get_lazy_load_image(),
			'autoWidth'          => $this->get_slider()->get_auto_width(),
			'items'              => 1,
		);

		if ( $this->get_total_slides() <= 1 ) {
			$owl_setting['mouseDrag'] = false;
			$owl_setting['touchDrag'] = false;
			$owl_setting['nav']       = false;
			$owl_setting['dots']      = false;
			$owl_setting['autoplay']  = false;
		}

		$_responsive = array();
		foreach ( $this->get_slider()->get_responsive_settings() as $item ) {
			$items   = $item['items'];
			$_config = array( 'items' => $items );
			if ( $this->get_total_slides() <= $items ) {
				$_config['mouseDrag'] = false;
				$_config['touchDrag'] = false;
				$_config['nav']       = false;
				$_config['dots']      = false;
				$_config['autoplay']  = false;
			}

			$_responsive[ $item['breakpoint'] ] = $_config;
		}
		$owl_setting['responsive'] = $_responsive;

		$owl_setting['navText'] = apply_filters( 'carousel_slider/nav_text', array(
			'<svg class="carousel-slider-nav-icon" viewBox="0 0 20 20"><path d="M14 5l-5 5 5 5-1 2-7-7 7-7z"></path></svg>',
			'<svg class="carousel-slider-nav-icon" viewBox="0 0 20 20"><path d="M6 15l5-5-5-5 1-2 7 7-7 7z"></path></svg>',
		) );

		return apply_filters( 'carousel_slider/owl_options', $owl_setting );
	}

	/**
	 * Retrieve post meta field for a post.
	 *
	 * @param string $key The meta key to retrieve.
	 * @param mixed $default
	 *
	 * @return mixed
	 */
	protected function get_meta( $key, $default = null ) {
		$meta = get_post_meta( $this->get_slider_id(), $key, true );

		if ( empty( $meta ) && func_num_args() > 1 ) {
			$meta = $default;
		}

		return $meta;
	}

	/**
	 * If a field has been 'checked' or not, meaning it contains
	 * one of the following values: 'yes', 'on', '1', 1, true, or 'true'.
	 * This can be used for determining if an HTML checkbox has been checked.
	 *
	 * @param  mixed $value
	 *
	 * @return boolean
	 */
	protected function checked( $value ) {
		return in_array( $value, array( 'yes', 'on', '1', 1, true, 'true' ), true );
	}

	/**
	 * Get slide dynamic style
	 *
	 * @param bool $newline
	 *
	 * @return string
	 */
	protected function dynamic_style( $newline = false ) {
		return DynamicStyle::generate( $this->get_slider_id(), $newline );
	}

	/**
	 * Slider wrapper start
	 *
	 * @return string
	 */
	protected function slider_wrapper_start() {
		$id      = $this->get_slider_id();
		$class   = $this->get_slider_class();
		$options = wp_json_encode( $this->owl_options() );

		$outer_classes = array(
			'carousel-slider-outer',
			'carousel-slider-' . $this->slider_type(),
			'carousel-slider-' . $id
		);

		$html = '<div class="' . implode( ' ', $outer_classes ) . '">';
		$html .= '<style type="text/css">' . $this->dynamic_style() . '</style>';
		$html .= "<div 
		id='id-" . $id . "' 
		class='" . $class . "' 
		data-owl_options='" . $options . "'
		data-slide-type='" . $this->slider_type() . "'>";

		return $html;
	}

	/**
	 * Slider wrapper end
	 *
	 * @return string
	 */
	protected function slider_wrapper_end() {
		return '</div></div>';
	}

	/**
	 * Get slider class
	 *
	 * @return string
	 */
	protected function get_slider_class() {
		$class = array( 'owl-carousel', 'carousel-slider' );

		// Arrows position
		$class[] = 'arrows-' . $this->get_slider()->get_arrow_position();

		// Dots position
		$class[] = 'dots-' . $this->get_slider()->get_dots_position();

		// Dots shape
		$class[] = 'dots-' . $this->get_slider()->get_dots_shape();

		// Arrows visibility
		$arrow_visibility = $this->get_slider()->get_arrow_visibility();
		if ( $arrow_visibility == 'always' ) {
			$class[] = 'arrows-visible-always';
		} elseif ( $arrow_visibility == 'never' ) {
			$class[] = 'arrows-hidden';
		} else {
			$class[] = 'arrows-visible-hover';
		}

		// Dots visibility
		$dots_visibility = $this->get_slider()->get_dots_visibility();
		if ( $dots_visibility == 'always' ) {
			$class[] = 'dots-visible-always';
		} elseif ( $dots_visibility == 'never' ) {
			$class[] = 'dots-hidden';
		} else {
			$class[] = 'dots-visible-hover';
		}

		return implode( ' ', $class );
	}

	/********************************************************************************
	 * General Settings
	 *******************************************************************************/

	/**
	 * Get slider type
	 *
	 * @return mixed
	 */
	protected function slider_type() {
		return $this->get_slider()->get_type();
	}

	/**
	 * Get slider image size
	 *
	 * @return string
	 */
	protected function image_size() {
		return $this->get_slider()->get_image_size();
	}

	/**
	 * Check if lazy load enabled
	 *
	 * @return bool
	 */
	protected function lazy_load_image() {
		return $this->get_slider()->get_lazy_load_image();
	}
}
