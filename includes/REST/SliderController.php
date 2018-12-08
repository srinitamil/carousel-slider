<?php

namespace CarouselSlider\REST;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
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
			),
			array(
				'methods'  => \WP_REST_Server::CREATABLE,
				'callback' => array( $this, 'get_item' ),
			),
		) );
		register_rest_route( $namespace, '/sliders/(?P<id>\d+)', array(
			array(
				'methods'  => \WP_REST_Server::READABLE,
				'callback' => array( $this, 'create_item' ),
			),
			array(
				'methods'  => \WP_REST_Server::EDITABLE,
				'callback' => array( $this, 'update_item' ),
			),
			array(
				'methods'  => \WP_REST_Server::DELETABLE,
				'callback' => array( $this, 'delete_item' ),
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
		/* translators: %s: method name */
		return new \WP_Error( 'invalid-method', sprintf( __( "Method '%s' not implemented. Must be overridden in subclass." ), __METHOD__ ), array( 'status' => 405 ) );
	}

	/**
	 * Retrieves one item from the collection.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 *
	 * @return \WP_Error|\WP_REST_Response Response object on success, or WP_Error object on failure.
	 */
	public function get_item( $request ) {
		/* translators: %s: method name */
		return new \WP_Error( 'invalid-method', sprintf( __( "Method '%s' not implemented. Must be overridden in subclass." ), __METHOD__ ), array( 'status' => 405 ) );
	}

	/**
	 * Creates one item from the collection.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 *
	 * @return \WP_Error|\WP_REST_Response Response object on success, or WP_Error object on failure.
	 */
	public function create_item( $request ) {
		/* translators: %s: method name */
		return new \WP_Error( 'invalid-method', sprintf( __( "Method '%s' not implemented. Must be overridden in subclass." ), __METHOD__ ), array( 'status' => 405 ) );
	}

	/**
	 * Updates one item from the collection.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 *
	 * @return \WP_Error|\WP_REST_Response Response object on success, or WP_Error object on failure.
	 */
	public function update_item( $request ) {
		/* translators: %s: method name */
		return new \WP_Error( 'invalid-method', sprintf( __( "Method '%s' not implemented. Must be overridden in subclass." ), __METHOD__ ), array( 'status' => 405 ) );
	}

	/**
	 * Deletes one item from the collection.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 *
	 * @return \WP_Error|\WP_REST_Response Response object on success, or WP_Error object on failure.
	 */
	public function delete_item( $request ) {
		$id = (int) $request->get_param( 'id' );

		if ( ! $id ) {
			return $this->respond_not_found( 'rest_no_item_found',
				__( 'The requested slider was not found.', 'carousel-slider' ) );
		}

		if ( ! current_user_can( 'publish_pages', $id ) ) {
			return $this->respond_forbidden( 'rest_forbidden_context',
				__( 'You are not allowed to access the requested slider.', 'carousel-slider' ) );
		}

		return $this->respond_ok( array( 'deleted' => true ) );
	}
}
