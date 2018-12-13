<?php

namespace CarouselSlider\Abstracts;

use CarouselSlider\Supports\Utils;

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
		$slider                  = $this->get_slider();
		$id                      = $slider->get_id();
		$_nav_color              = $slider->get_nav_color();
		$_nav_active_color       = $slider->get_nav_active_color();
		$_post_height            = get_post_meta( $id, '_post_height', true );
		$_product_title_color    = get_post_meta( $id, '_product_title_color', true );
		$_product_btn_bg_color   = get_post_meta( $id, '_product_button_bg_color', true );
		$_product_btn_text_color = get_post_meta( $id, '_product_button_text_color', true );

		$slide_type = $slider->get_type();
		$slide_type = in_array( $slide_type, Utils::get_slide_types() ) ? $slide_type : 'image-carousel';

		$_arrow_size = $slider->get_arrow_size();
		$_arrow_size = empty( $_arrow_size ) ? 48 : absint( $_arrow_size );

		$_bullet_size = $slider->get_dots_size();
		$_bullet_size = empty( $_bullet_size ) ? 10 : absint( $_bullet_size );

		ob_start();
		// Arrows Nav
		echo "
            #id-{$id} .carousel-slider-nav-icon {
                fill: {$_nav_color}
            }
            #id-{$id} .carousel-slider-nav-icon:hover {
                fill: {$_nav_active_color}
            }
            #id-{$id} .owl-prev,
            #id-{$id} .owl-next,
            #id-{$id} .carousel-slider-nav-icon {
                height: {$_arrow_size}px;
                width: {$_arrow_size}px
            }
            #id-{$id}.arrows-outside .owl-prev {
                left: -{$_arrow_size}px
            }
            #id-{$id}.arrows-outside .owl-next {
                right: -{$_arrow_size}px
            }
        ";

		// Dots Nav
		echo "
		    #id-{$id} .owl-dots .owl-dot span {
                background-color: {$_nav_color};
                width: {$_bullet_size}px;
                height: {$_bullet_size}px;
            }
            #id-{$id} .owl-dots .owl-dot.active span,
            #id-{$id} .owl-dots .owl-dot:hover span {
                background-color: {$_nav_active_color}
            }
		";

		// Post Carousel Slider
		if ( $slide_type == 'post-carousel' ) {

			echo "
                #id-{$id} .carousel-slider__post {
                    height: {$_post_height}px
                }
            ";
		}

		// Product Carousel Slider
		if ( $slide_type == 'product-carousel' ) {
			echo "
		        #id-{$id} .carousel-slider__product h3,
                #id-{$id} .carousel-slider__product .price {
                    color: {$_product_title_color};
                }

                #id-{$id} .carousel-slider__product a.add_to_cart_button,
                #id-{$id} .carousel-slider__product a.added_to_cart,
                #id-{$id} .carousel-slider__product a.quick_view,
                #id-{$id} .carousel-slider__product .onsale {
                    background-color: {$_product_btn_bg_color};
                    color: {$_product_btn_text_color};
                }

                #id-{$id} .carousel-slider__product .star-rating {
                    color: {$_product_btn_bg_color};
                }
		    ";
		}

		$styles = ob_get_clean();

		return self::minify_css( $styles, $newline );
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

		$html = '<div class="' . implode( ' ', $outer_classes ) . '">';
		$html .= '<style type="text/css">' . $this->dynamic_style() . '</style>';
		$html .= "<div 
		id='id-" . $id . "' 
		class='" . $class . "' 
		data-owl_options='" . $options . "'
		data-slide-type='" . $this->get_slider()->get_type() . "'>";

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
	 * Minify CSS
	 *
	 * @param string $content
	 * @param bool $newline
	 *
	 * @return string
	 */
	protected static function minify_css( $content = '', $newline = true ) {
		// Strip comments
		$content = preg_replace( '!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $content );
		// remove leading & trailing whitespace
		$content = preg_replace( '/^\s*/m', '', $content );
		$content = preg_replace( '/\s*$/m', '', $content );

		// replace newlines with a single space
		$content = preg_replace( '/\s+/', ' ', $content );

		// remove whitespace around meta characters
		// inspired by stackoverflow.com/questions/15195750/minify-compress-css-with-regex
		$content = preg_replace( '/\s*([\*$~^|]?+=|[{};,>~]|!important\b)\s*/', '$1', $content );
		$content = preg_replace( '/([\[(:])\s+/', '$1', $content );
		$content = preg_replace( '/\s+([\]\)])/', '$1', $content );
		$content = preg_replace( '/\s+(:)(?![^\}]*\{)/', '$1', $content );

		// whitespace around + and - can only be stripped inside some pseudo-
		// classes, like `:nth-child(3+2n)`
		// not in things like `calc(3px + 2px)`, shorthands like `3px -2px`, or
		// selectors like `div.weird- p`
		$pseudos = array( 'nth-child', 'nth-last-child', 'nth-last-of-type', 'nth-of-type' );
		$content = preg_replace( '/:(' . implode( '|', $pseudos ) . ')\(\s*([+-]?)\s*(.+?)\s*([+-]?)\s*(.*?)\s*\)/',
			':$1($2$3$4$5)', $content );

		// remove semicolon/whitespace followed by closing bracket
		$content = str_replace( ';}', '}', $content );

		// Add new line after closing bracket
		if ( $newline ) {
			$content = str_replace( '}', '}' . PHP_EOL, $content );
		}

		return trim( $content );
	}
}
