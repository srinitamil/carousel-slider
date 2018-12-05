<?php

namespace CarouselSlider\Supports;

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Carousel {

	const POST_TYPE = 'carousels';

	/**
	 * Slider ID
	 *
	 * @var int
	 */
	private $id = 0;

	/**
	 * Slider Title
	 *
	 * @var string
	 */
	private $title;

	/**
	 * Slider type
	 *
	 * @var string
	 */
	private $type;

	/**
	 * Number of items found from current query
	 *
	 * @var int
	 */
	protected static $found_items = 0;

	/**
	 * Carousel constructor.
	 *
	 * @param int|\WP_Post|null $post Optional. Post ID or post object.
	 */
	public function __construct( $post = null ) {
		$post = get_post( $post );
		if ( $post && self::POST_TYPE == get_post_type( $post ) ) {
			$this->id    = $post->ID;
			$this->title = $post->post_title;
			$this->type  = get_post_meta( $post->ID, '_slide_type', true );
		}
	}

	/**
	 * Get slider(s)
	 *
	 * @param array|int $args
	 *
	 * @return Carousel|Carousel[]
	 */
	public static function find( $args = array() ) {
		if ( is_numeric( $args ) ) {
			return static::findSingle( $args );
		}

		$defaults = array(
			'post_status'    => 'any',
			'posts_per_page' => - 1,
			'offset'         => 0,
			'orderby'        => 'ID',
			'order'          => 'ASC',
		);

		$args = wp_parse_args( $args, $defaults );

		$args['post_type'] = self::POST_TYPE;

		$q     = new \WP_Query();
		$posts = $q->query( $args );

		self::$found_items = $q->found_posts;

		$sliders = array();

		foreach ( (array) $posts as $post ) {
			$sliders[] = new self( $post );
		}

		return $sliders;
	}

	/**
	 * Get slider
	 *
	 * @param int $id
	 *
	 * @return Carousel
	 */
	public static function findSingle( $id = 0 ) {
		return new self( $id );
	}

	/**
	 * Create new slider
	 *
	 * @param array $data
	 */
	public static function create( array $data ) {

	}

	/**
	 * Update current slider
	 *
	 * @param int $slider_id
	 * @param array $data
	 */
	public static function update( $slider_id, array $data ) {

	}

	/**
	 * Trash slider
	 *
	 * @param int $slider_id
	 *
	 * @return bool
	 */
	public static function trash( $slider_id = 0 ) {
		if ( wp_delete_post( $slider_id, false ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Restore trashed slider
	 *
	 * @param int $slider_id
	 *
	 * @return bool
	 */
	public static function restore( $slider_id = 0 ) {
		if ( wp_untrash_post( $slider_id ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Delete slider
	 *
	 * @param int $slider_id
	 *
	 * @return bool
	 */
	public static function delete( $slider_id = 0 ) {
		if ( wp_delete_post( $slider_id, true ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Sanitize meta value
	 *
	 * @param $input
	 *
	 * @return array|string
	 */
	private static function sanitize( $input ) {
		// Initialize the new array that will hold the sanitize values
		$new_input = array();

		if ( is_array( $input ) ) {
			// Loop through the input and sanitize each of the values
			foreach ( $input as $key => $value ) {
				if ( is_array( $value ) ) {
					$new_input[ $key ] = static::sanitize( $value );
				} else {
					$new_input[ $key ] = sanitize_text_field( $value );
				}
			}
		} else {
			return sanitize_text_field( $input );
		}

		return $new_input;
	}
}
