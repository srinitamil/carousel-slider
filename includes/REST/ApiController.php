<?php

namespace CarouselSlider\REST;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class ApiController extends \WP_REST_Controller {

	/**
	 * The namespace of this controller's route.
	 *
	 * @var string
	 */
	protected $namespace = 'carousel-slider';

	/**
	 * HTTP status code.
	 *
	 * @var int
	 */
	protected $status_code = 200;

	/**
	 * Get HTTP status code.
	 *
	 * @return integer
	 */
	public function get_status_code() {
		return $this->status_code;
	}

	/**
	 * Set HTTP status code.
	 *
	 * @param int $status_code
	 *
	 * @return self
	 */
	public function set_status_code( $status_code ) {
		$this->status_code = $status_code;

		return $this;
	}

	/**
	 * Respond.
	 *
	 * @param mixed $data Response data. Default null.
	 * @param int $status Optional. HTTP status code. Default 200.
	 * @param array $headers Optional. HTTP header map. Default empty array.
	 *
	 * @return \WP_REST_Response
	 */
	public function respond( $data = null, $status = 200, $headers = array() ) {
		return new \WP_REST_Response( $data, $status, $headers );
	}

	/**
	 * Response success message
	 *
	 * @param mixed $data
	 * @param string $message
	 * @param array $headers
	 *
	 * @return \WP_REST_Response
	 */
	public function respond_success( $data = null, $message = null, $headers = array() ) {
		if ( 1 === func_num_args() && is_string( $data ) ) {
			list( $data, $message ) = array( null, $data );
		}

		$code     = $this->get_status_code();
		$response = array( 'success' => true );

		if ( ! empty( $message ) ) {
			$response['message'] = $message;
		}

		if ( ! empty( $data ) ) {
			$response['data'] = $data;
		}

		return $this->respond( $response, $code, $headers );
	}

	/**
	 * Response error message
	 *
	 * @param string|int $code Error code
	 * @param string $message Error message
	 * @param mixed $data Error data.
	 *
	 * @return \WP_REST_Response
	 */
	public function respond_error( $code = null, $message = null, $data = null ) {
		if ( 1 === func_num_args() && is_array( $code ) ) {
			list( $code, $message, $data ) = array( null, null, $code );
		}

		$status_code = $this->get_status_code();
		$response    = array( 'success' => false );

		if ( ! empty( $code ) && is_string( $code ) ) {
			$response['code'] = $code;
		}

		if ( ! empty( $message ) && is_string( $message ) ) {
			$response['message'] = $message;
		}

		if ( ! empty( $data ) ) {
			$response['errors'] = $data;
		}

		return $this->respond( $response, $status_code );
	}

	/**
	 * 200 (OK)
	 * The request has succeeded.
	 *
	 * Use cases:
	 * --> update/retrieve data
	 * --> bulk creation
	 * --> bulk update
	 *
	 * @param mixed $data
	 * @param string $message
	 *
	 * @return \WP_REST_Response
	 */
	public function respond_ok( $data = null, $message = null ) {
		return $this->set_status_code( 200 )->respond_success( $data, $message );
	}

	/**
	 * 201 (Created)
	 * The request has succeeded and a new resource has been created as a result of it.
	 * This is typically the response sent after a POST request, or after some PUT requests.
	 *
	 * @param mixed $data
	 * @param string $message
	 *
	 * @return \WP_REST_Response
	 */
	public function respond_created( $data = null, $message = null ) {
		return $this->set_status_code( 201 )->respond_success( $data, $message );
	}

	/**
	 * 202 (Accepted)
	 * The request has been received but not yet acted upon.
	 * The response should include the Location header with a link towards the location where
	 * the final response can be polled & later obtained.
	 *
	 * Use cases:
	 * --> asynchronous tasks (e.g., report generation)
	 * --> batch processing
	 * --> delete data that is NOT immediate
	 *
	 * @param mixed $data
	 * @param string $message
	 *
	 * @return \WP_REST_Response
	 */
	public function respond_accepted( $data = null, $message = null ) {
		return $this->set_status_code( 202 )->respond_success( $data, $message );
	}

	/**
	 * 204 (No Content)
	 * There is no content to send for this request, but the headers may be useful.
	 *
	 * Use cases:
	 * --> deletion succeeded
	 *
	 * @param mixed $data
	 * @param string $message
	 *
	 * @return \WP_REST_Response
	 */
	public function respond_no_content( $data = null, $message = null ) {
		return $this->set_status_code( 204 )->respond_success( $data, $message );
	}

	/**
	 * 400 (Bad request)
	 * Server could not understand the request due to invalid syntax.
	 *
	 * Use cases:
	 * --> invalid/incomplete request
	 * --> return multiple client errors at once
	 *
	 * @param string $code
	 * @param string $message
	 * @param mixed $data
	 *
	 * @return \WP_REST_Response
	 */
	public function respond_bad_request( $code = null, $message = null, $data = null ) {
		return $this->set_status_code( 400 )->respond_error( $code, $message, $data );
	}

	/**
	 * 401 (Unauthorized)
	 * The request requires user authentication.
	 *
	 * @param string $code
	 * @param string $message
	 * @param mixed $data
	 *
	 * @return \WP_REST_Response
	 */
	public function respond_unauthorized( $code = null, $message = null, $data = null ) {
		if ( empty( $code ) ) {
			$code = 'rest_forbidden_context';
		}

		if ( empty( $message ) ) {
			$message = 'Sorry, you are not allowed to access this resource.';
		}

		return $this->set_status_code( 401 )->respond_error( $code, $message, $data );
	}

	/**
	 * 403 (Forbidden)
	 * The client is authenticated but not authorized to perform the action.
	 *
	 * @param string $code
	 * @param string $message
	 * @param mixed $data
	 *
	 * @return \WP_REST_Response
	 */
	public function respond_forbidden( $code = null, $message = null, $data = null ) {
		if ( empty( $code ) ) {
			$code = 'rest_forbidden_context';
		}

		if ( empty( $message ) ) {
			$message = 'Sorry, you are not allowed to access this resource.';
		}

		return $this->set_status_code( 403 )->respond_error( $code, $message, $data );
	}

	/**
	 * 404 (Not Found)
	 * The server can not find requested resource. In an API, this can also mean that the endpoint is valid but
	 * the resource itself does not exist. Servers may also send this response instead of 403 to hide
	 * the existence of a resource from an unauthorized client.
	 *
	 * @param string $code
	 * @param string $message
	 * @param mixed $data
	 *
	 * @return \WP_REST_Response
	 */
	public function respond_not_found( $code = null, $message = null, $data = null ) {
		if ( empty( $code ) ) {
			$code = 'rest_no_item_found';
		}

		if ( empty( $message ) ) {
			$message = 'Sorry, no item found.';
		}

		return $this->set_status_code( 404 )->respond_error( $code, $message, $data );
	}

	/**
	 * 422 (Unprocessable Entity)
	 * The request was well-formed but was unable to be followed due to semantic errors.
	 *
	 * @param string $code
	 * @param string $message
	 * @param mixed $data
	 *
	 * @return \WP_REST_Response
	 */
	public function respond_unprocessable_entity( $code = null, $message = null, $data = null ) {
		return $this->set_status_code( 422 )->respond_error( $code, $message, $data );
	}

	/**
	 * 500 (Internal Server Error)
	 * The server has encountered a situation it doesn't know how to handle.
	 *
	 * @param string $code
	 * @param string $message
	 * @param mixed $data
	 *
	 * @return \WP_REST_Response
	 */
	public function respond_internal_server_error( $code = null, $message = null, $data = null ) {
		return $this->set_status_code( 500 )->respond_error( $code, $message, $data );
	}
}
