<?php

namespace CarouselSlider\Admin;

use CarouselSlider\Abstracts\AbstractSetting;
use CarouselSlider\SettingManager;
use CarouselSlider\Supports\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Admin {

	const POST_TYPE = 'carousels';

	private static $instance = null;

	/**
	 * Ensures only one instance of this class is loaded or can be loaded.
	 *
	 * @return Admin
	 */
	public static function init() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();

			add_action( 'admin_menu', array( self::$instance, 'add_menu' ) );
		}

		return self::$instance;
	}

	/**
	 * Add top level menu
	 */
	public static function add_menu() {
		global $submenu;
		$capability = 'manage_options';
		$slug       = 'carousel-slider';

		$hook = add_menu_page( __( 'Carousel Slider', 'carousel-slider' ), __( 'Carousel Slider', 'carousel-slider' ),
			$capability, $slug, array( self::$instance, 'menu_page_callback' ), 'dashicons-slides', 6 );

		$menus = array(
			array( 'title' => __( 'All Sliders', 'carousel-slider' ), 'slug' => '#/' ),
			array( 'title' => __( 'Settings', 'carousel-slider' ), 'slug' => '#/settings' ),
			array( 'title' => __( 'Help', 'carousel-slider' ), 'slug' => '#/help' ),
		);

		if ( current_user_can( $capability ) ) {
			foreach ( $menus as $menu ) {
				$submenu[ $slug ][] = array( $menu['title'], $capability, 'admin.php?page=' . $slug . $menu['slug'] );
			}
		}

		add_action( 'load-' . $hook, array( self::$instance, 'init_hooks' ) );
	}

	public static function menu_page_callback() {
		$setting = SliderSetting::init();
		$data    = array(
			'general_settings' => array(
				'sections' => $setting->get_sections(),
				'fields'   => $setting->get_fields(),
			),
			'modules_settings' => array(),
		);
		$modules = SettingManager::init();
		foreach ( $modules as $module => $className ) {
			$class = new $className;
			if ( ! $class instanceof AbstractSetting ) {
				continue;
			}
			$class->register_settings();
			$data['modules_settings'][ $module ] = array(
				'sections' => $class->get_sections(),
				'fields'   => $class->get_fields(),
			);
		}
		echo '<script type="text/javascript">window.CAROUSEL_SLIDER_SETTINGS = ' . wp_json_encode( $data ) . '</script>';
		echo '<div class="wrap"><div id="carousel-slider-admin"></div></div>';
	}

	/**
	 * Load required styles and scripts
	 */
	public static function init_hooks() {
		wp_enqueue_style( 'carousel-slider-admin-vue' );
		wp_enqueue_script( 'carousel-slider-admin-vue' );
		wp_localize_script( 'carousel-slider-admin-vue', 'carouselSliderSettings', array(
			'root'         => esc_url_raw( rest_url( 'carousel-slider/v1' ) ),
			'nonce'        => wp_create_nonce( 'wp_rest' ),
			'sliderTypes'  => Utils::get_slide_types( false ),
			'countSliders' => static::count_sliders(),
			'columns'      => array(
				array( 'key' => 'title', 'label' => __( 'Slider Title', 'carousel-slider' ) ),
				array( 'key' => 'slider-type', 'label' => __( 'Slider Type', 'carousel-slider' ) ),
				array( 'key' => 'shortcode', 'label' => __( 'Shortcode', 'carousel-slider' ) ),
			),
			'actions'      => array(
				'publish' => array(
					array( 'key' => 'edit', 'label' => __( 'Edit', 'carousel-slider' ) ),
					array( 'key' => 'view', 'label' => __( 'Preview', 'carousel-slider' ) ),
					array( 'key' => 'trash', 'label' => __( 'Trash', 'carousel-slider' ) ),
				),
				'trash'   => array(
					array( 'key' => 'restore', 'label' => __( 'Restore', 'carousel-slider' ) ),
					array( 'key' => 'delete', 'label' => __( 'Delete Permanently', 'carousel-slider' ) ),
				),
			),
			'bulkActions'  => array(
				'publish' => array(
					array( 'key' => 'trash', 'label' => __( 'Move to Trash', 'carousel-slider' ) ),
				),
				'trash'   => array(
					array( 'key' => 'restore', 'label' => __( 'Restore', 'carousel-slider' ) ),
					array( 'key' => 'delete', 'label' => __( 'Delete Permanently', 'carousel-slider' ) ),
				),
			),
			'sections'     => array()
		) );
	}

	/**
	 * Carousel_Slider_Admin constructor.
	 */
	public function __construct() {

		add_action( 'init', array( $this, 'carousel_post_type' ) );
		add_filter( 'manage_edit-' . self::POST_TYPE . '_columns', array( $this, 'columns_head' ) );
		add_filter( 'manage_' . self::POST_TYPE . '_posts_custom_column', array( $this, 'columns_content' ), 10, 2 );
		add_action( 'save_post', array( $this, 'save_meta_box' ) );
		add_action( 'wp_ajax_carousel_slider_save_images', array( $this, 'save_images' ) );

		// Remove view and Quick Edit from Carousels
		add_filter( 'post_row_actions', array( $this, 'post_row_actions' ), 10, 2 );

		// Add custom link to media gallery
		add_filter( "attachment_fields_to_edit", array( $this, "attachment_fields_to_edit" ), null, 2 );
		add_filter( "attachment_fields_to_save", array( $this, "attachment_fields_to_save" ), null, 2 );
	}

	/**
	 * Get sliders counts
	 *
	 * @return array
	 */
	private static function count_sliders() {
		$counts   = array();
		$_sliders = wp_count_posts( self::POST_TYPE );
		foreach ( $_sliders as $status => $count ) {
			if ( in_array( $status, array( 'publish', 'trash' ) ) ) {
				$counts[ $status ] = intval( $count );
			}
		}

		return $counts;
	}

	/**
	 * Carousel slider post type
	 */
	public function carousel_post_type() {
		$labels = array(
			'name'               => _x( 'Sliders', 'Post Type General Name', 'carousel-slider' ),
			'singular_name'      => _x( 'Slider', 'Post Type Singular Name', 'carousel-slider' ),
			'menu_name'          => __( 'Carousel Slider', 'carousel-slider' ),
			'parent_item_colon'  => __( 'Parent Slider:', 'carousel-slider' ),
			'all_items'          => __( 'All Sliders', 'carousel-slider' ),
			'view_item'          => __( 'View Slider', 'carousel-slider' ),
			'add_new_item'       => __( 'Add New Slider', 'carousel-slider' ),
			'add_new'            => __( 'Add New', 'carousel-slider' ),
			'edit_item'          => __( 'Edit Slider', 'carousel-slider' ),
			'update_item'        => __( 'Update Slider', 'carousel-slider' ),
			'search_items'       => __( 'Search Slider', 'carousel-slider' ),
			'not_found'          => __( 'Not found', 'carousel-slider' ),
			'not_found_in_trash' => __( 'Not found in Trash', 'carousel-slider' ),
		);
		$args   = array(
			'label'               => __( 'Slider', 'carousel-slider' ),
			'description'         => __( 'The easiest way to create carousel slider', 'carousel-slider' ),
			'labels'              => $labels,
			'supports'            => array( 'title' ),
			'hierarchical'        => false,
			'public'              => false,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'show_in_nav_menus'   => true,
			'show_in_admin_bar'   => true,
			'menu_position'       => 5.55525,
			'menu_icon'           => 'dashicons-slides',
			'can_export'          => true,
			'has_archive'         => false,
			'exclude_from_search' => true,
			'publicly_queryable'  => true,
			'rewrite'             => false,
			'capability_type'     => 'post',
		);

		register_post_type( self::POST_TYPE, $args );
	}

	/**
	 * Hide view and quick edit from carousel slider admin
	 *
	 * @param array $actions
	 * @param \WP_Post $post
	 *
	 * @return mixed
	 */
	public function post_row_actions( $actions, $post ) {
		if ( $post->post_type != self::POST_TYPE ) {
			return $actions;
		}

		$preview_link    = add_query_arg( array(
			'carousel_slider' => true,
			'slider_id'       => $post->ID,
			'preview'         => true,
		), site_url( '/' ) );
		$actions['view'] = '<a href="' . esc_url( $preview_link ) . '">' . __( 'Preview', 'carousel-slider' ) . '</a>';
		unset( $actions['inline hide-if-no-js'] );

		return $actions;
	}

	/**
	 * Customize Carousel slider list table head
	 *
	 * @return array
	 */
	public function columns_head() {

		$columns = array(
			'cb'         => '<input type="checkbox">',
			'title'      => __( 'Carousel Slide Title', 'carousel-slider' ),
			'usage'      => __( 'Shortcode', 'carousel-slider' ),
			'slide_type' => __( 'Slide Type', 'carousel-slider' )
		);

		return $columns;

	}

	/**
	 * Generate carousel slider list table content
	 *
	 * @param $column
	 * @param $post_id
	 */
	public function columns_content( $column, $post_id ) {
		$slide_types = Utils::get_slide_types( false );
		switch ( $column ) {

			case 'usage':
				?>
				<input type="text" onmousedown="this.clicked = 1;"
				       onfocus="if (!this.clicked) this.select(); else this.clicked = 2;"
				       onclick="if (this.clicked === 2) this.select(); this.clicked = 0;"
				       value="[carousel_slide id='<?php echo $post_id; ?>']"
				       style="background-color: #f1f1f1;min-width: 250px;padding: 5px 8px;"
				>
				<?php
				break;

			case 'slide_type':
				$slide_type = get_post_meta( get_the_ID(), '_slide_type', true );
				echo isset( $slide_types[ $slide_type ] ) ? esc_attr( $slide_types[ $slide_type ] ) : '';

				break;
			default :
				break;
		}
	}

	/**
	 * Save custom meta box
	 *
	 * @method save_meta_box
	 * @param  int $post_id The post ID
	 */
	public function save_meta_box( $post_id ) {
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}
		// Check if nonce is set.
		if ( ! isset( $_POST['_carousel_slider_nonce'], $_POST['carousel_slider'] ) ) {
			return;
		}
		// Check if nonce is valid.
		if ( ! wp_verify_nonce( $_POST['_carousel_slider_nonce'], 'carousel_slider_nonce' ) ) {
			return;
		}
		// Check if user has permissions to save data.
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		if ( isset( $_POST['carousel_slider_content'] ) ) {
			$this->update_content_slider( $post_id );
		}

		if ( isset( $_POST['content_settings'] ) ) {
			$this->update_content_settings( $post_id );
		}

		foreach ( $_POST['carousel_slider'] as $key => $val ) {
			if ( is_array( $val ) ) {
				$val = implode( ',', $val );
			}

			if ( $key == '_margin_right' && $val == 0 ) {
				$val = 'zero';
			}
			update_post_meta( $post_id, $key, sanitize_text_field( $val ) );
		}

		if ( ! isset( $_POST['carousel_slider']['_post_categories'] ) ) {
			update_post_meta( $post_id, '_post_categories', '' );
		}

		if ( ! isset( $_POST['carousel_slider']['_post_tags'] ) ) {
			update_post_meta( $post_id, '_post_tags', '' );
		}

		if ( ! isset( $_POST['carousel_slider']['_post_in'] ) ) {
			update_post_meta( $post_id, '_post_in', '' );
		}

		if ( isset( $_POST['_images_urls'] ) ) {
			$this->save_images_urls( $post_id );
		}
	}

	/**
	 * Save carousel slider gallery images
	 *
	 * @return string
	 */
	public function save_images() {
		// Check if not an autosave.
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}
		// Check if required fields are set
		if ( ! isset( $_POST['ids'], $_POST['post_id'] ) ) {
			return;
		}
		// Check if user has permissions to save data.
		if ( ! current_user_can( 'edit_posts' ) ) {
			return;
		}

		$ids = strip_tags( rtrim( $_POST['ids'], ',' ) );
		update_post_meta( $_POST['post_id'], '_wpdh_image_ids', $ids );

		$thumbs        = explode( ',', $ids );
		$thumbs_output = '';
		foreach ( $thumbs as $thumb ) {
			$thumbs_output .= '<li>' . wp_get_attachment_image( $thumb, array( 75, 75 ) ) . '</li>';
		}

		echo $thumbs_output;

		die();
	}

	/**
	 * Save images urls
	 *
	 * @param  integer $post_id
	 *
	 * @return void
	 */
	private function save_images_urls( $post_id ) {
		if ( ! isset( $_POST['_images_urls'] ) ) {
			return;
		}
		$url      = $_POST['_images_urls']['url'];
		$title    = $_POST['_images_urls']['title'];
		$caption  = $_POST['_images_urls']['caption'];
		$alt      = $_POST['_images_urls']['alt'];
		$link_url = $_POST['_images_urls']['link_url'];

		$urls = array();

		for ( $i = 0; $i < count( $url ); $i ++ ) {
			$urls[] = array(
				'url'      => esc_url_raw( $url[ $i ] ),
				'title'    => sanitize_text_field( $title[ $i ] ),
				'caption'  => sanitize_text_field( $caption[ $i ] ),
				'alt'      => sanitize_text_field( $alt[ $i ] ),
				'link_url' => esc_url_raw( $link_url[ $i ] ),
			);
		}
		update_post_meta( $post_id, '_images_urls', $urls );
	}

	/**
	 * Adding our custom fields to the $form_fields array
	 *
	 * @param array $form_fields
	 * @param \WP_Post $post
	 *
	 * @return array
	 */
	public function attachment_fields_to_edit( $form_fields, $post ) {
		$form_fields["carousel_slider_link_url"]["label"]      = __( "Link to URL", "carousel-slider" );
		$form_fields["carousel_slider_link_url"]["input"]      = "textarea";
		$form_fields["carousel_slider_link_url"]["value"]      = get_post_meta( $post->ID,
			"_carousel_slider_link_url", true );
		$form_fields["carousel_slider_link_url"]["extra_rows"] = array(
			'carouselSliderInfo' => __( '"Link to URL" only works on Carousel Slider for linking image to a custom url.',
				'carousel-slider' ),
		);

		return $form_fields;
	}

	/**
	 * Save custom field value
	 *
	 * @param array $post
	 * @param array $attachment
	 *
	 * @return object|array
	 */
	public function attachment_fields_to_save( $post, $attachment ) {
		$slider_link_url = isset( $attachment['carousel_slider_link_url'] ) ? $attachment['carousel_slider_link_url'] : null;

		if ( filter_var( $slider_link_url, FILTER_VALIDATE_URL ) ) {

			update_post_meta( $post['ID'], '_carousel_slider_link_url', esc_url_raw( $slider_link_url ) );
		}

		return $post;
	}

	/**
	 * Update content slider
	 *
	 * @param int $post_id
	 */
	private function update_content_slider( $post_id ) {
		$_content_slides = $_POST['carousel_slider_content'];
		$_slides         = array_map( function ( $slide ) {
			$_slide = array(
				// Slide Content
				'slide_heading'            => wp_kses_post( $slide['slide_heading'] ),
				'slide_description'        => wp_kses_post( $slide['slide_description'] ),
				// Slide Background
				'img_id'                   => intval( $slide['img_id'] ),
				'img_bg_position'          => sanitize_text_field( $slide['img_bg_position'] ),
				'img_bg_size'              => sanitize_text_field( $slide['img_bg_size'] ),
				'ken_burns_effect'         => sanitize_text_field( $slide['ken_burns_effect'] ),
				'bg_color'                 => Utils::sanitize_color( $slide['bg_color'] ),
				'bg_overlay'               => Utils::sanitize_color( $slide['bg_overlay'] ),
				// Slide Style
				'content_alignment'        => sanitize_text_field( $slide['content_alignment'] ),
				'heading_font_size'        => intval( $slide['heading_font_size'] ),
				'heading_gutter'           => sanitize_text_field( $slide['heading_gutter'] ),
				'heading_color'            => Utils::sanitize_color( $slide['heading_color'] ),
				'description_font_size'    => intval( $slide['description_font_size'] ),
				'description_gutter'       => sanitize_text_field( $slide['description_gutter'] ),
				'description_color'        => Utils::sanitize_color( $slide['description_color'] ),
				// Slide Link
				'link_type'                => sanitize_text_field( $slide['link_type'] ),
				'slide_link'               => esc_url_raw( $slide['slide_link'] ),
				'link_target'              => sanitize_text_field( $slide['link_target'] ),
				// Slide Button #1
				'button_one_text'          => sanitize_text_field( $slide['button_one_text'] ),
				'button_one_url'           => esc_url_raw( $slide['button_one_url'] ),
				'button_one_target'        => sanitize_text_field( $slide['button_one_target'] ),
				'button_one_type'          => sanitize_text_field( $slide['button_one_type'] ),
				'button_one_size'          => sanitize_text_field( $slide['button_one_size'] ),
				'button_one_border_width'  => sanitize_text_field( $slide['button_one_border_width'] ),
				'button_one_border_radius' => sanitize_text_field( $slide['button_one_border_radius'] ),
				'button_one_bg_color'      => Utils::sanitize_color( $slide['button_one_bg_color'] ),
				'button_one_color'         => Utils::sanitize_color( $slide['button_one_color'] ),
				// Slide Button #2
				'button_two_text'          => sanitize_text_field( $slide['button_two_text'] ),
				'button_two_url'           => esc_url_raw( $slide['button_two_url'] ),
				'button_two_target'        => sanitize_text_field( $slide['button_two_target'] ),
				'button_two_type'          => sanitize_text_field( $slide['button_two_type'] ),
				'button_two_size'          => sanitize_text_field( $slide['button_two_size'] ),
				'button_two_border_width'  => sanitize_text_field( $slide['button_two_border_width'] ),
				'button_two_border_radius' => sanitize_text_field( $slide['button_two_border_radius'] ),
				'button_two_bg_color'      => Utils::sanitize_color( $slide['button_two_bg_color'] ),
				'button_two_color'         => Utils::sanitize_color( $slide['button_two_color'] ),
			);

			return $_slide;
		}, $_content_slides );

		update_post_meta( $post_id, '_content_slider', $_slides );
	}

	private function update_content_settings( $post_id ) {
		$setting   = $_POST['content_settings'];
		$_settings = array(
			'slide_height'      => sanitize_text_field( $setting['slide_height'] ),
			'content_width'     => sanitize_text_field( $setting['content_width'] ),
			'content_animation' => sanitize_text_field( $setting['content_animation'] ),
			'slide_padding'     => array(
				'top'    => sanitize_text_field( $setting['slide_padding']['top'] ),
				'right'  => sanitize_text_field( $setting['slide_padding']['right'] ),
				'bottom' => sanitize_text_field( $setting['slide_padding']['bottom'] ),
				'left'   => sanitize_text_field( $setting['slide_padding']['left'] ),
			),
		);
		update_post_meta( $post_id, '_content_slider_settings', $_settings );
	}
}
