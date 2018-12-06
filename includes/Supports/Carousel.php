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
	protected $id = 0;

	/**
	 * Slider Title
	 *
	 * @var string
	 */
	protected $title;

	/**
	 * Slider type
	 *
	 * @var string
	 */
	protected $type;

	/**
	 * Cache group.
	 *
	 * @var string
	 */
	protected $cache_group = 'carousel-slider';

	/**
	 * Number of items found from current query
	 *
	 * @var int
	 */
	protected static $found_items = 0;

	/**
	 * Slider data
	 *
	 * @var array
	 */
	protected $data = array();

	/**
	 * Core data changes for this object.
	 *
	 * @var array
	 */
	protected $changes = array();

	/**
	 * This is false until the object is read from the DB.
	 *
	 * @var bool
	 */
	protected $object_read = false;

	/**
	 * Carousel constructor.
	 *
	 * @param int|\WP_Post|null $post Optional. Post ID or post object.
	 */
	public function __construct( $post = null ) {
		$post = get_post( $post );
		if ( $post && self::POST_TYPE == get_post_type( $post ) ) {
			$this->set_id( $post->ID );
			$this->set_title( $post->post_title );
			$this->set_type( $this->get_meta( '_slide_type' ) );
			$this->read_slider_data();
			$this->set_object_read();
		}
	}

	/**
	 * Returns the unique ID for this object.
	 *
	 * @return int
	 */
	public function get_id() {
		return $this->id;
	}

	/**
	 * Set ID.
	 *
	 * @param int $id ID.
	 */
	public function set_id( $id ) {
		$this->id = absint( $id );
	}

	/**
	 * Get slider title
	 *
	 * @return string
	 */
	public function get_title() {
		return $this->title;
	}

	/**
	 * Set slider Title
	 *
	 * @param string $title
	 */
	public function set_title( $title ) {
		$this->title = $title;
	}

	/**
	 * Get slider type
	 *
	 * @return string
	 */
	public function get_type() {
		return $this->type;
	}

	/**
	 * Set slider type
	 *
	 * @param string $type
	 */
	public function set_type( $type ) {
		$this->type = $type;
	}

	/**
	 * Read slider data
	 */
	protected function read_slider_data() {
		$this->data = array(
			// General Settings
			'type'             => $this->get_meta( '_slide_type' ),
			'image_size'       => $this->get_meta( '_image_size' ),
			'stage_padding'    => $this->get_meta( '_stage_padding' ),
			'item_spacing'     => $this->get_meta( '_margin_right' ),
			'lazy_load_image'  => $this->get_meta( '_lazy_load_image' ),
			'infinity_loop'    => $this->get_meta_infinity_loop(),
			'auto_width'       => $this->get_meta( '_auto_width' ),
			// Autoplay Settings
			'autoplay'         => $this->get_meta( '_autoplay' ),
			'autoplay_pause'   => $this->get_meta( '_autoplay_pause' ),
			'autoplay_timeout' => $this->get_meta( '_autoplay_timeout' ),
			'autoplay_speed'   => $this->get_meta( '_autoplay_speed' ),
			// Navigation Settings
			'nav_button'       => $this->get_meta( '_nav_button' ),
			'slide_by'         => $this->get_meta( '_slide_by' ),
			'arrow_position'   => $this->get_meta( '_arrow_position' ),
			'arrow_size'       => $this->get_meta( '_arrow_size' ),
			'dot_nav'          => $this->get_meta( '_dot_nav' ),
			'bullet_position'  => $this->get_meta( '_bullet_position' ),
			'bullet_size'      => $this->get_meta( '_bullet_size' ),
			'bullet_shape'     => $this->get_meta( '_bullet_shape' ),
			'nav_color'        => $this->get_meta( '_nav_color' ),
			'nav_active_color' => $this->get_meta( '_nav_active_color' ),
			// Responsive Settings
			'responsive'       => $this->get_responsive_settings(),
		);
	}

	/**
	 * Get responsive settings
	 *
	 * @return array
	 */
	protected function get_responsive_settings() {
		$items_mobile        = intval( $this->get_meta( '_items_portrait_mobile', 1 ) );
		$items_small_tab     = intval( $this->get_meta( '_items_small_portrait_tablet', 2 ) );
		$items_tablet        = intval( $this->get_meta( '_items_portrait_tablet', 3 ) );
		$items_small_desktop = intval( $this->get_meta( '_items_small_desktop', 4 ) );
		$items_desktop       = intval( $this->get_meta( '_items_desktop', 4 ) );
		$items               = intval( $this->get_meta( '_items', 4 ) );

		return array(
			array( 'breakpoint' => 300, 'items' => $items_mobile ),
			array( 'breakpoint' => 600, 'items' => $items_small_tab ),
			array( 'breakpoint' => 768, 'items' => $items_tablet ),
			array( 'breakpoint' => 993, 'items' => $items_small_desktop ),
			array( 'breakpoint' => 1200, 'items' => $items_desktop ),
			array( 'breakpoint' => 1600, 'items' => $items ),
		);
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
			return static::find_single( $args );
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
	public static function find_single( $id = 0 ) {
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
	 * Retrieve post meta field for a post.
	 *
	 * @param string $key The meta key to retrieve.
	 * @param mixed $default Default value to return if the option does not exist.
	 *
	 * @return mixed
	 */
	public function get_meta( $key, $default = false ) {
		$meta = get_post_meta( $this->id, $key, true );

		if ( 'zero' == $meta ) {
			return '0';
		}

		// Distinguish between `false` as a default, and not passing one.
		if ( func_num_args() > 1 && empty( $meta ) ) {
			$meta = $default;
		}

		return $meta;
	}

	/**
	 * Get infinity loop meta data
	 *
	 * @return mixed
	 */
	protected function get_meta_infinity_loop() {
		$new = $this->get_meta( '_infinity_loop' );
		$old = $this->get_meta( '_inifnity_loop' );

		return ! empty( $new ) ? $new : $old;
	}

	/**
	 * Set a collection of props in one go, collect any errors, and return the result.
	 * Only sets using public methods.
	 *
	 * @param array $props Key value pairs to set. Key is the prop and should map to a setter function name.
	 *
	 * @return bool|\WP_Error
	 */
	public function set_props( $props ) {
		$errors = new \WP_Error();

		foreach ( $props as $prop => $value ) {
			try {
				$setter = "set_$prop";
				if ( ! is_null( $value ) && is_callable( array( $this, $setter ) ) ) {
					$reflection = new \ReflectionMethod( $this, $setter );

					if ( $reflection->isPublic() || $reflection->isProtected() ) {
						$this->{$setter}( $value );
					}
				}
			} catch ( \Exception $e ) {
				$errors->add( $e->getCode(), $e->getMessage() );
			}
		}

		return count( $errors->get_error_codes() ) ? $errors : true;
	}

	/**
	 * Gets a prop for a getter method.
	 *
	 * Gets the value from either current pending changes, or the data itself.
	 * Context controls what happens to the value before it's returned.
	 *
	 * @param  string $prop Name of prop to get.
	 * @param  string $context What the value is for. Valid values are view and edit.
	 *
	 * @return mixed
	 */
	protected function get_prop( $prop, $context = 'view' ) {
		$value = null;

		if ( array_key_exists( $prop, $this->data ) ) {
			$value = array_key_exists( $prop, $this->changes ) ? $this->changes[ $prop ] : $this->data[ $prop ];

			if ( 'view' === $context ) {
				$value = apply_filters( 'carousel_slider_data_get_' . $prop, $value, $this );
			}
		}

		return $value;
	}

	/**
	 * Sets a prop for a setter method.
	 *
	 * This stores changes in a special array so we can track what needs saving
	 * the the DB later.
	 *
	 * @param string $prop Name of prop to set.
	 * @param mixed $value Value of the prop.
	 */
	protected function set_prop( $prop, $value ) {
		if ( array_key_exists( $prop, $this->data ) ) {
			if ( true === $this->object_read ) {
				if ( $value !== $this->data[ $prop ] || array_key_exists( $prop, $this->changes ) ) {
					$this->changes[ $prop ] = $value;
				}
			} else {
				$this->data[ $prop ] = $value;
			}
		}
	}

	/**
	 * Set object read property.
	 *
	 * @param boolean $read Should read?.
	 */
	public function set_object_read( $read = true ) {
		$this->object_read = (bool) $read;
	}

	/**
	 * Get object read property.
	 *
	 * @return boolean
	 */
	public function get_object_read() {
		return (bool) $this->object_read;
	}

	/**
	 * Return data changes only.
	 *
	 * @return array
	 */
	public function get_changes() {
		return $this->changes;
	}

	/**
	 * Merge changes with data and clear.
	 */
	public function apply_changes() {
		$this->data    = array_replace_recursive( $this->data, $this->changes );
		$this->changes = array();
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
