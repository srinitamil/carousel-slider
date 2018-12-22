<?php

namespace CarouselSlider\Abstracts;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

abstract class AbstractSetting {

	/**
	 * Settings sections array
	 *
	 * @var array
	 */
	private $sections = array();

	/**
	 * Settings fields array
	 *
	 * @var array
	 */
	private $fields = array();

	/**
	 * Register carousel settings
	 */
	abstract public function register_settings();

	/**
	 * @return array
	 */
	public function get_sections() {
		$sections = $this->sections;

		// Sort by priority
		usort( $sections, array( $this, 'sort_by_priority' ) );

		return $sections;
	}

	/**
	 * @param array $sections
	 */
	public function set_sections( array $sections ) {
		foreach ( $sections as $section ) {
			$this->set_section( $section );
		}
	}

	/**
	 * Add Setting page section
	 *
	 * @param array $section
	 */
	public function set_section( array $section ) {
		$this->sections[] = wp_parse_args( $section, array(
			'id'       => '',
			'title'    => '',
			'priority' => 100,
			'active'   => false,
		) );
	}

	/**
	 * @return mixed
	 */
	public function get_fields() {
		$fields = $this->fields;

		// Sort by priority
		usort( $fields, array( $this, 'sort_by_priority' ) );

		return $fields;
	}

	/**
	 * @param mixed $fields
	 */
	public function set_fields( $fields ) {
		foreach ( $fields as $field ) {
			$this->set_field( $field );
		}
	}

	/**
	 * Add new settings field
	 *
	 * This method is accessible outside the class for creating settings field
	 *
	 * @param array $args
	 */
	public function set_field( array $args ) {
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
