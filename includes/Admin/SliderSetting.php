<?php

namespace CarouselSlider\Admin;

use CarouselSlider\Supports\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class SliderSetting {

	/**
	 * Settings sections array
	 *
	 * @var array
	 */
	private $sections = array();

	/**
	 * Settings fields array
	 */
	private $fields = array();

	/**
	 * The instance of the class
	 *
	 * @var self
	 */
	private static $instance = null;

	/**
	 * @return self
	 */
	public static function init() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();

			add_action( 'admin_init', array( self::$instance, 'add_settings' ) );
		}

		return self::$instance;
	}

	public function add_settings() {
		$this->add_section( array(
			'id'       => 'general_settings',
			'title'    => esc_html__( 'General Settings', 'carousel-slider' ),
			'priority' => 10,
		) );
		$this->add_section( array(
			'id'       => 'autoplay_settings',
			'title'    => esc_html__( 'Autoplay Settings', 'carousel-slider' ),
			'priority' => 20,
		) );
		$this->add_section( array(
			'id'       => 'navigation_settings',
			'title'    => esc_html__( 'Navigation Settings', 'carousel-slider' ),
			'priority' => 30,
		) );
		$this->add_section( array(
			'id'       => 'responsive_settings',
			'title'    => esc_html__( 'Responsive Settings', 'carousel-slider' ),
			'priority' => 40,
		) );
		// Settings
		$this->add_field( array(
			'id'          => 'image_size',
			'section'     => 'general_settings',
			'type'        => 'select',
			'label'       => esc_html__( 'Carousel image size', 'carousel-slider' ),
			'description' => sprintf( esc_html__( 'Choose "original uploaded image" for full size image or your desired image size for carousel image. You can change the default size for thumbnail, medium and large from %1$s Settings >> Media %2$s.', 'carousel-slider' ),
				'<a target="_blank" href="' . get_admin_url() . 'options-media.php">', '</a>'
			),
			'default'     => 'medium_large',
			'choices'     => Utils::get_available_image_sizes(),
			'priority'    => 10,
		) );
		$this->add_field( array(
			'id'          => 'item_spacing',
			'section'     => 'general_settings',
			'type'        => 'slider',
			'label'       => esc_html__( 'Item Spacing.', 'carousel-slider' ),
			'description' => esc_html__( 'Space between two slide. Enter 10 for 10px', 'carousel-slider' ),
			'default'     => Utils::get_default_setting( 'margin_right' ),
			'input_attrs' => array( 'min' => 0, 'max' => 100 ),
			'priority'    => 20,
		) );
		$this->add_field( array(
			'id'          => 'stage_padding',
			'section'     => 'general_settings',
			'type'        => 'slider',
			'label'       => esc_html__( 'Stage Padding', 'carousel-slider' ),
			'description' => esc_html__( 'Add left and right padding on carousel slider stage wrapper.', 'carousel-slider' ),
			'default'     => 0,
			'input_attrs' => array( 'min' => 0, 'max' => 300 ),
			'priority'    => 30,
		) );
		$this->add_field( array(
			'id'          => 'lazy_load_image',
			'section'     => 'general_settings',
			'type'        => 'switch',
			'label'       => esc_html__( 'Lazy Loading', 'carousel-slider' ),
			'description' => esc_html__( 'Enable image with lazy loading.', 'carousel-slider' ),
			'default'     => true,
			'priority'    => 40,
		) );
		$this->add_field( array(
			'id'          => 'infinity_loop',
			'section'     => 'general_settings',
			'type'        => 'switch',
			'label'       => esc_html__( 'Infinity loop', 'carousel-slider' ),
			'description' => esc_html__( 'Enable or disable loop(circular) of carousel.', 'carousel-slider' ),
			'default'     => true,
			'priority'    => 50,
		) );
		$this->add_field( array(
			'id'          => 'auto_width',
			'section'     => 'general_settings',
			'type'        => 'switch',
			'label'       => esc_html__( 'Auto Width', 'carousel-slider' ),
			'description' => esc_html__( 'Set item width according to its content width. Use width style on item to get the result you want. ', 'carousel-slider' ),
			'default'     => false,
			'priority'    => 60,
		) );
		// Autoplay settings
		$this->add_field( array(
			'id'          => 'autoplay',
			'section'     => 'autoplay_settings',
			'type'        => 'switch',
			'label'       => esc_html__( 'Autoplay', 'carousel-slider' ),
			'description' => esc_html__( 'Check to enable autoplay', 'carousel-slider' ),
			'default'     => true,
			'priority'    => 10,
		) );
		$this->add_field( array(
			'id'          => 'autoplay_pause',
			'section'     => 'autoplay_settings',
			'type'        => 'switch',
			'label'       => esc_html__( 'Autoplay Hover Pause', 'carousel-slider' ),
			'description' => esc_html__( 'Pause autoplay on mouse hover.', 'carousel-slider' ),
			'default'     => true,
			'priority'    => 20,
		) );
		$this->add_field( array(
			'id'          => 'autoplay_timeout',
			'section'     => 'autoplay_settings',
			'type'        => 'slider',
			'label'       => esc_html__( 'Autoplay Timeout', 'carousel-slider' ),
			'description' => esc_html__( 'Autoplay interval timeout in millisecond. Default: 5000', 'carousel-slider' ),
			'default'     => 5000,
			'input_attrs' => array( 'min' => 0, 'max' => 10000, 'step' => 500 ),
			'priority'    => 30,
		) );
		$this->add_field( array(
			'id'          => 'autoplay_speed',
			'section'     => 'autoplay_settings',
			'type'        => 'slider',
			'label'       => esc_html__( 'Autoplay Speed', 'carousel-slider' ),
			'description' => esc_html__( 'Autoplay speed in millisecond. Default: 500', 'carousel-slider' ),
			'default'     => 500,
			'input_attrs' => array( 'min' => 0, 'max' => 5000, 'step' => 100 ),
			'priority'    => 40,
		) );
		// Navigation settings
		$this->add_field( array(
			'id'          => 'arrow_visibility',
			'type'        => 'radio-button',
			'section'     => 'navigation_settings',
			'label'       => esc_html__( 'Show Arrow Nav', 'carousel-slider' ),
			'description' => esc_html__( 'Choose when to show arrow navigator.', 'carousel-slider' ),
			'default'     => 'always',
			'choices'     => array(
				'never'  => esc_html__( 'Never', 'carousel-slider' ),
				'hover'  => esc_html__( 'Mouse Over', 'carousel-slider' ),
				'always' => esc_html__( 'Always', 'carousel-slider' ),
			),
			'priority'    => 10,
		) );
		$this->add_field( array(
			'id'          => 'arrow_steps',
			'section'     => 'navigation_settings',
			'type'        => 'slider',
			'label'       => esc_html__( 'Arrow Steps', 'carousel-slider' ),
			'description' => esc_html__( 'Steps to go for each navigation request. Enter 0 (zero) to slide by page.',
				'carousel-slider' ),
			'default'     => 1,
			'input_attrs' => array( 'min' => 0, 'max' => 20, 'step' => 1 ),
			'priority'    => 20,
		) );
		$this->add_field( array(
			'id'          => 'arrow_position',
			'section'     => 'navigation_settings',
			'type'        => 'radio-button',
			'label'       => esc_html__( 'Arrow Position', 'carousel-slider' ),
			'description' => esc_html__( 'Choose where to show arrow. Inside slider or outside slider.', 'carousel-slider' ),
			'default'     => 'outside',
			'choices'     => array(
				'outside' => esc_html__( 'outside', 'carousel-slider' ),
				'inside'  => esc_html__( 'Inside', 'carousel-slider' ),
			),
			'priority'    => 30,
		) );
		$this->add_field( array(
			'id'          => 'arrow_size',
			'section'     => 'navigation_settings',
			'type'        => 'slider',
			'label'       => esc_html__( 'Arrow Size', 'carousel-slider' ),
			'description' => esc_html__( 'Enter arrow size in pixels.', 'carousel-slider' ),
			'default'     => 48,
			'input_attrs' => array( 'min' => 16, 'max' => 96, 'step' => 1 ),
			'priority'    => 40,
		) );
		$this->add_field( array(
			'id'          => 'dots_visibility',
			'section'     => 'navigation_settings',
			'type'        => 'radio-button',
			'label'       => esc_html__( 'Show Bullet Nav', 'carousel-slider' ),
			'description' => esc_html__( 'Choose when to show bullet navigator.', 'carousel-slider' ),
			'default'     => 'always',
			'choices'     => array(
				'never'  => esc_html__( 'Never', 'carousel-slider' ),
				'always' => esc_html__( 'Always', 'carousel-slider' ),
				'hover'  => esc_html__( 'Mouse Over', 'carousel-slider' ),
			),
			'priority'    => 50,
		) );
		$this->add_field( array(
			'id'          => 'dots_position',
			'type'        => 'radio-button',
			'section'     => 'navigation_settings',
			'label'       => esc_html__( 'Bullet Position', 'carousel-slider' ),
			'description' => esc_html__( 'Choose where to show bullets.', 'carousel-slider' ),
			'default'     => 'center',
			'choices'     => array(
				'left'   => esc_html__( 'Left', 'carousel-slider' ),
				'center' => esc_html__( 'Center', 'carousel-slider' ),
				'right'  => esc_html__( 'Right', 'carousel-slider' ),
			),
			'priority'    => 60,
		) );
		$this->add_field( array(
			'type'        => 'slider',
			'id'          => 'dots_size',
			'section'     => 'navigation_settings',
			'label'       => esc_html__( 'Bullet Size', 'carousel-slider' ),
			'description' => esc_html__( 'Enter bullet size in pixels.', 'carousel-slider' ),
			'default'     => 10,
			'input_attrs' => array( 'min' => 4, 'max' => 48, 'step' => 1 ),
			'priority'    => 70,
		) );
		$this->add_field( array(
			'id'          => 'dots_shape',
			'type'        => 'radio-button',
			'section'     => 'navigation_settings',
			'label'       => esc_html__( 'Bullet Shape', 'carousel-slider' ),
			'description' => esc_html__( 'Choose bullet nav shape.', 'carousel-slider' ),
			'default'     => 'square',
			'choices'     => array(
				'square' => esc_html__( 'Square', 'carousel-slider' ),
				'circle' => esc_html__( 'Circle', 'carousel-slider' ),
			),
			'priority'    => 80,
		) );
		$this->add_field( array(
			'id'          => 'nav_color',
			'type'        => 'color',
			'section'     => 'navigation_settings',
			'label'       => esc_html__( 'Arrows and Dots Color', 'carousel-slider' ),
			'description' => esc_html__( 'Pick a color for navigation and dots.', 'carousel-slider' ),
			'default'     => Utils::get_default_setting( 'nav_color' ),
			'priority'    => 90,
		) );
		$this->add_field( array(
			'id'          => 'nav_active_color',
			'type'        => 'color',
			'section'     => 'navigation_settings',
			'label'       => esc_html__( 'Arrows and Dots Hover Color', 'carousel-slider' ),
			'description' => esc_html__( 'Pick a color for navigation and dots for active and hover effect.', 'carousel-slider' ),
			'default'     => Utils::get_default_setting( 'nav_active_color' ),
			'priority'    => 100,
		) );
		// Responsive Settings
		$this->add_field( array(
			'id'          => 'items_mobile',
			'section'     => 'responsive_settings',
			'type'        => 'slider',
			'label'       => esc_html__( 'Columns : Mobile', 'carousel-slider' ),
			'description' => esc_html__( 'The number of items you want to see on the Mobile Layout (Screens size less than 600px)', 'carousel-slider' ),
			'default'     => 1,
			'input_attrs' => array( 'min' => 1, 'max' => 10, 'step' => 1 ),
			'priority'    => 10,
		) );
		$this->add_field( array(
			'id'               => 'items_mobile_landscape',
			'section'          => 'responsive_settings',
			'type'             => 'slider',
			'label'            => esc_html__( 'Columns : Mobile Landscape', 'carousel-slider' ),
			'description'      => esc_html__( 'The number of items you want to see on the landscape mobile (Screens size less than 768px)', 'carousel-slider' ),
			'default'          => 2,
			'input_attributes' => array( 'min' => 1, 'max' => 10, 'step' => 1 ),
			'priority'         => 20,
		) );
		$this->add_field( array(
			'id'               => 'items_tablet',
			'section'          => 'responsive_settings',
			'type'             => 'slider',
			'label'            => esc_html__( 'Columns : Tablet', 'carousel-slider' ),
			'description'      => esc_html__( 'The number of items you want to see on the tablet (Screens size from 768 pixels DP to 992 pixels DP)', 'carousel-slider' ),
			'default'          => 3,
			'input_attributes' => array( 'min' => 1, 'max' => 10, 'step' => 1 ),
			'priority'         => 30,
		) );
		$this->add_field( array(
			'id'               => 'items_desktop_small',
			'section'          => 'responsive_settings',
			'type'             => 'slider',
			'label'            => esc_html__( 'Columns : Small Desktop', 'carousel-slider' ),
			'description'      => esc_html__( 'The number of items you want to see on the Small Desktop Layout (Screens size from 993 pixels DP to 1199 pixels DP)', 'carousel-slider' ),
			'default'          => 4,
			'input_attributes' => array( 'min' => 1, 'max' => 20, 'step' => 1 ),
			'priority'         => 40,
		) );
		$this->add_field( array(
			'id'               => 'items_desktop',
			'section'          => 'responsive_settings',
			'type'             => 'slider',
			'label'            => esc_html__( 'Columns : Desktop', 'carousel-slider' ),
			'description'      => esc_html__( 'The number of items you want to see on the Desktop Layout (Screens size from 1200 pixels DP to 1920 pixels DP)', 'carousel-slider' ),
			'default'          => 4,
			'input_attributes' => array( 'min' => 1, 'max' => 20, 'step' => 1 ),
			'priority'         => 50,
		) );
		$this->add_field( array(
			'id'               => 'items_desktop_large',
			'section'          => 'responsive_settings',
			'type'             => 'slider',
			'label'            => esc_html__( 'Columns : Desktop Large', 'carousel-slider' ),
			'description'      => esc_html__( 'The number of items you want to see on the Extra Large Desktop Layout (Screens size greater than 1921 pixels DP)', 'carousel-slider' ),
			'default'          => 4,
			'input_attributes' => array( 'min' => 1, 'max' => 20, 'step' => 1 ),
			'priority'         => 60,
		) );
	}

	/**
	 * Add Setting page section
	 *
	 * @param array $section
	 *
	 * @return $this
	 */
	public function add_section( array $section ) {
		$this->sections[] = wp_parse_args( $section, array(
			'id'       => '',
			'title'    => '',
			'priority' => 100,
		) );

		return $this;
	}

	/**
	 * Get sections
	 *
	 * @return array
	 */
	public function get_sections() {
		$sections = apply_filters( 'carousel_slider/settings/sections', $this->sections );

		// Sort by priority
		usort( $sections, array( $this, 'sort_by_priority' ) );

		return $sections;
	}

	/**
	 * Add new settings field
	 *
	 * This method is accessible outside the class for creating settings field
	 *
	 * @param array $args
	 *
	 * @return $this
	 */
	public function add_field( array $args ) {
		$default = array(
			'id'                => '',
			'type'              => 'text',
			'label'             => '',
			'description'       => '',
			'default'           => null,
			'required'          => false,
			'section'           => 'default',
			'priority'          => 100,
			'choices'           => array(),
			'input_attrs'       => array(),
			'validate_callback' => '',
			'sanitize_callback' => '',
		);

		$this->fields[ $args['id'] ] = wp_parse_args( $args, $default );

		return $this;
	}

	/**
	 * Get fields
	 *
	 * @return array
	 */
	public function get_fields() {
		$fields = apply_filters( 'carousel_slider/settings/fields', $this->fields );

		// Sort by priority
		usort( $fields, array( $this, 'sort_by_priority' ) );

		return $fields;
	}

	/**
	 * @param array $array1
	 * @param array $array2
	 *
	 * @return mixed
	 */
	private function sort_by_priority( $array1, $array2 ) {
		return $array1['priority'] - $array2['priority'];
	}
}
