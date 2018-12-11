<?php

namespace CarouselSlider\Modules\HeroCarousel;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class SliderItem implements \JsonSerializable {

	/**
	 * @var array
	 */
	private $data = array();

	/**
	 * Class constructor.
	 *
	 * @param array $data
	 */
	public function __construct( $data = array() ) {
		$this->data = $data;
	}

	/**
	 * Get valid background sizes
	 *
	 * @param bool $key_only
	 *
	 * @return array
	 */
	public static function get_background_sizes( $key_only = false ) {
		$sizes = array(
			'auto'    => 'auto',
			'contain' => 'contain',
			'cover'   => 'cover', // Default
		);

		if ( $key_only ) {
			return array_keys( $sizes );
		}

		return $sizes;
	}

	/**
	 * Get background positions
	 *
	 * @param bool $key_only
	 *
	 * @return array
	 */
	public static function get_background_positions( $key_only = false ) {
		$positions = array(
			'left top'      => 'left top',
			'left center'   => 'left center',
			'left bottom'   => 'left bottom',
			'center top'    => 'center top',
			'center center' => 'center', // Default
			'center bottom' => 'center bottom',
			'right top'     => 'right top',
			'right center'  => 'right center',
			'right bottom'  => 'right bottom',
		);

		if ( $key_only ) {
			return array_keys( $positions );
		}

		return $positions;
	}

	/**
	 * Represent current class as array
	 *
	 * @return array
	 */
	public function to_array() {
		return array(
			'heading'           => array(
				'text'      => $this->get_prop( 'slide_heading' ),
				'font_size' => $this->get_prop( 'heading_font_size' ),
				'gutter'    => $this->get_prop( 'heading_gutter' ),
				'color'     => $this->get_prop( 'heading_color' ),
			),
			'description'       => array(
				'text'      => $this->get_prop( 'slide_description' ),
				'font_size' => $this->get_prop( 'description_font_size' ),
				'gutter'    => $this->get_prop( 'description_gutter' ),
				'color'     => $this->get_prop( 'description_color' ),
			),
			'content_alignment' => $this->get_prop( 'content_alignment' ),
			'background'        => array(
				'image'         => $this->get_background_image(),
				'position'      => $this->get_background_position(),
				'size'          => $this->get_background_size(),
				'color'         => $this->get_background_color(),
				'overlay_color' => $this->get_background_overly_color(),
				'effect'        => $this->get_ken_burns_effect(),
			),
			'link_type'         => $this->get_link_type(),
			'full_link'         => array(
				'url'    => $this->get_full_slide_link(),
				'target' => $this->get_full_slide_link_target(),
			),
			'button_one'        => array(
				'text'             => $this->get_button_one_text(),
				'url'              => $this->get_button_one_url(),
				'target'           => $this->get_button_one_target(),
				'type'             => $this->get_button_one_type(),
				'size'             => $this->get_button_one_size(),
				'border_width'     => $this->get_button_one_border_width(),
				'border_radius'    => $this->get_button_one_border_radius(),
				'background_color' => $this->get_button_one_background_color(),
				'color'            => $this->get_button_one_color(),
			),
			'button_two'        => array(
				'text'             => $this->get_button_two_text(),
				'url'              => $this->get_button_two_url(),
				'target'           => $this->get_button_two_target(),
				'type'             => $this->get_button_two_type(),
				'size'             => $this->get_button_two_size(),
				'border_width'     => $this->get_button_two_border_width(),
				'border_radius'    => $this->get_button_two_border_radius(),
				'background_color' => $this->get_button_two_background_color(),
				'color'            => $this->get_button_two_color(),
			),
		);
	}

	/**
	 * Get link type
	 *
	 * @return string
	 */
	private function get_link_type() {
		$link_type = $this->get_prop( 'link_type', 'none' );

		return in_array( $link_type, array( 'none', 'full', 'button' ) ) ? $link_type : 'full';
	}

	/**
	 * Get slide full link url
	 *
	 * @return string
	 */
	public function get_full_slide_link() {
		return esc_url( $this->get_prop( 'slide_link' ) );
	}

	/**
	 * Get slide full link target
	 *
	 * @return string
	 */
	private function get_full_slide_link_target() {
		$link_target = $this->get_prop( 'link_target' );

		return in_array( $link_target, array( '_self', '_blank' ) ) ? $link_target : '_self';
	}

	/**
	 * Get background image information
	 *
	 * @return array|bool
	 */
	public function get_background_image() {
		$image_id = (int) $this->get_prop( 'img_id' );
		$img_src  = wp_get_attachment_image_src( $image_id, 'full' );

		if ( is_array( $img_src ) ) {
			return array(
				'src'    => $img_src[0],
				'width'  => $img_src[1],
				'height' => $img_src[2],
			);
		}

		return false;
	}

	/**
	 * Get background position
	 *
	 * @return string
	 */
	public function get_background_position() {
		$position = $this->get_prop( 'img_bg_position' );
		$valid    = static::get_background_positions( true );

		return in_array( $position, $valid ) ? $position : 'center center';
	}

	/**
	 * Get background position
	 *
	 * @return string
	 */
	public function get_background_size() {
		$size  = $this->get_prop( 'img_bg_size' );
		$valid = static::get_background_sizes( true );

		return in_array( $size, $valid ) ? $size : 'cover';
	}

	/**
	 * Get background color
	 *
	 * @return string
	 */
	public function get_background_color() {
		return $this->get_prop( 'bg_color', 'rgba(255,255,255,0.5)' );
	}

	/**
	 * Get background overlay color
	 *
	 * @return string
	 */
	public function get_background_overly_color() {
		return $this->get_prop( 'bg_overlay', 'rgba(0,0,0,0.5)' );
	}

	/**
	 * Get ken burns effect
	 *
	 * @return string
	 */
	public function get_ken_burns_effect() {
		$effect = $this->get_prop( 'ken_burns_effect' );

		return in_array( $effect, array( "", "zoom-in", "zoom-out" ) ) ? $effect : "";
	}

	/**
	 * Get button one text
	 *
	 * @return string|null
	 */
	public function get_button_one_text() {
		$text = $this->get_prop( 'button_one_text' );

		return $text;
	}

	/**
	 * Get button one url
	 *
	 * @return string|null
	 */
	public function get_button_one_url() {
		$url = $this->get_prop( 'button_one_url' );

		return $url;
	}

	/**
	 * Get button one target
	 *
	 * @return string
	 */
	public function get_button_one_target() {
		$target = $this->get_prop( 'button_one_target' );

		return in_array( $target, array( '_blank', '_self' ) ) ? $target : '_self';
	}

	/**
	 * Get button one type
	 *
	 * @return string
	 */
	public function get_button_one_type() {
		$type = $this->get_prop( 'button_one_type' );

		return in_array( $type, array( 'normal', 'stroke' ) ) ? $type : 'stroke';
	}

	/**
	 * Get button one size
	 *
	 * @return string
	 */
	public function get_button_one_size() {
		$size = $this->get_prop( 'button_one_size' );

		return in_array( $size, array( 'large', 'medium', 'small' ) ) ? $size : 'medium';
	}

	/**
	 * Get button one border width
	 *
	 * @return string
	 */
	public function get_button_one_border_width() {
		return $this->get_prop( 'button_one_border_width', '2px' );
	}

	/**
	 * Get button one border radius
	 *
	 * @return string
	 */
	public function get_button_one_border_radius() {
		return $this->get_prop( 'button_one_border_radius', '3px' );
	}

	/**
	 * Get button one background color
	 *
	 * @return string
	 */
	public function get_button_one_background_color() {
		return $this->get_prop( 'button_one_bg_color', '#00d1b2' );
	}

	/**
	 * Get button one color
	 *
	 * @return string
	 */
	public function get_button_one_color() {
		return $this->get_prop( 'button_one_color', '#ffffff' );
	}

	/**
	 * Get button two text
	 *
	 * @return string|null
	 */
	public function get_button_two_text() {
		$text = $this->get_prop( 'button_two_text' );

		return $text;
	}

	/**
	 * Get button two url
	 *
	 * @return string|null
	 */
	public function get_button_two_url() {
		$url = $this->get_prop( 'button_two_url' );

		return $url;
	}

	/**
	 * Get button two target
	 *
	 * @return string
	 */
	public function get_button_two_target() {
		$target = $this->get_prop( 'button_two_target' );

		return in_array( $target, array( '_blank', '_self' ) ) ? $target : '_self';
	}

	/**
	 * Get button two type
	 *
	 * @return string
	 */
	public function get_button_two_type() {
		$type = $this->get_prop( 'button_two_type' );

		return in_array( $type, array( 'normal', 'stroke' ) ) ? $type : 'stroke';
	}

	/**
	 * Get button two size
	 *
	 * @return string
	 */
	public function get_button_two_size() {
		$size = $this->get_prop( 'button_two_size' );

		return in_array( $size, array( 'large', 'medium', 'small' ) ) ? $size : 'medium';
	}

	/**
	 * Get button two border width
	 *
	 * @return string
	 */
	public function get_button_two_border_width() {
		return $this->get_prop( 'button_two_border_width', '2px' );
	}

	/**
	 * Get button two border radius
	 *
	 * @return string
	 */
	public function get_button_two_border_radius() {
		return $this->get_prop( 'button_two_border_radius', '3px' );
	}

	/**
	 * Get button two background color
	 *
	 * @return string
	 */
	public function get_button_two_background_color() {
		return $this->get_prop( 'button_two_bg_color', '#00d1b2' );
	}

	/**
	 * Get button two color
	 *
	 * @return string
	 */
	public function get_button_two_color() {
		return $this->get_prop( 'button_two_color', '#ffffff' );
	}

	/**
	 * Check button one exists
	 *
	 * @return bool
	 */
	public function has_button_one() {
		$text = $this->get_button_one_text();
		$url  = $this->get_button_one_url();

		return ( ! empty( $text ) && ! empty( $url ) );
	}

	/**
	 * Check button two exists
	 *
	 * @return bool
	 */
	public function has_button_two() {
		$text = $this->get_button_two_text();
		$url  = $this->get_button_two_url();

		return ( ! empty( $text ) && ! empty( $url ) );
	}

	/**
	 * Check if key exists in data
	 *
	 * @param string $key
	 *
	 * @return bool
	 */
	public function has_prop( $key ) {
		return isset( $this->data[ $key ] );
	}

	/**
	 * Get property value from data
	 *
	 * @param string $key
	 * @param null $default
	 *
	 * @return mixed|null
	 */
	public function get_prop( $key, $default = null ) {
		if ( $this->has_prop( $key ) ) {
			return $this->data[ $key ];
		}

		return $default;
	}

	/**
	 * Specify data which should be serialized to JSON
	 * @link https://php.net/manual/en/jsonserializable.jsonserialize.php
	 * @return mixed data which can be serialized by <b>json_encode</b>,
	 * which is a value of any type other than a resource.
	 */
	public function jsonSerialize() {
		return $this->to_array();
	}
}
