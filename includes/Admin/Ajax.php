<?php

namespace CarouselSlider\Admin;

use CarouselSlider\Abstracts\AbstractSlider;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Ajax {

	protected static $instance = null;

	/**
	 * Ensures only one instance of this class is loaded or can be loaded.
	 *
	 * @return Ajax
	 */
	public static function init() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
			add_action( 'wp_ajax_create_slider', array( self::$instance, 'create_slider' ) );
			add_action( 'wp_ajax_add_content_slide', array( self::$instance, 'add_slide_template' ) );
			add_action( 'wp_ajax_carousel_slider_restore_slider', array( self::$instance, 'restore_slider' ) );
			add_action( 'wp_ajax_carousel_slider_restore_sliders', array( self::$instance, 'restore_sliders' ) );
			add_action( 'wp_ajax_carousel_slider_delete_sliders', array( self::$instance, 'delete_sliders' ) );
		}

		return self::$instance;
	}

	/**
	 * Create slider
	 */
	public function create_slider() {
		$slider_type = $_POST['slider_type'];

		if ( $slider_type != '' ) {
			// insert the post and set the category
			$post_id = wp_insert_post( array(
				'post_type'   => 'carousels',
				'post_title'  => $slider_type,
				'post_status' => 'publish',
			) );

			if ( $post_id ) {
				// General Settings
				add_post_meta( $post_id, '_slide_type', $slider_type );
				add_post_meta( $post_id, '_image_size', 'medium_large' );
				add_post_meta( $post_id, '_stage_padding', '0' );
				add_post_meta( $post_id, '_margin_right', '10' );
				add_post_meta( $post_id, '_lazy_load_image', 'true' );
				add_post_meta( $post_id, '_infinity_loop', 'true' );
				add_post_meta( $post_id, '_auto_width', 'false' );

				// Autoplay Settings
				add_post_meta( $post_id, '_autoplay', 'false' );
				add_post_meta( $post_id, '_autoplay_pause', 'autoplay_pause' );
				add_post_meta( $post_id, '_autoplay_timeout', '5000' );
				add_post_meta( $post_id, '_autoplay_speed', '500' );

				// Navigation Settings
				add_post_meta( $post_id, '_nav_button', 'hover' );
				add_post_meta( $post_id, '_slide_by', 1 );
				add_post_meta( $post_id, '_arrow_position', 'outside' );
				add_post_meta( $post_id, '_arrow_size', 48 );
				add_post_meta( $post_id, '_dot_nav', 'true' );
				add_post_meta( $post_id, '_bullet_position', 'center' );
				add_post_meta( $post_id, '_bullet_size', 10 );
				add_post_meta( $post_id, '_bullet_shape', 'square' );
				add_post_meta( $post_id, '_nav_color', '#f1f1f1' );
				add_post_meta( $post_id, '_nav_active_color', '#00d1b2' );

				// Responsive Settings
				add_post_meta( $post_id, '_items_portrait_mobile', 1 );
				add_post_meta( $post_id, '_items_small_portrait_tablet', 2 );
				add_post_meta( $post_id, '_items_portrait_tablet', 3 );
				add_post_meta( $post_id, '_items_small_desktop', 4 );
				add_post_meta( $post_id, '_items_desktop', 4 );
				add_post_meta( $post_id, '_items', 4 );

			}
			$response = array(
				'success' => true,
				'code'    => '201',
				'message' => __( $post_id, 'carousel-slider' ),
			);
			$this->send_json( $response, 201 );
		} else {
			$response = array( 'success' => false );
			$this->send_json( $response, 400 );
		}
	}

	/**
	 * Restore trashed slider
	 */
	public function restore_slider() {
		$id = isset( $_POST['id'] ) ? intval( $_POST['id'] ) : 0;

		$slider = new AbstractSlider( $id );

		if ( ! $slider->get_id() ) {
			$response = array(
				'success' => false,
				'code'    => 'no_item_found',
				'message' => __( 'The requested slider was not found.', 'carousel-slider' ),

			);
			$this->send_json( $response, 404 );
		}

		if ( ! $slider->restore() ) {
			$response = array(
				'success' => false,
				'code'    => 'cannot_restore',
				'message' => __( 'There was an error restoring the slider.', 'carousel-slider' ),

			);
			$this->send_json( $response, 500 );
		}

		$response = array( 'success' => true );
		$this->send_json( $response, 200 );
	}

	/**
	 * Restore sliders
	 */
	public function restore_sliders() {
		$ids = isset( $_POST['ids'] ) && is_array( $_POST['ids'] ) ? $_POST['ids'] : array();
		$ids = array_map( 'intval', $ids );

		if ( count( $ids ) < 1 ) {
			$response = array(
				'success' => false,
				'code'    => 'no_item_found',
				'message' => __( 'The requested slider was not found.', 'carousel-slider' ),

			);
			$this->send_json( $response, 422 );
		}

		$success = 0;
		foreach ( $ids as $id ) {
			$slider = new AbstractSlider( $id );
			if ( $slider->restore() ) {
				$success += 1;
			}
		}

		$response = array(
			'success' => true,
			'status'  => array( 'success' => $success, 'fail' => count( $ids ) - $success )
		);
		$this->send_json( $response, 200 );
	}

	/**
	 * Delete sliders
	 */
	public function delete_sliders() {
		$ids   = isset( $_POST['ids'] ) && is_array( $_POST['ids'] ) ? $_POST['ids'] : array();
		$force = isset( $_POST['force'] ) ? $_POST['force'] : false;

		$ids = array_map( 'intval', $ids );
		if ( count( $ids ) < 1 ) {
			$response = array(
				'success' => false,
				'code'    => 'no_item_found',
				'message' => __( 'The requested slider was not found.', 'carousel-slider' ),

			);
			$this->send_json( $response, 422 );
		}

		$success = 0;
		foreach ( $ids as $id ) {
			$slider = new AbstractSlider( $id );
			if ( in_array( $force, array( true, 'true' ), true ) ) {
				$result = $slider->delete();
			} else {
				$result = $slider->trash();
			}

			if ( $result ) {
				$success += 1;
			}
		}

		$response = array(
			'success' => true,
			'status'  => array( 'success' => $success, 'fail' => count( $ids ) - $success )
		);
		$this->send_json( $response, 200 );
	}

	/**
	 * Add slide template for hero carousel
	 */
	public function add_slide_template() {

		if ( ! isset( $_POST['post_id'] ) ) {
			$this->send_json( __( 'Required attribute is not set properly.', 'carousel-slider' ), 422 );
		}

		$post_id   = absint( $_POST['post_id'] );
		$task      = isset( $_POST['task'] ) ? esc_attr( $_POST['task'] ) : 'add-slide';
		$slide_pos = isset( $_POST['slide_pos'] ) ? absint( $_POST['slide_pos'] ) : null;

		$slider = get_post_meta( $post_id, '_content_slider', true );

		if ( $task == 'add-slide' ) {
			$slider = $this->add_slide( $post_id, $slider );
		}
		if ( $task == 'delete-slide' && ! is_null( $slide_pos ) ) {
			$slider = $this->delete_slide( $slide_pos, $post_id, $slider );
		}
		if ( $task == 'move-slide-top' && ! is_null( $slide_pos ) ) {
			$slider = $this->move_slide_top( $slide_pos, $slider, $post_id );
		}
		if ( $task == 'move-slide-up' && ! is_null( $slide_pos ) ) {
			$slider = $this->move_slide_up( $slide_pos, $slider, $post_id );
		}
		if ( $task == 'move-slide-down' && ! is_null( $slide_pos ) ) {
			$slider = $this->move_slide_down( $slider, $slide_pos, $post_id );
		}
		if ( $task == 'move-slide-bottom' && ! is_null( $slide_pos ) ) {
			$slider = $this->move_slide_bottom( $slider, $slide_pos, $post_id );
		}

		if ( isset( $slider ) ) {
			$this->send_json( $slider );
		}

		$this->send_json( __( 'Required action is unauthorized.', 'carousel-slider' ), 401 );
	}

	/**
	 * Hero carousel default value
	 *
	 * @return array
	 */
	private function content_slide_default() {
		$data = array(
			// Slide Content
			'slide_heading'            => 'Slide Heading',
			'slide_description'        => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, magnam!',
			// Slide Background
			'img_id'                   => '',
			'img_bg_position'          => 'center center',
			'img_bg_size'              => 'cover',
			'bg_color'                 => 'rgba(0,0,0,0.6)',
			'ken_burns_effect'         => '',
			'bg_overlay'               => '',
			// Slide Style
			'content_alignment'        => 'center',
			'heading_font_size'        => '40',
			'heading_gutter'           => '30px',
			'heading_color'            => '#ffffff',
			'description_font_size'    => '20',
			'description_gutter'       => '30px',
			'description_color'        => '#ffffff',
			// Slide Link
			'link_type'                => 'none',
			'slide_link'               => '',
			'link_target'              => '_self',
			// Slide Button #1
			'button_one_text'          => '',
			'button_one_url'           => '',
			'button_one_target'        => '_self',
			'button_one_type'          => 'stroke',
			'button_one_size'          => 'medium',
			'button_one_border_width'  => '3px',
			'button_one_border_radius' => '0px',
			'button_one_bg_color'      => '#ffffff',
			'button_one_color'         => '#323232',
			// Slide Button #2
			'button_two_text'          => '',
			'button_two_url'           => '',
			'button_two_target'        => '_self',
			'button_two_type'          => 'stroke',
			'button_two_size'          => 'medium',
			'button_two_border_width'  => '3px',
			'button_two_border_radius' => '0px',
			'button_two_bg_color'      => '#ffffff',
			'button_two_color'         => '#323232',
		);

		return $data;
	}

	/**
	 * Add new slide
	 *
	 * @param int $post_id
	 * @param array $content_slider
	 *
	 * @return array
	 */
	private function add_slide( $post_id, $content_slider ) {
		$default = $this->content_slide_default();
		if ( is_array( $content_slider ) && count( $content_slider ) > 0 ) {
			$content_slider[] = $default;
		} else {
			$content_slider = array( $default );
		}
		update_post_meta( $post_id, '_content_slider', $content_slider );

		return $content_slider;
	}

	/**
	 * Delete a slide
	 *
	 * @param int $slide_position
	 * @param int $post_id
	 * @param array $slider
	 *
	 * @return mixed
	 */
	private function delete_slide( $slide_position, $post_id, $slider ) {
		array_splice( $slider, $slide_position, 1 );
		update_post_meta( $post_id, '_content_slider', $slider );

		return $slider;
	}

	/**
	 * Move array element position
	 *
	 * @param array $array
	 * @param int $current_index
	 * @param int $new_index
	 *
	 * @return mixed
	 */
	private function move_array_element( $array, $current_index, $new_index ) {
		$output = array_splice( $array, $current_index, 1 );
		array_splice( $array, $new_index, 0, $output );

		return $array;
	}

	/**
	 * Move current slide to top
	 *
	 * @param int $slide_pos
	 * @param array $slider
	 * @param int $post_id
	 *
	 * @return mixed
	 */
	private function move_slide_top( $slide_pos, $slider, $post_id ) {
		if ( $slide_pos !== 0 ) {
			$slider = $this->move_array_element( $slider, $slide_pos, 0 );
			update_post_meta( $post_id, '_content_slider', $slider );
		}

		return $slider;
	}

	/**
	 * Move current slide one step up
	 *
	 * @param int $slide_pos
	 * @param array $slider
	 * @param int $post_id
	 *
	 * @return mixed
	 */
	private function move_slide_up( $slide_pos, $slider, $post_id ) {
		if ( $slide_pos !== 0 ) {
			$slider = $this->move_array_element( $slider, $slide_pos, ( $slide_pos - 1 ) );
			update_post_meta( $post_id, '_content_slider', $slider );
		}

		return $slider;
	}

	/**
	 * Move current slide one step down
	 *
	 * @param array $slider
	 * @param int $slide_pos
	 * @param int $post_id
	 *
	 * @return array
	 */
	private function move_slide_down( $slider, $slide_pos, $post_id ) {
		$last_index = count( $slider ) - 1;
		if ( $slide_pos !== $last_index ) {
			$slider = $this->move_array_element( $slider, $slide_pos, ( $slide_pos + 1 ) );
			update_post_meta( $post_id, '_content_slider', $slider );
		}

		return $slider;
	}

	/**
	 * Move current slide to bottom
	 *
	 * @param array $slider
	 * @param int $slide_pos
	 * @param int $post_id
	 *
	 * @return array
	 */
	private function move_slide_bottom( $slider, $slide_pos, $post_id ) {
		$last_index = count( $slider ) - 1;
		if ( $slide_pos !== $last_index ) {
			$slider = $this->move_array_element( $slider, $slide_pos, $last_index );
			update_post_meta( $post_id, '_content_slider', $slider );
		}

		return $slider;
	}

	/**
	 * Send json response with status code
	 *
	 * @param mixed $response
	 * @param int $status_code
	 */
	private function send_json( $response, $status_code = 200 ) {
		@header( 'Content-Type: application/json; charset=' . get_option( 'blog_charset' ) );
		status_header( $status_code );

		echo wp_json_encode( $response );
		die;
	}
}
