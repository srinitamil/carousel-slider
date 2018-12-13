<?php

namespace CarouselSlider\Modules\HeroCarousel;

use CarouselSlider\Abstracts\AbstractView;
use CarouselSlider\Supports\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class View extends AbstractView {

	/**
	 * @var array
	 */
	protected $style = array();

	/**
	 * Render element.
	 * Generates the final HTML on the frontend.
	 */
	public function render() {
		/** @var Slider $slider */
		$slider = $this->get_slider();
		/** @var SliderItem[] $slides */
		$slides       = $slider->get_content();
		$slides_count = count( $slides );

		if ( $slides_count < 1 ) {
			return '';
		}

		$this->set_total_slides( $slides_count );

		$id    = $slider->get_id();
		$_html = '';

		$element                   = "#id-{$id} .carousel-slider-hero__cell";
		$this->style[ $element ][] = array( 'property' => 'height', 'value' => $slider->get_slider_height() );

		$element                   = "#id-{$id} .cell_content";
		$this->style[ $element ][] = array( 'property' => 'max-width', 'value' => $slider->get_content_width() );

		foreach ( $slides as $slide_index => $slide ) {

			$html = '';

			$_link_type  = $slide->get_link_type();
			$_slide_link = $slide->get_full_slide_link();
			$class       = "carousel-slider-cell-{$id}-{$slide_index}";

			$cell_class = "carousel-slider-hero__cell {$class}";
			if ( 'full' == $_link_type && $_slide_link ) {
				$html .= '<a class="' . $cell_class . '" href="' . $_slide_link . '" target="' . $slide->get_full_slide_link_target() . '">';
			} else {
				$html .= '<div class="' . $cell_class . '">';
			}

			// Slide Background
			$_img_bg_position  = $slide->get_background_position();
			$_img_bg_size      = $slide->get_background_size();
			$_bg_color         = $slide->get_background_color();
			$_bg_overlay       = $slide->get_background_overly_color();
			$_ken_burns_effect = $slide->get_ken_burns_effect();
			$_img_src          = $slide->get_background_image();
			$_have_img         = is_array( $_img_src );

			// Slide background
			$element                   = "#id-{$id} .{$class} .cell_background";
			$this->style[ $element ][] = array( 'property' => 'background-position', 'value' => $_img_bg_position );
			$this->style[ $element ][] = array( 'property' => 'background-size', 'value' => $_img_bg_size );

			if ( $_have_img && ! $slider->get_lazy_load_image() ) {
				$this->style[ $element ][] = array( 'property' => 'background-image', 'value' => $_img_src['src'], );
			}
			if ( ! empty( $_bg_color ) ) {
				$this->style[ $element ][] = array( 'property' => 'background-color', 'value' => $_bg_color, );
			}

			// Background class
			$_slide_bg_class = 'carousel-slider-hero__cell__background cell_background';

			if ( 'zoom-in' == $_ken_burns_effect ) {
				$_slide_bg_class .= ' carousel-slider-hero-ken-in';
			} elseif ( 'zoom-out' == $_ken_burns_effect ) {
				$_slide_bg_class .= ' carousel-slider-hero-ken-out';
			}

			if ( $slider->get_lazy_load_image() ) {
				$html .= '<div class="' . $_slide_bg_class . ' owl-lazy" data-src="' . $_img_src['src'] . '" id="slide-item-' . $id . '-' . $slide_index . '"></div>';
			} else {
				$html .= '<div class="' . $_slide_bg_class . '" id="slide-item-' . $id . '-' . $slide_index . '"></div>';
			}

			// Cell Inner
			$_content_alignment = $slide->get_content_alignment();
			$_cell_inner_class  = 'carousel-slider-hero__cell__inner cell_inner carousel-slider--h-position-center';
			if ( $_content_alignment == 'left' ) {
				$_cell_inner_class .= ' carousel-slider--v-position-middle carousel-slider--text-left';
			} elseif ( $_content_alignment == 'right' ) {
				$_cell_inner_class .= ' carousel-slider--v-position-middle carousel-slider--text-right';
			} else {
				$_cell_inner_class .= ' carousel-slider--v-position-middle carousel-slider--text-center';
			}

			$element                 = "#id-{$id} .{$class} .cell_inner";
			$this->style[ $element ] = array(
				array( 'property' => 'padding-top', 'value' => $slider->get_content_padding( 'top', '1rem' ) ),
				array( 'property' => 'padding-right', 'value' => $slider->get_content_padding( 'right', '3rem' ) ),
				array( 'property' => 'padding-bottom', 'value' => $slider->get_content_padding( 'bottom', '1rem' ) ),
				array( 'property' => 'padding-left', 'value' => $slider->get_content_padding( 'left', '3rem' ) ),
			);

			$html .= '<div class="' . $_cell_inner_class . '">';

			// Background Overlay
			if ( ! empty( $_bg_overlay ) ) {
				$element                   = "#id-{$id} .{$class} .cell_background_overlay";
				$this->style[ $element ][] = array( 'property' => 'background-color', 'value' => $_bg_overlay );

				$html .= '<div class="carousel-slider-hero__cell__background_overlay cell_background_overlay"></div>';
			}

			$html .= '<div class="carousel-slider-hero__cell__content cell_content">';

			// Slide Heading
			$html .= '<div class="carousel-slider-hero__cell__heading">';
			$html .= $slide->get_slide_heading();
			$html .= '</div>'; // .carousel-slider-hero__cell__heading


			$html .= '<div class="carousel-slider-hero__cell__description">';
			$html .= $slide->get_slide_description();
			$html .= '</div>'; // .carousel-slider-hero__cell__content

			// Buttons
			if ( $_link_type == 'button' ) {
				$html .= '<div class="carousel-slider-hero__cell__buttons">';

				// Slide Button #1
				$_btn_1_text   = $slide->get_button_one_text();
				$_btn_1_url    = $slide->get_button_one_url();
				$_btn_1_target = $slide->get_button_one_target();
				$_btn_1_type   = $slide->get_button_one_type();
				$_btn_1_size   = $slide->get_button_one_size();
				if ( $slide->has_button_one() ) {
					$_btn_1_class = 'button cs-hero-button';
					$_btn_1_class .= ' cs-hero-button-' . $slide_index . '-1';
					$_btn_1_class .= ' cs-hero-button-' . $_btn_1_type;
					$_btn_1_class .= ' cs-hero-button-' . $_btn_1_size;

					$element_button = "#id-{$id} .cs-hero-button-{$slide_index}-1";
					if ( 'stroke' == $_btn_1_type ) {
						$this->style[ $element_button ]            = array(
							array( 'property' => 'background-color', 'value' => 'transparent' ),
							array( 'property' => 'border-color', 'value' => $slide->get_button_one_background_color() ),
							array( 'property' => 'border-style', 'value' => "solid" ),
							array( 'property' => 'border-width', 'value' => $slide->get_button_one_border_width() ),
							array( 'property' => 'border-radius', 'value' => $slide->get_button_one_border_radius() ),
							array( 'property' => 'color', 'value' => $slide->get_button_one_background_color() ),
						);
						$this->style[ $element_button . ':hover' ] = array(
							array(
								'property' => 'background-color',
								'value'    => $slide->get_button_one_background_color()
							),
							array( 'property' => 'border-color', 'value' => $slide->get_button_one_background_color() ),
							array( 'property' => 'color', 'value' => $slide->get_button_one_color() ),
						);
					}
					if ( 'stroke' != $_btn_1_type ) {
						$this->style[ $element_button ] = array(
							array(
								'property' => 'background-color',
								'value'    => $slide->get_button_one_background_color()
							),
							array( 'property' => 'border-color', 'value' => $slide->get_button_one_background_color() ),
							array( 'property' => 'border-style', 'value' => "solid" ),
							array( 'property' => 'border-width', 'value' => $slide->get_button_one_border_width() ),
							array( 'property' => 'border-radius', 'value' => $slide->get_button_one_border_radius() ),
							array( 'property' => 'color', 'value' => $slide->get_button_one_color() ),
						);
					}

					$html .= '<span class="carousel-slider-hero__cell__button__one">';
					$html .= '<a class="' . $_btn_1_class . '" href="' .
					         $_btn_1_url . '" target="' . $_btn_1_target . '">' . esc_attr( $_btn_1_text ) . "</a>";
					$html .= '</span>';
				}

				// Slide Button #2
				$_btn_2_text   = $slide->get_button_two_text();
				$_btn_2_url    = $slide->get_button_two_url();
				$_btn_2_target = $slide->get_button_two_target();
				$_btn_2_size   = $slide->get_button_two_size();
				$_btn_2_type   = $slide->get_button_two_type();
				if ( $slide->has_button_two() ) {
					$_btn_2_class = 'button cs-hero-button';
					$_btn_2_class .= ' cs-hero-button-' . $slide_index . '-2';
					$_btn_2_class .= ' cs-hero-button-' . $_btn_2_type;
					$_btn_2_class .= ' cs-hero-button-' . $_btn_2_size;

					$element_button = "#id-{$id} .cs-hero-button-{$slide_index}-2";
					if ( 'stroke' == $_btn_2_type ) {
						$this->style[ $element_button ]            = array(
							array( 'property' => 'background-color', 'value' => 'transparent' ),
							array( 'property' => 'border-color', 'value' => $slide->get_button_two_background_color() ),
							array( 'property' => 'border-style', 'value' => "solid" ),
							array( 'property' => 'border-width', 'value' => $slide->get_button_two_border_width() ),
							array( 'property' => 'border-radius', 'value' => $slide->get_button_two_border_radius() ),
							array( 'property' => 'color', 'value' => $slide->get_button_two_background_color() ),
						);
						$this->style[ $element_button . ':hover' ] = array(
							array(
								'property' => 'background-color',
								'value'    => $slide->get_button_two_background_color()
							),
							array( 'property' => 'border-color', 'value' => $slide->get_button_two_background_color() ),
							array( 'property' => 'color', 'value' => $slide->get_button_two_color() ),
						);
					}
					if ( 'stroke' != $_btn_2_type ) {
						$this->style[ $element_button ] = array(
							array(
								'property' => 'background-color',
								'value'    => $slide->get_button_two_background_color()
							),
							array( 'property' => 'border-color', 'value' => $slide->get_button_two_background_color() ),
							array( 'property' => 'border-style', 'value' => "solid" ),
							array( 'property' => 'border-width', 'value' => $slide->get_button_two_border_width() ),
							array( 'property' => 'border-radius', 'value' => $slide->get_button_two_border_radius() ),
							array( 'property' => 'color', 'value' => $slide->get_button_two_color() ),
						);
					}

					$html .= '<span class="carousel-slider-hero__cell__button__two">';
					$html .= '<a class="' . $_btn_2_class . '" href="' . $_btn_2_url . '" target="' . $_btn_2_target . '">' . esc_attr( $_btn_2_text ) . "</a>";
					$html .= '</span>';
				}

				$html .= '</div>'; // .carousel-slider-hero__cell__button
			}

			$html .= '</div>'; // .carousel-slider-hero__cell__content
			$html .= '</div>'; // .carousel-slider-hero__cell__inner

			if ( $_link_type == 'full' && Utils::is_url( $_slide_link ) ) {
				$html .= '</a>'; // .carousel-slider-hero__cell
			} else {
				$html .= '</div>'; // .carousel-slider-hero__cell
			}

			$_html .= apply_filters( 'carousel_slider_content', $html, $slide_index, $slide );
		}

		$__html = $this->slider_wrapper_start();
		$__html .= $_html;
		$__html .= $this->slider_wrapper_end();

		return $__html;
	}

	/**
	 * Slider wrapper start
	 *
	 * @return string
	 */
	protected function slider_wrapper_start() {
		/** @var Slider $slider */
		$slider  = $this->get_slider();
		$class   = $this->get_slider_class();
		$options = wp_json_encode( $this->owl_options() );

		$outer_classes = array(
			'carousel-slider-outer',
			'carousel-slider-' . $slider->get_type(),
			'carousel-slider-' . $slider->get_id()
		);

		$html = '<div class="' . implode( ' ', $outer_classes ) . '">' . PHP_EOL;
		$html .= '<style type="text/css">';
		$html .= $this->get_dynamic_style();
		$html .= '</style>' . PHP_EOL;
		$html .= "<div id='id-" . $slider->get_id() . "' class='" . $class . "' data-owl_options='" . $options . "'
		data-animation='" . $slider->get_content_animation() . "' data-slide-type='" . $slider->get_type() . "'>";

		return $html;
	}
}
