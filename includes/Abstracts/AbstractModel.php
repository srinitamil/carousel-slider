<?php

namespace CarouselSlider\Abstracts;

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class AbstractModel implements \JsonSerializable {

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
	 * Get found items
	 *
	 * @return int
	 */
	public static function get_found_items() {
		return self::$found_items;
	}

	/**
	 * Represent current class as array
	 *
	 * @return array
	 */
	public function to_array() {
		return array(
			'id'                     => $this->get_id(),
			'title'                  => $this->get_title(),
			'type'                   => $this->get_type(),
			// General Settings
			'image_size'             => $this->get_image_size(),
			'lazy_load_image'        => $this->get_lazy_load_image(),
			'stage_padding'          => $this->get_stage_padding(),
			'item_spacing'           => $this->get_item_spacing(),
			'infinity_loop'          => $this->get_infinity_loop(),
			'auto_width'             => $this->get_auto_width(),
			// Autoplay Settings
			'autoplay'               => $this->get_autoplay(),
			'autoplay_pause'         => $this->get_autoplay_hover_pause(),
			'autoplay_timeout'       => $this->get_autoplay_timeout(),
			'autoplay_speed'         => $this->get_autoplay_speed(),
			// Navigation Settings
			'arrow_nav'              => $this->is_nav_enabled(),
			'arrow_visibility'       => $this->get_arrow_visibility(),
			'arrow_position'         => $this->get_arrow_position(),
			'arrow_size'             => $this->get_arrow_size(),
			'arrow_steps'            => $this->get_arrow_steps(),
			'dot_nav'                => $this->is_dot_enabled(),
			'dots_visibility'        => $this->get_dots_visibility(),
			'dots_position'          => $this->get_dots_position(),
			'dots_shape'             => $this->get_dots_shape(),
			'dots_size'              => $this->get_dots_size(),
			'nav_color'              => $this->get_nav_color(),
			'nav_active_color'       => $this->get_nav_active_color(),
			// Responsive Settings
			'items_mobile'           => $this->get_items_mobile(),
			'items_mobile_landscape' => $this->get_items_mobile_landscape(),
			'items_tablet'           => $this->get_items_tablet(),
			'items_desktop_small'    => $this->get_items_desktop_small(),
			'items_desktop'          => $this->get_items_desktop(),
			'items_desktop_large'    => $this->get_items_desktop_large(),
		);
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
		return $this->get_prop( 'type' );
	}

	/**
	 * Set slider type
	 *
	 * @param string $type
	 */
	public function set_type( $type ) {
		$this->set_prop( 'type', $type );
	}

	/**
	 * Get slider image size
	 *
	 * @return string
	 */
	public function get_image_size() {
		return $this->get_prop( 'image_size' );
	}

	/**
	 * Check if lazy load enabled
	 *
	 * @return bool
	 */
	public function get_lazy_load_image() {
		return $this->is_checked( $this->get_prop( 'lazy_load_image' ) );
	}

	/**
	 * Left and right padding on carousel slider stage wrapper.
	 *
	 * @return int
	 */
	public function get_stage_padding() {
		return intval( $this->get_prop( 'stage_padding' ) );
	}

	/**
	 * Get space between two slide
	 *
	 * @return int
	 */
	public function get_item_spacing() {
		return intval( $this->get_prop( 'item_spacing' ) );
	}

	/**
	 * Checked infinity loop is enabled or disabled
	 *
	 * @return bool
	 */
	public function get_infinity_loop() {
		return $this->is_checked( $this->get_prop( 'infinity_loop' ) );
	}

	/**
	 * Check auto width is enabled
	 *
	 * @return bool
	 */
	public function get_auto_width() {
		return $this->is_checked( $this->get_prop( 'auto_width' ) );
	}

	/**
	 * Check if autoplay is enabled
	 *
	 * @return bool
	 */
	public function get_autoplay() {
		return $this->is_checked( $this->get_prop( 'autoplay' ) );
	}

	/**
	 * Check autoplay hover pause is enabled
	 *
	 * @return bool
	 */
	public function get_autoplay_hover_pause() {
		return $this->is_checked( $this->get_prop( 'autoplay_pause' ) );
	}

	/**
	 * Get autoplay timeout
	 *
	 * @return int
	 */
	public function get_autoplay_timeout() {
		return intval( $this->get_prop( 'autoplay_timeout' ) );
	}

	/**
	 * Get autoplay speed
	 *
	 * @return int
	 */
	public function get_autoplay_speed() {
		return intval( $this->get_prop( 'autoplay_speed' ) );
	}

	/**
	 * Get slider navigation color
	 *
	 * @return string
	 */
	public function get_nav_color() {
		return $this->get_prop( 'nav_color' );
	}

	/**
	 * Get slider navigation color for hover and active state
	 *
	 * @return string
	 */
	public function get_nav_active_color() {
		return $this->get_prop( 'nav_active_color' );
	}

	/**
	 * Check if navigation is enabled
	 *
	 * @return bool
	 */
	public function is_nav_enabled() {
		return 'never' !== $this->get_arrow_visibility();
	}

	/**
	 * Get arrow visibility
	 *
	 * @return string
	 */
	public function get_arrow_visibility() {
		$visibility = $this->get_prop( 'arrow_visibility' );

		if ( in_array( $visibility, array( 'always', 'hover', 'never' ) ) ) {
			return $visibility;
		}

		if ( 'on' == $visibility ) {
			return 'hover';
		}

		if ( 'off' == $visibility ) {
			return 'never';
		}

		return 'always';
	}

	/**
	 * Get arrow position
	 *
	 * @return string
	 */
	public function get_arrow_position() {
		$arrow_position = $this->get_prop( '_arrow_position' );

		return in_array( $arrow_position, array( 'inside', 'outside' ) ) ? $arrow_position : 'outside';
	}

	/**
	 * Get arrow navigation size
	 *
	 * @return int
	 */
	public function get_arrow_size() {
		return intval( $this->get_prop( 'arrow_size' ) );
	}

	/**
	 * Get number of steps to go for each navigation request
	 *
	 * @return int|string
	 */
	public function get_arrow_steps() {
		$slide_by = $this->get_prop( 'arrow_steps' );

		if ( ! empty( $slide_by ) && false !== strpos( 'page', $slide_by ) ) {
			return 'page';
		}

		return intval( $slide_by );
	}

	/**
	 * Check if dot navigation is enabled
	 *
	 * @return bool
	 */
	public function is_dot_enabled() {
		return 'never' !== $this->get_dots_visibility();
	}

	/**
	 * Get dots visibility
	 *
	 * @return string
	 */
	public function get_dots_visibility() {
		$visibility = $this->get_prop( 'dots_visibility' );

		if ( in_array( $visibility, array( 'always', 'hover', 'never' ) ) ) {
			return $visibility;
		}

		if ( 'on' == $visibility ) {
			return 'always';
		}

		if ( 'off' == $visibility ) {
			return 'never';
		}

		return $visibility;
	}

	/**
	 * Get dots position
	 *
	 * @return string
	 */
	public function get_dots_position() {
		$arrow_position = $this->get_prop( 'bullet_position' );

		return in_array( $arrow_position, array( 'left', 'center', 'right' ) ) ? $arrow_position : 'center';
	}

	/**
	 * Get dots shape
	 *
	 * @return string
	 */
	public function get_dots_shape() {
		$arrow_position = $this->get_prop( 'bullet_shape' );

		return in_array( $arrow_position, array( 'square', 'circle' ) ) ? $arrow_position : 'circle';
	}

	/**
	 * Get dots size
	 *
	 * @return int
	 */
	public function get_dots_size() {
		return intval( $this->get_prop( 'dots_size' ) );
	}

	/**
	 * Get number of items to display on mobile device
	 *
	 * @return int
	 */
	public function get_items_mobile() {
		return intval( $this->get_prop( 'items_mobile' ) );
	}

	/**
	 * Get number of items to display on mobile (landscape view) device
	 *
	 * @return int
	 */
	public function get_items_mobile_landscape() {
		return intval( $this->get_prop( 'items_mobile_landscape' ) );
	}

	/**
	 * Get number of items to display on tablet device
	 *
	 * @return int
	 */
	public function get_items_tablet() {
		return intval( $this->get_prop( 'items_tablet' ) );
	}

	/**
	 * Get number of items to display on small desktop
	 *
	 * @return int
	 */
	public function get_items_desktop_small() {
		return intval( $this->get_prop( 'items_desktop_small' ) );
	}

	/**
	 * Get number of items to display on desktop
	 *
	 * @return int
	 */
	public function get_items_desktop() {
		return intval( $this->get_prop( 'items_desktop' ) );
	}

	/**
	 * Get number of items to display on large desktop
	 *
	 * @return int
	 */
	public function get_items_desktop_large() {
		return intval( $this->get_prop( 'items_desktop_large' ) );
	}

	/**
	 * Read slider data
	 */
	protected function read_slider_data() {
		$this->data = array(
			// General Settings
			'type'                   => $this->get_meta( '_slide_type' ),
			'image_size'             => $this->get_meta( '_image_size' ),
			'stage_padding'          => $this->get_meta( '_stage_padding' ),
			'item_spacing'           => $this->get_meta( '_margin_right' ),
			'lazy_load_image'        => $this->get_meta( '_lazy_load_image' ),
			'infinity_loop'          => $this->get_meta_infinity_loop(),
			'auto_width'             => $this->get_meta( '_auto_width' ),
			// Autoplay Settings
			'autoplay'               => $this->get_meta( '_autoplay' ),
			'autoplay_pause'         => $this->get_meta( '_autoplay_pause' ),
			'autoplay_timeout'       => $this->get_meta( '_autoplay_timeout' ),
			'autoplay_speed'         => $this->get_meta( '_autoplay_speed' ),
			// Navigation Settings
			'arrow_visibility'       => $this->get_meta( '_nav_button' ),
			'arrow_steps'            => $this->get_meta( '_slide_by' ),
			'arrow_position'         => $this->get_meta( '_arrow_position' ),
			'arrow_size'             => $this->get_meta( '_arrow_size' ),
			'dots_visibility'        => $this->get_meta( '_dot_nav' ),
			'dots_position'          => $this->get_meta( '_bullet_position' ),
			'dots_size'              => $this->get_meta( '_bullet_size' ),
			'dots_shape'             => $this->get_meta( '_bullet_shape' ),
			'nav_color'              => $this->get_meta( '_nav_color' ),
			'nav_active_color'       => $this->get_meta( '_nav_active_color' ),
			// Responsive Settings
			'items_mobile'           => $this->get_meta( '_items_portrait_mobile' ),
			'items_mobile_landscape' => $this->get_meta( '_items_small_portrait_tablet' ),
			'items_tablet'           => $this->get_meta( '_items_portrait_tablet' ),
			'items_desktop_small'    => $this->get_meta( '_items_small_desktop' ),
			'items_desktop'          => $this->get_meta( '_items_desktop' ),
			'items_desktop_large'    => $this->get_meta( '_items' ),
		);
	}

	/**
	 * Get responsive settings
	 *
	 * @return array
	 */
	public function get_responsive_settings() {
		return array(
			array( 'breakpoint' => 0, 'items' => intval( $this->get_prop( 'items_mobile' ) ) ),
			array( 'breakpoint' => 480, 'items' => intval( $this->get_prop( 'items_mobile_landscape' ) ) ),
			array( 'breakpoint' => 768, 'items' => intval( $this->get_prop( 'items_tablet' ) ) ),
			array( 'breakpoint' => 980, 'items' => intval( $this->get_prop( 'items_desktop_small' ) ) ),
			array( 'breakpoint' => 1200, 'items' => intval( $this->get_prop( 'items_desktop' ) ) ),
			array( 'breakpoint' => 1500, 'items' => intval( $this->get_prop( 'items_desktop_large' ) ) ),
		);
	}

	/**
	 * Get slider(s)
	 *
	 * @param array|int $args
	 *
	 * @return AbstractModel|AbstractModel[]
	 */
	public static function find( $args = array() ) {
		if ( is_numeric( $args ) ) {
			return static::find_single( $args );
		}

		$defaults = array(
			'post_status'    => 'publish',
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
	 * @return AbstractModel
	 */
	public static function find_single( $id = 0 ) {
		return new self( $id );
	}

	/**
	 * Create new slider
	 *
	 * @param array $data
	 *
	 * @return self|bool
	 */
	public function create( array $data = array() ) {
		if ( empty( $data ) ) {
			$data = $this->get_changes();
		}

		$title     = isset( $data['title'] ) ? $data['title'] : '';
		$slider_id = static::create_slider( $title );
		if ( $slider_id ) {
			$data_to_update = array();

			$keys = static::props_to_meta_key();
			foreach ( $keys as $props => $meta_key ) {
				if ( array_key_exists( $props, $data ) ) {
					$value = $data[ $props ];
					if ( is_bool( $value ) ) {
						$value = ( true === $value ) ? 'on' : 'off';
					}
					if ( is_numeric( $value ) ) {
						$value = (string) $value;
					}
					$data_to_update[ $meta_key ] = $value;
				}
			}

			foreach ( $data_to_update as $meta_key => $meta_value ) {
				update_post_meta( $slider_id, $meta_key, $meta_value );
			}

			return new self( $slider_id );
		}

		return false;
	}

	/**
	 * Update current slider
	 *
	 * @param array $data
	 *
	 * @return self
	 */
	public function update( array $data = array() ) {
		$id = isset( $data['id'] ) ? intval( $data['id'] ) : $this->get_id();
		if ( empty( $data ) ) {
			$data = $this->get_changes();
		}

		$data_to_update = array();

		$keys = static::props_to_meta_key();
		foreach ( $keys as $props => $meta_key ) {
			if ( array_key_exists( $props, $data ) ) {
				$value = $data[ $props ];
				if ( is_bool( $value ) ) {
					$value = ( true === $value ) ? 'on' : 'off';
				}
				if ( is_numeric( $value ) ) {
					$value = (string) $value;
				}
				$data_to_update[ $meta_key ] = $value;
			}
		}

		foreach ( $data_to_update as $meta_key => $meta_value ) {
			update_post_meta( $id, $meta_key, $meta_value );
		}

		return $this;
	}

	/**
	 * Trash slider
	 *
	 * @return bool
	 */
	public function trash() {
		if ( wp_delete_post( $this->get_id(), false ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Restore trashed slider
	 *
	 * @return bool
	 */
	public function restore() {
		if ( wp_untrash_post( $this->get_id() ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Delete slider
	 *
	 * @return bool
	 */
	public function delete() {
		if ( wp_delete_post( $this->get_id(), true ) ) {
			$this->set_id( 0 );

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

	/**
	 * If a field has been 'checked' or not, meaning it contains
	 * one of the following values: 'yes', 'on', '1', 1, true, or 'true'.
	 * This can be used for determining if an HTML checkbox has been checked.
	 *
	 * @param  mixed $value
	 *
	 * @return boolean
	 */
	public function is_checked( $value ) {
		return in_array( $value, array( 'yes', 'on', '1', 1, true, 'true' ), true );
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
	public function get_prop( $prop, $context = 'view' ) {
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
	public function set_prop( $prop, $value ) {
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
	 * Get properties to meta keys
	 *
	 * @return array
	 */
	protected static function props_to_meta_key() {
		return array(
			// General Settings
			'type'                   => '_slide_type',
			'image_size'             => '_image_size',
			'stage_padding'          => '_stage_padding',
			'item_spacing'           => '_margin_right',
			'lazy_load_image'        => '_lazy_load_image',
			'infinity_loop'          => '_infinity_loop',
			'auto_width'             => '_auto_width',
			// Autoplay Settings
			'autoplay'               => '_autoplay',
			'autoplay_pause'         => '_autoplay_pause',
			'autoplay_timeout'       => '_autoplay_timeout',
			'autoplay_speed'         => '_autoplay_speed',
			// Navigation Settings
			'arrow_visibility'       => '_nav_button',
			'arrow_steps'            => '_slide_by',
			'arrow_position'         => '_arrow_position',
			'arrow_size'             => '_arrow_size',
			'dots_visibility'        => '_dot_nav',
			'dots_position'          => '_bullet_position',
			'dots_size'              => '_bullet_size',
			'dots_shape'             => '_bullet_shape',
			'nav_color'              => '_nav_color',
			'nav_active_color'       => '_nav_active_color',
			// Responsive Settings
			'items_mobile'           => '_items_portrait_mobile',
			'items_mobile_landscape' => '_items_small_portrait_tablet',
			'items_tablet'           => '_items_portrait_tablet',
			'items_desktop_small'    => '_items_small_desktop',
			'items_desktop'          => '_items_desktop',
			'items_desktop_large'    => '_items',
		);
	}

	/**
	 * Create new slider post type
	 *
	 * @param $slider_title
	 *
	 * @return int|\WP_Error The post ID on success. The value 0 or \WP_Error on failure.
	 */
	protected static function create_slider( $slider_title ) {
		$post_id = wp_insert_post( array(
			'post_title'     => $slider_title,
			'post_type'      => self::POST_TYPE,
			'post_status'    => 'publish',
			'comment_status' => 'closed',
			'ping_status'    => 'closed',
		) );

		return $post_id;
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
