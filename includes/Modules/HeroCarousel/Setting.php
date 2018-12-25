<?php

namespace CarouselSlider\Modules\HeroCarousel;

use CarouselSlider\Abstracts\AbstractSetting;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Setting extends AbstractSetting {

	/**
	 * Register carousel settings
	 */
	public function register_settings() {
		$this->set_section( array(
			'id'       => 'hero_banner_slider',
			'title'    => esc_html__( 'Hero Banner Slider', 'carousel-slider' ),
			'priority' => 10,
			'active'   => true,
		) );

		$fields = array(
			array(
				'id'            => 'content',
				'type'          => 'repeater',
				'section'       => 'hero_banner_slider',
				'label'         => esc_html__( 'Slider items', 'carousel-slider' ),
				'button_text'   => esc_html__( 'Add item', 'carousel-slider' ),
				'default'       => array(),
				'priority'      => 10,
				'primary_field' => 'background',
				'fields'        => array(
					array(
						'id'          => 'background',
						'type'        => 'background',
						'label'       => esc_html__( 'Slide Background', 'carousel-slider' ),
						'description' => esc_html__( 'Controls the background of the slide.', 'carousel-slider' ),
						'default'     => array(),
						'priority'    => 10,
					),
				),
			),
		);
		$this->set_fields( $fields );
	}
}
