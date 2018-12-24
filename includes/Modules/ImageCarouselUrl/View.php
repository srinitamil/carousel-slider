<?php

namespace CarouselSlider\Modules\ImageCarouselUrl;

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
		$_images_urls = $this->images_urls();
		$images_count = count( $_images_urls );

		$this->set_total_slides( $images_count );

		$_html = $this->slider_wrapper_start();

		foreach ( $_images_urls as $imageInfo ) {

			$html = '<div class="carousel-slider__item">';

			$image        = $this->get_image( $slider, $imageInfo );
			$full_caption = $this->get_attachment_caption( $slider, $imageInfo );
			$content      = $image . $full_caption;

			if ( $slider->show_lightbox() ) {
				$html .= '<a href="' . esc_url( $imageInfo['url'] ) . '" class="magnific-popup">' . $content . '</a>';
			} elseif ( Utils::is_url( $imageInfo['link_url'] ) ) {
				$html .= '<a href="' . $imageInfo['link_url'] . '" target="' . $slider->get_image_target() . '">' . $content . '</a>';
			} else {
				$html .= $content;
			}

			$html .= '</div>';

			$_html .= apply_filters( 'carousel_slider/view/image_url', $html, $imageInfo );
		}

		$_html .= $this->slider_wrapper_end();

		return $_html;
	}

	/**
	 * @param Slider $slider
	 * @param array $imageInfo
	 *
	 * @return string
	 */
	protected function get_attachment_caption( $slider, $imageInfo ) {
		$title   = sprintf( '<h4 class="title">%1$s</h4>', $imageInfo['title'] );
		$caption = sprintf( '<p class="caption">%1$s</p>', $imageInfo['caption'] );

		if ( $slider->show_image_title() && $slider->show_image_caption() ) {
			return '<div class="carousel-slider__caption">' . $title . $caption . '</div>';
		}

		if ( $slider->show_image_title() ) {
			return '<div class="carousel-slider__caption">' . $title . '</div>';
		}

		if ( $slider->show_image_caption() ) {
			return '<div class="carousel-slider__caption">' . $caption . '</div>';
		}

		return '';
	}

	/**
	 * @param Slider $slider
	 * @param array $imageInfo
	 *
	 * @return string
	 */
	protected function get_image( $slider, $imageInfo ) {
		if ( $slider->get_lazy_load_image() ) {
			return '<img class="owl-lazy" data-src="' . $imageInfo['url'] . '" alt="' . $imageInfo['alt'] . '" />';
		}

		return '<img src="' . $imageInfo['url'] . '" alt="' . $imageInfo['alt'] . '" />';
	}

	/**
	 * Get image urls
	 *
	 * @return array
	 */
	protected function images_urls() {
		return $this->get_meta( '_images_urls' );
	}
}
