<?php

namespace CarouselSlider\REST;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class SliderController extends ApiController {

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
