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
						'supports'    => array( 'color', 'image', 'position', 'size', 'effect', 'overlay-color' ),
						'default'     => array(),
					),
					array(
						'id'          => 'heading',
						'type'        => 'rich-text',
						'label'       => esc_html__( 'Heading', 'carousel-slider' ),
						'description' => esc_html__( 'Controls the heading text of the slide.', 'carousel-slider' ),
						'supports'    => array( 'text', 'font-size', 'margin-bottom', 'color' ),
						'default'     => array(),
					),
					array(
						'id'          => 'description',
						'type'        => 'rich-text',
						'label'       => esc_html__( 'Description', 'carousel-slider' ),
						'description' => esc_html__( 'Controls the description text of the slide.', 'carousel-slider' ),
						'supports'    => array( 'text', 'font-size', 'margin-bottom', 'color' ),
						'default'     => array(),
					),
					array(
						'id'          => 'link_type',
						'type'        => 'radio-button',
						'label'       => esc_html__( 'Slide Link Type:', 'carousel-slider' ),
						'description' => esc_html__( 'Choose how the slide will link.', 'carousel-slider' ),
						'default'     => 'none',
						'choices'     => array(
							'none'   => esc_html__( 'No Link', 'carousel-slider' ),
							'full'   => esc_html__( 'Full Slide', 'carousel-slider' ),
							'button' => esc_html__( 'Button', 'carousel-slider' ),
						),
					),
					array(
						'id'          => 'full_link_url',
						'type'        => 'url',
						'label'       => esc_html__( 'Slide Link:', 'carousel-slider' ),
						'description' => esc_html__( 'Please enter your URL that will be used to link the full slide.', 'carousel-slider' ),
						'conditions'  => array(
							array(
								'name'     => 'link_type',
								'operator' => '==',
								'value'    => 'full',
							),
						),
					),
					array(
						'id'         => 'full_link_target',
						'type'       => 'radio-button',
						'label'      => esc_html__( 'Slide Link Target:', 'carousel-slider' ),
						'default'    => '_self',
						'choices'    => array(
							'_self'  => esc_html__( 'Same Window', 'carousel-slider' ),
							'_blank' => esc_html__( 'New Window', 'carousel-slider' ),
						),
						'conditions' => array(
							array(
								'name'     => 'link_type',
								'operator' => '==',
								'value'    => 'full',
							),
						),
					),
					array(
						'id'         => 'button_one',
						'type'       => 'button-generator',
						'label'      => esc_html__( 'Button #1', 'carousel-slider' ),
						'supports'   => array( 'text', 'url' ),
						'default'    => array(),
						'conditions' => array(
							array(
								'name'     => 'link_type',
								'operator' => '==',
								'value'    => 'button',
							),
						),
					),
					array(
						'id'         => 'button_two',
						'type'       => 'button-generator',
						'label'      => esc_html__( 'Button #2', 'carousel-slider' ),
						'supports'   => array( 'text', 'url' ),
						'default'    => array(),
						'conditions' => array(
							array(
								'name'     => 'link_type',
								'operator' => '==',
								'value'    => 'button',
							),
						),
					),
				),
			),
		);

		$this->set_fields( $fields );
	}
}
