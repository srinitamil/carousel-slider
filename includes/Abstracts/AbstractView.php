<?php

namespace CarouselSlider\Abstracts;

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
	 * @var array
	 */
	protected $style = array();

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
			'carousel-slider-' . $this->get_slider()->get_type(),
			'carousel-slider-' . $id
		);

		$html = '<div class="' . implode( ' ', $outer_classes ) . '">' . PHP_EOL;
		$html .= '<style type="text/css">' . $this->get_dynamic_style() . '</style>' . PHP_EOL;
		$html .= "<div id='id-" . $id . "' class='" . $class . "' data-owl_options='" . $options . "' data-slide-type='" . $this->get_slider()->get_type() . "'>";

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

	/**
	 * Get slider arrow and dot navigation style
	 */
	protected function get_navigation_style() {
		$slider           = $this->get_slider();
		$id               = $slider->get_id();
		$nav_color        = $slider->get_nav_color();
		$nav_active_color = $slider->get_nav_active_color();
		$arrow_size       = $slider->get_arrow_size();
		$bullet_size      = $slider->get_dots_size();
		// Arrows Nav
		$element_1 = "#id-{$id} .carousel-slider-nav-icon";
		$element_2 = "#id-{$id} .carousel-slider-nav-icon:hover";
		$element_3 = "#id-{$id} .owl-prev,#id-{$id} .owl-next,#id-{$id} .carousel-slider-nav-icon";
		$element_4 = "#id-{$id}.arrows-outside .owl-prev";
		$element_5 = "#id-{$id}.arrows-outside .owl-next";

		$this->style[ $element_1 ][] = array( 'property' => 'fill', 'value' => $nav_color );
		$this->style[ $element_2 ][] = array( 'property' => 'fill', 'value' => $nav_active_color );
		$this->style[ $element_3 ]   = array(
			array( 'property' => 'height', 'value' => $arrow_size . 'px' ),
			array( 'property' => 'width', 'value' => $arrow_size . 'px' ),
		);
		$this->style[ $element_4 ][] = array( 'property' => 'left', 'value' => '-' . $arrow_size . 'px' );
		$this->style[ $element_5 ][] = array( 'property' => 'right', 'value' => '-' . $arrow_size . 'px' );

		// Dots Nav
		$element_6 = "#id-{$id} .owl-dots .owl-dot span";
		$element_7 = "#id-{$id} .owl-dots .owl-dot.active span,#id-{$id} .owl-dots .owl-dot:hover span";

		$this->style[ $element_6 ]   = array(
			array( 'property' => 'background-color', 'value' => $nav_color ),
			array( 'property' => 'height', 'value' => $bullet_size . 'px' ),
			array( 'property' => 'width', 'value' => $bullet_size . 'px' ),
		);
		$this->style[ $element_7 ][] = array( 'property' => 'background', 'value' => $nav_active_color );
	}

	/**
	 * Get slider style
	 *
	 * @return string
	 */
	protected function get_dynamic_style() {
		$this->get_navigation_style();
		$styles    = $this->style;
		$final_css = '';

		foreach ( $styles as $selector => $style_array ) {
			$final_css .= $selector . '{';
			foreach ( $style_array as $style ) {

				$property = $style['property'];
				$value    = (string) $style['value'];

				if ( empty( $value ) ) {
					continue;
				}

				// Make sure background-images are properly formatted
				if ( 'background-image' == $property ) {
					if ( false === strrpos( $value, 'url(' ) ) {
						$value = 'url("' . esc_url_raw( $value ) . '")';
					}
				}

				$final_css .= $property . ':' . $value . ';';
			}
			$final_css .= '}';
		}

		return empty( $final_css ) ? '' : $final_css;
	}
}
