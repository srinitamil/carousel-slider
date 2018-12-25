<?php

namespace CarouselSlider\REST;

use CarouselSlider\Abstracts\AbstractSlider;
use CarouselSlider\Supports\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class SliderController extends ApiController {

	/**
	 * The instance of the class
	 *
	 * @var self
	 */
	protected static $instance;

	/**
	 * Ensures only one instance of the class is loaded or can be loaded.
	 *
	 * @return self
	 */
	public static function init() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();

			add_action( 'rest_api_init', array( self::$instance, 'register_routes' ) );
		}

		return self::$instance;
	}

	/**
	 * Registers the routes for the objects of the controller.
	 */
	public function register_routes() {
		$namespace = $this->namespace . '/v1';
		register_rest_route( $namespace, '/sliders', array(
			array(
				'methods'  => \WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_items' ),
				'args'     => $this->get_collection_params(),
			),
			array(
				'methods'  => \WP_REST_Server::CREATABLE,
				'callback' => array( $this, 'create_item' ),
				'args'     => $this->create_item_args(),
			),
		) );
		register_rest_route( $namespace, '/sliders/(?P<id>\d+)', array(
			array(
				'methods'  => \WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_item' ),
			),
			array(
				'methods'  => \WP_REST_Server::EDITABLE,
				'callback' => array( $this, 'update_item' ),
				'args'     => $this->update_item_args(),
			),
			array(
				'methods'  => \WP_REST_Server::DELETABLE,
				'callback' => array( $this, 'delete_item' ),
				'args'     => $this->delete_item_args(),
			),
		) );
	}

	/**
	 * Retrieves a collection of items.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 *
	 * @return \WP_Error|\WP_REST_Response Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return $this->respond_forbidden( 'rest_forbidden_context',
				__( 'You are not allowed to access the requested slider.', 'carousel-slider' ) );
		}

		$post_status = $request->get_param( 'post_status' );
		$post_status = in_array( $post_status, array( 'publish', 'trash' ) ) ? $post_status : 'publish';
		$args        = array(
			'post_status'    => $post_status,
			'posts_per_page' => $request->get_param( 'per_page' ),
		);

		$sliders = AbstractSlider::find( $args );

		if ( count( $sliders ) < 1 ) {
			return $this->respond_not_found( 'rest_no_item_found',
				__( 'The requested slider was not found.', 'carousel-slider' ) );
		}

		return $this->respond_ok( $sliders );
	}

	/**
	 * Retrieves one item from the collection.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 *
	 * @return \WP_Error|\WP_REST_Response Response object on success, or WP_Error object on failure.
	 */
	public function get_item( $request ) {
		$id = (int) $request->get_param( 'id' );

		if ( ! current_user_can( 'publish_pages', $id ) ) {
			return $this->respond_forbidden( 'rest_forbidden_context',
				__( 'You are not allowed to access the requested slider.', 'carousel-slider' ) );
		}

		$slider = Utils::get_slider( $id );

		if ( ! $slider->get_id() ) {
			return $this->respond_not_found( 'rest_no_item_found',
				__( 'The requested slider was not found.', 'carousel-slider' ) );
		}

		return $this->respond_ok( $slider->to_array() );
	}

	/**
	 * Creates one item from the collection.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 *
	 * @return \WP_Error|\WP_REST_Response Response object on success, or WP_Error object on failure.
	 */
	public function create_item( $request ) {
		if ( ! current_user_can( 'publish_pages' ) ) {
			return $this->respond_forbidden( 'rest_forbidden_context',
				__( 'You are not allowed to access the requested slider.', 'carousel-slider' ) );
		}

		$slider = new AbstractSlider();
		$slider = $slider->create( $request->get_params() );

		if ( ! $slider->get_id() ) {
			return $this->respond_not_found( 'rest_cannot_save',
				__( 'There was an error saving the slider.', 'carousel-slider' ) );
		}

		return $this->respond_created( $slider->to_array() );
	}

	/**
	 * Updates one item from the collection.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 *
	 * @return \WP_Error|\WP_REST_Response Response object on success, or WP_Error object on failure.
	 */
	public function update_item( $request ) {
		$id = (int) $request->get_param( 'id' );

		if ( ! current_user_can( 'publish_pages', $id ) ) {
			return $this->respond_forbidden( 'rest_forbidden_context',
				__( 'You are not allowed to access the requested slider.', 'carousel-slider' ) );
		}

		$type       = $request->get_param( 'type' );
		$valid_type = Utils::get_slide_types();
		if ( ! in_array( $type, $valid_type ) ) {
			return $this->respond_unprocessable_entity( 'rest_invalid_slider_type',
				__( 'Slider type is not registered.', 'carousel-slider' ) );
		}

		$slider = Utils::get_slider( $id );

		if ( ! $slider->get_id() ) {
			return $this->respond_not_found( 'rest_no_item_found',
				__( 'The requested slider was not found.', 'carousel-slider' ) );
		}

		$params = $request->get_params();
		foreach ( $params as $key => $value ) {
			$slider->set_prop( $key, $value );
		}
		$slider->update();

		return $this->respond_ok( $slider->to_array() );
	}

	/**
	 * Deletes one item from the collection.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 *
	 * @return \WP_Error|\WP_REST_Response Response object on success, or WP_Error object on failure.
	 */
	public function delete_item( $request ) {
		$id    = (int) $request->get_param( 'id' );
		$force = $request->get_param( 'force' );

		if ( ! current_user_can( 'publish_pages', $id ) ) {
			return $this->respond_forbidden( 'rest_forbidden_context',
				__( 'You are not allowed to access the requested slider.', 'carousel-slider' ) );
		}

		$slider = new AbstractSlider( $id );

		if ( ! $slider->get_id() ) {
			return $this->respond_not_found( 'rest_no_item_found',
				__( 'The requested slider was not found.', 'carousel-slider' ) );
		}

		if ( in_array( $force, array( 'false', false ), true ) ) {
			$result = $slider->trash();
		} else {
			$result = $slider->delete();
		}

		if ( ! $result ) {
			return $this->respond_internal_server_error( 'rest_cannot_delete',
				__( 'There was an error deleting the slider.', 'carousel-slider' ) );
		}

		return $this->respond_ok();
	}

	/**
	 * Create item arguments
	 *
	 * @return array
	 */
	protected function create_item_args() {
		$args          = array();
		$args['title'] = array(
			'description' => esc_html__( 'Slider title.', 'carousel-slider' ),
			'type'        => 'string',
			'required'    => true,
		);

		return array_merge( $args, $this->create_and_update_item_args() );
	}

	/**
	 * Update item arguments
	 *
	 * @return array
	 */
	protected function update_item_args() {
		$args          = array();
		$args['title'] = array(
			'description' => esc_html__( 'Slider title.', 'carousel-slider' ),
			'type'        => 'string',
			'required'    => false,
		);

		$_args = $this->create_and_update_item_args();
		foreach ( $_args as $arg_key => $arg ) {
			if ( isset( $arg['default'] ) ) {
				unset( $arg['default'] );
			}
			$args[ $arg_key ] = $arg;
		}

		return $args;
	}

	/**
	 * Create and update item arguments
	 *
	 * @return array
	 */
	protected function create_and_update_item_args() {
		$args                           = array();
		$args['type']                   = array(
			'description' => esc_html__( 'Slider type.', 'carousel-slider' ),
			'type'        => 'string',
			'required'    => false,
			'default'     => 'image-carousel',
			'enum'        => Utils::get_slide_types( true ),
		);
		$args['image_size']             = array(
			'description' => esc_html__( 'Slider image size.', 'carousel-slider' ),
			'type'        => 'string',
			'required'    => false,
			'default'     => 'medium',
			'enum'        => Utils::get_available_image_sizes( true ),
		);
		$args['stage_padding']          = array(
			'description' => esc_html__( 'Left and right padding on slider stage wrapper.', 'carousel-slider' ),
			'type'        => 'integer',
			'required'    => false,
			'default'     => 0,
		);
		$args['item_spacing']           = array(
			'description' => esc_html__( 'Space between two slide.', 'carousel-slider' ),
			'type'        => 'integer',
			'required'    => false,
			'default'     => 10,
		);
		$args['lazy_load_image']        = array(
			'description' => esc_html__( 'Enable image with lazy loading.', 'carousel-slider' ),
			'type'        => 'boolean',
			'required'    => false,
			'default'     => true,
		);
		$args['infinity_loop']          = array(
			'description' => esc_html__( 'Enable or disable loop(circular) of carousel.', 'carousel-slider' ),
			'type'        => 'boolean',
			'required'    => false,
			'default'     => true,
		);
		$args['auto_width']             = array(
			'description' => esc_html__( 'Set item width according to its content width.', 'carousel-slider' ),
			'type'        => 'boolean',
			'required'    => false,
			'default'     => false,
		);
		$args['autoplay']               = array(
			'description' => esc_html__( 'Set if the slider should play automatically.', 'carousel-slider' ),
			'type'        => 'boolean',
			'required'    => false,
			'default'     => true,
		);
		$args['autoplay_pause']         = array(
			'description' => esc_html__( 'Pause autoplay on mouse hover.', 'carousel-slider' ),
			'type'        => 'boolean',
			'required'    => false,
			'default'     => true,
		);
		$args['autoplay_timeout']       = array(
			'description' => esc_html__( 'Autoplay interval timeout in millisecond.', 'carousel-slider' ),
			'type'        => 'integer',
			'required'    => false,
			'default'     => 5000,
		);
		$args['autoplay_speed']         = array(
			'description' => esc_html__( 'Autoplay speed in millisecond.', 'carousel-slider' ),
			'type'        => 'integer',
			'required'    => false,
			'default'     => 500,
		);
		$args['arrow_visibility']       = array(
			'description' => esc_html__( 'Arrow navigation visibility.', 'carousel-slider' ),
			'type'        => 'string',
			'required'    => false,
			'default'     => 'always',
			'enum'        => array( 'always', 'hover', 'never' ),
		);
		$args['arrow_position']         = array(
			'description' => esc_html__( 'Arrow position.', 'carousel-slider' ),
			'type'        => 'string',
			'required'    => false,
			'default'     => 'outside',
			'enum'        => array( 'inside', 'outside' ),
		);
		$args['arrow_size']             = array(
			'description' => esc_html__( 'Arrow size in pixels.', 'carousel-slider' ),
			'type'        => 'integer',
			'required'    => false,
			'default'     => 48,
		);
		$args['arrow_steps']            = array(
			'description' => esc_html__( 'Steps to go for each navigation request. 0 (zero) to slide by page.', 'carousel-slider' ),
			'type'        => 'integer',
			'required'    => false,
			'default'     => 1,
		);
		$args['dots_visibility']        = array(
			'description' => esc_html__( 'Dots navigation visibility.', 'carousel-slider' ),
			'type'        => 'string',
			'required'    => false,
			'default'     => 'always',
			'enum'        => array( 'always', 'hover', 'never' ),
		);
		$args['dots_position']          = array(
			'description' => esc_html__( 'Dots position.', 'carousel-slider' ),
			'type'        => 'string',
			'required'    => false,
			'default'     => 'center',
			'enum'        => array( 'left', 'center', 'right' ),
		);
		$args['dots_shape']             = array(
			'description' => esc_html__( 'Dots shape.', 'carousel-slider' ),
			'type'        => 'string',
			'required'    => false,
			'default'     => 'circle',
			'enum'        => array( 'square', 'circle' ),
		);
		$args['dots_size']              = array(
			'description' => esc_html__( 'Dots shape.', 'carousel-slider' ),
			'type'        => 'integer',
			'required'    => false,
			'default'     => 10,
		);
		$args['nav_color']              = array(
			'description' => esc_html__( 'Color for arrow and dots.', 'carousel-slider' ),
			'type'        => 'string',
			'required'    => false,
			'default'     => '#f1f1f1',
		);
		$args['nav_active_color']       = array(
			'description' => esc_html__( 'Hover and active color for arrow and dots.', 'carousel-slider' ),
			'type'        => 'string',
			'required'    => false,
			'default'     => '#2196f3',
		);
		$args['items_mobile']           = array(
			'description' => esc_html__( 'Items to show on screens size less than 480 pixels.', 'carousel-slider' ),
			'type'        => 'integer',
			'required'    => false,
			'default'     => 1,
		);
		$args['items_mobile_landscape'] = array(
			'description' => esc_html__( 'Items to show on screens size from 480 pixels to 767 pixels.', 'carousel-slider' ),
			'type'        => 'integer',
			'required'    => false,
			'default'     => 2,
		);
		$args['items_tablet']           = array(
			'description' => esc_html__( 'Items to show on screens size from 768 pixels to 979 pixels.', 'carousel-slider' ),
			'type'        => 'integer',
			'required'    => false,
			'default'     => 3,
		);
		$args['items_desktop_small']    = array(
			'description' => esc_html__( 'Items to show on screens size from 980 pixels to 1199 pixels.', 'carousel-slider' ),
			'type'        => 'integer',
			'required'    => false,
			'default'     => 4,
		);
		$args['items_desktop']          = array(
			'description' => esc_html__( 'Items to show on screens size from 1200 pixels to 1499 pixels.', 'carousel-slider' ),
			'type'        => 'integer',
			'required'    => false,
			'default'     => 4,
		);
		$args['items_desktop_large']    = array(
			'description' => esc_html__( 'Items to show on screens size greater than 1499 pixels.', 'carousel-slider' ),
			'type'        => 'integer',
			'required'    => false,
			'default'     => 4,
		);

		return $args;
	}

	/**
	 * Delete item args
	 *
	 * @return array
	 */
	private function delete_item_args() {
		return array(
			'force' => array(
				'description' => esc_html__( 'Whether to bypass trash and force deletion.', 'carousel-slider' ),
				'type'        => 'boolean',
				'required'    => false,
				'default'     => false,
			),
		);
	}
}
