<?php

namespace CarouselSlider\Modules\HeroCarousel;

class HeroCarouselItem {

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
				'color'         => $this->get_prop( 'bg_color' ),
				'overlay_color' => $this->get_prop( 'bg_overlay' ),
				'effect'        => $this->get_prop( 'ken_burns_effect' ),
			),
			'link_type'         => $this->get_prop( 'link_type' ),
			'full_link'         => array(
				'url'    => $this->get_prop( 'slide_link' ),
				'target' => $this->get_prop( 'link_target' ),
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
				'text'             => $this->get_prop( 'button_two_text' ),
				'url'              => $this->get_prop( 'button_two_url' ),
				'target'           => $this->get_prop( 'button_two_target' ),
				'type'             => $this->get_prop( 'button_two_type' ),
				'size'             => $this->get_prop( 'button_two_size' ),
				'border_width'     => $this->get_prop( 'button_two_border_width' ),
				'border_radius'    => $this->get_prop( 'button_two_border_radius' ),
				'background_color' => $this->get_prop( 'button_two_bg_color' ),
				'color'            => $this->get_prop( 'button_two_color' ),
			),
		);
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
	 * Get button on text
	 *
	 * @return string|null
	 */
	public function get_button_one_text() {
		$text = $this->get_prop( 'button_one_text' );

		return $text;
	}

	/**
	 * Get button on url
	 *
	 * @return string|null
	 */
	public function get_button_one_url() {
		$url = $this->get_prop( 'button_one_url' );

		return $url;
	}

	/**
	 * Get button on target
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
	 * Get button one type
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
}