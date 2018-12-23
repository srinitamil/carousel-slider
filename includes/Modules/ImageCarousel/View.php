<?php

namespace CarouselSlider\Modules\ImageCarousel;

use CarouselSlider\Abstracts\AbstractView;
use CarouselSlider\Supports\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class View extends AbstractView {

	/**
	 * Render element.
	 * Generates the final HTML on the frontend.
	 */
	public function render() {
		/** @var Slider $slider */
		$slider       = $this->get_slider();
		$images_ids   = $slider->get_images_ids();
		$images_count = count( $images_ids );

		$this->set_total_slides( $images_count );

		if ( $images_count < 1 ) {
			return '';
		}

		$_html = $this->slider_wrapper_start();

		foreach ( $slider->get_items() as $slider_item ) {

			$image_id = $slider_item->get_id();
			$_post    = get_post( $image_id );
			do_action( 'carousel_slider_image_gallery_loop', $_post );

			$image_link_url = $slider_item->get_image_target();

			$html = '<div class="carousel-slider__item">';

			$image        = $this->get_image( $slider, $slider_item );
			$full_caption = $this->get_attachment_caption( $slider, $slider_item );
			$content      = $image . $full_caption;

			if ( $slider->show_lightbox() ) {
				$image_src = $slider_item->get_image_src( 'full' );

				$html .= '<a href="' . esc_url( $image_src['url'] ) . '" class="magnific-popup">' . $content . '</a>';
			} elseif ( Utils::is_url( $image_link_url ) ) {
				$html .= '<a href="' . $image_link_url . '" target="' . $slider->get_image_target() . '">' . $content . '</a>';
			} else {
				$html .= $content;
			}

			$html .= '</div>';

			$_html .= apply_filters( 'carousel_slider/view/image', $html, $_post );
		}

		$_html .= $this->slider_wrapper_end();

		return $_html;
	}

	/**
	 * Get image
	 *
	 * @param Slider $slider
	 * @param SliderItem $slider_item
	 *
	 * @return string
	 */
	protected function get_image( $slider, $slider_item ) {
		$image_alt_text = $slider_item->get_image_alt();
		$image_size     = $slider->get_image_size();

		if ( $slider->get_lazy_load_image() ) {
			$image_src = $slider_item->get_image_src( $image_size );
			$image     = sprintf( '<img class="owl-lazy" data-src="%1$s" width="%2$s" height="%3$s" alt="%4$s" />',
				$image_src['url'], $image_src['width'], $image_src['height'], $image_alt_text );

			return $image;
		}

		return $slider_item->get_image( $image_size );
	}

	/**
	 * @param Slider $slider
	 * @param SliderItem $slider_item
	 *
	 * @return string
	 */
	protected function get_attachment_caption( $slider, $slider_item ) {
		$title   = sprintf( '<h4 class="title">%1$s</h4>', $slider_item->get_title() );
		$caption = sprintf( '<p class="caption">%1$s</p>', $slider_item->get_caption() );

		if ( $slider->show_image_title() && $slider->show_image_caption() ) {
			return sprintf( '<div class="carousel-slider__caption">%1$s%2$s</div>', $title, $caption );
		}

		if ( $slider->show_image_title() ) {
			return sprintf( '<div class="carousel-slider__caption">%s</div>', $title );
		}

		if ( $slider->show_image_caption() ) {
			return sprintf( '<div class="carousel-slider__caption">%s</div>', $caption );
		}

		return '';
	}

	/**
	 * Get image target
	 *
	 * @return string
	 */
	protected function image_target() {
		$_image_target = $this->get_meta( '_image_target' );

		return in_array( $_image_target, array( '_self', '_blank' ) ) ? $_image_target : '_self';
	}

	/**
	 * @return bool
	 */
	protected function show_attachment_title() {
		return $this->checked( $this->get_meta( '_show_attachment_title' ) );
	}

	/**
	 * @return bool
	 */
	protected function show_attachment_caption() {
		return $this->checked( $this->get_meta( '_show_attachment_caption' ) );
	}
}
