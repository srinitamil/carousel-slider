<?php

namespace CarouselSlider\Modules\ImageCarouselUrl;

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
			'id'       => 'image_carousel_url',
			'title'    => esc_html__( 'Image Carousel', 'carousel-slider' ),
			'priority' => 10,
			'active'   => true,
		) );
		$settings = array(
			array(
				'id'            => 'images_urls',
				'type'          => 'repeater',
				'section'       => 'image_carousel_url',
				'label'         => esc_html__( 'Slider items', 'carousel-slider' ),
				'button_text'   => esc_html__( 'Add item', 'carousel-slider' ),
				'default'       => array(),
				'priority'      => 10,
				'primary_field' => 'title',
				'fields'        => array(
					array(
						'id'       => 'url',
						'type'     => 'url',
						'label'    => esc_html__( 'Image URL', 'carousel-slider' ),
						'priority' => 10,
					),
					array(
						'id'       => 'title',
						'type'     => 'text',
						'label'    => esc_html__( 'Image Title', 'carousel-slider' ),
						'priority' => 20,
					),
					array(
						'id'       => 'caption',
						'type'     => 'text',
						'label'    => esc_html__( 'Image Caption', 'carousel-slider' ),
						'priority' => 20,
					),
					array(
						'id'       => 'alt',
						'type'     => 'text',
						'label'    => esc_html__( 'Image Alt Text', 'carousel-slider' ),
						'priority' => 20,
					),
					array(
						'id'       => 'link_url',
						'type'     => 'url',
						'label'    => esc_html__( 'Image Link to (URL)', 'carousel-slider' ),
						'priority' => 20,
					),
				),
			),
			array(
				'id'          => 'show_image_title',
				'section'     => 'image_carousel_url',
				'type'        => 'switch',
				'label'       => esc_html__( 'Show Image Title', 'carousel-slider' ),
				'description' => esc_html__( 'Check to show title below image.', 'carousel-slider' ),
				'default'     => false,
				'priority'    => 20,
			),
			array(
				'id'          => 'show_image_caption',
				'section'     => 'image_carousel_url',
				'type'        => 'switch',
				'label'       => esc_html__( 'Show Image Caption', 'carousel-slider' ),
				'description' => esc_html__( 'Check to show caption below image.', 'carousel-slider' ),
				'default'     => false,
				'priority'    => 30,
			),
			array(
				'id'          => 'show_lightbox',
				'section'     => 'image_carousel_url',
				'type'        => 'switch',
				'label'       => esc_html__( 'Show Lightbox Gallery', 'carousel-slider' ),
				'description' => esc_html__( 'Check to show lightbox gallery.', 'carousel-slider' ),
				'default'     => false,
				'priority'    => 40,
			),
			array(
				'id'          => 'image_target',
				'type'        => 'radio-button',
				'section'     => 'image_carousel_url',
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
