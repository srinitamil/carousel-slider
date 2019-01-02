<?php

namespace CarouselSlider\Modules\VideoCarousel;

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
			'id'       => 'video_carousel',
			'title'    => esc_html__( 'Video Carousel', 'carousel-slider' ),
			'priority' => 10,
			'active'   => true,
		) );

		$settings = array(
			array(
				'id'            => 'video_urls',
				'type'          => 'repeater',
				'section'       => 'video_carousel',
				'label'         => esc_html__( 'Slider items', 'carousel-slider' ),
				'button_text'   => esc_html__( 'Add item', 'carousel-slider' ),
				'default'       => array(),
				'priority'      => 10,
				'primary_field' => 'url',
				'fields'        => array(
					array(
						'id'          => 'url',
						'type'        => 'textarea',
						'label'       => esc_html__( 'Video URL', 'carousel-slider' ),
						'priority'    => 10,
						'input_attrs' => array( 'rows' => 3 ),
					),
				),
			),
		);

		$this->set_fields( $settings );
	}
}
