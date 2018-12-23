<?php

namespace CarouselSlider\Modules\ImageCarousel;

class SliderItem {

	/**
	 * @var int
	 */
	private $id = 0;

	/**
	 * @var string
	 */
	private $title;

	/**
	 * @var string
	 */
	private $caption;

	/**
	 * @var array
	 */
	private $data = array();

	/**
	 * SliderItem constructor.
	 *
	 * @param null|\WP_Post $post
	 */
	public function __construct( $post = null ) {
		$_post         = get_post( $post );
		$this->id      = $_post->ID;
		$this->title   = $_post->post_title;
		$this->caption = $_post->post_excerpt;

		// Read slide data
		$this->read_slide_data();
	}

	/**
	 * Get image id
	 *
	 * @return int
	 */
	public function get_id() {
		return $this->id;
	}

	/**
	 * Get image title
	 *
	 * @return string
	 */
	public function get_title() {
		return $this->title;
	}

	/**
	 * Get image caption
	 *
	 * @return string
	 */
	public function get_caption() {
		return $this->caption;
	}

	/**
	 * Get slide image source
	 *
	 * @param string $size
	 *
	 * @return array
	 */
	public function get_image_src( $size = 'thumbnail' ) {
		$src = wp_get_attachment_image_src( $this->get_id(), $size );

		return array( 'url' => $src[0], 'width' => $src[1], 'height' => $src[2] );
	}

	/**
	 * Get slide image
	 *
	 * @param string $size
	 *
	 * @return string
	 */
	public function get_image( $size = 'thumbnail' ) {
		return wp_get_attachment_image( $this->get_id(), $size, false, array( 'alt' => $this->get_image_alt() ) );
	}

	/**
	 * Get image alt
	 *
	 * @return string
	 */
	public function get_image_alt() {
		return trim( strip_tags( $this->get_prop( 'image_alt' ) ) );
	}

	/**
	 * Get image target url
	 *
	 * @return string
	 */
	public function get_image_target() {
		return esc_url( $this->get_prop( 'slider_link_url' ) );
	}

	/**
	 * Read slider data
	 */
	protected function read_slide_data() {
		$this->data = array(
			'slider_link_url' => $this->get_meta( '_carousel_slider_link_url' ),
			'image_alt'       => $this->get_meta( '_wp_attachment_image_alt' ),
		);
	}

	/**
	 * Get property from data
	 *
	 * @param string $key
	 * @param mixed $default
	 *
	 * @return mixed|null
	 */
	public function get_prop( $key, $default = null ) {
		if ( isset( $this->data[ $key ] ) ) {
			return $this->data[ $key ];
		}

		return $default;
	}

	/**
	 * Retrieve post meta field for a post.
	 *
	 * @param string $key The meta key to retrieve.
	 * @param mixed $default Default value to return if the option does not exist.
	 *
	 * @return mixed
	 */
	protected function get_meta( $key, $default = false ) {
		$meta = get_post_meta( $this->get_id(), $key, true );

		if ( 'zero' == $meta ) {
			return '0';
		}

		// Distinguish between `false` as a default, and not passing one.
		if ( func_num_args() > 1 && empty( $meta ) ) {
			$meta = $default;
		}

		return $meta;
	}
}
