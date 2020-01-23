<?php

namespace CarouselSlider\Modules\ImageCarousel;

use CarouselSlider\Abstracts\AbstractSetting;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Setting extends AbstractSetting {

	/*
	 * Register image carousel settings
	 */
	public function register_settings() {
		$this->set_section( array(
			'id'       => 'image_carousel',
			'title'    => esc_html__( 'Image Carousel', 'carousel-slider' ),
			'priority' => 10,
			'active'   => true,
		) );
		$settings = array(
			array(
				'id'          => 'images_ids',
				'type'        => 'gallery',
				'section'     => 'image_carousel',
				'label'       => esc_html__( 'Carousel Images', 'carousel-slider' ),
				'description' => esc_html__( 'Choose carousel images from media library.', 'carousel-slider' ),
				'default'     => array(),
				'priority'    => 10,
			),
			array(
				'id'          => 'show_image_title',
				'section'     => 'image_carousel',
				'type'        => 'switch',
				'label'       => esc_html__( 'Show Image Title', 'carousel-slider' ),
				'description' => esc_html__( 'Check to show title below image.', 'carousel-slider' ),
				'default'     => false,
				'priority'    => 20,
			),
			array(
				'id'          => 'show_image_caption',
				'section'     => 'image_carousel',
				'type'        => 'switch',
				'label'       => esc_html__( 'Show Image Caption', 'carousel-slider' ),
				'description' => esc_html__( 'Check to show caption below image.', 'carousel-slider' ),
				'default'     => false,
				'priority'    => 30,
			),
			array(
				'id'          => 'show_lightbox',
				'section'     => 'image_carousel',
				'type'        => 'switch',
				'label'       => esc_html__( 'Show Lightbox Gallery', 'carousel-slider' ),
				'description' => esc_html__( 'Check to show lightbox gallery.', 'carousel-slider' ),
				'default'     => false,
				'priority'    => 40,
			),
			array(
				'id'          => 'image_target',
				'type'        => 'radio-button',
				'section'     => 'image_carousel',
				'label'       => esc_html__( 'Image Target', 'carousel-slider' ),
				'description' => esc_html__( 'Choose where to open the linked image.', 'carousel-slider' ),
				'default'     => '_self',
				'choices'     => array(
					'_self'  => esc_html__( 'Same window', 'carousel-slider' ),
					'_blank' => esc_html__( 'New window', 'carousel-slider' ),
				),
				'priority'    => 50,
			)
		);

		$this->set_fields( $settings );
	}
}
