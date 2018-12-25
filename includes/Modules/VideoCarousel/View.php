<?php

namespace CarouselSlider\Modules\VideoCarousel;

use CarouselSlider\Abstracts\AbstractView;

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
		$slider = $this->get_slider();
		$urls   = $slider->get_videos();

		$this->set_total_slides( count( $urls ) );

		$_html = $this->slider_wrapper_start();

		foreach ( $urls as $url ) {
			$html = '<div class="carousel-slider-item-video">';
			$html .= '<div class="carousel-slider-video-wrapper">';
			$html .= '<a class="magnific-popup" href="' . $url['url'] . '">';
			$html .= '<div class="carousel-slider-video-play-icon"></div>';
			$html .= '<div class="carousel-slider-video-overlay"></div>';
			$html .= '<img class="owl-lazy" data-src="' . $url['thumbnail']['large'] . '"/>';
			$html .= '</a>';
			$html .= '</div>';
			$html .= '</div>';

			$_html .= apply_filters( 'carousel_slider/view/video', $html, $url );
		}

		$_html .= $this->slider_wrapper_end();

		return $_html;
	}
}
