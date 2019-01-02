<?php

namespace CarouselSlider\Modules\PostCarousel;

use CarouselSlider\Abstracts\AbstractSlider;
use CarouselSlider\Supports\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Slider extends AbstractSlider {

	/**
	 * Get query type
	 *
	 * @return string
	 */
	public function get_query_type() {
		$valid = Utils::get_post_query_type();
		$type  = $this->get_prop( 'query_type' );

		return in_array( $type, $valid ) ? $type : 'latest_posts';
	}

	/**
	 * Get total number of slider to show
	 *
	 * @return int
	 */
	public function get_per_page() {
		return intval( $this->get_prop( 'per_page' ) );
	}

	/**
	 * Get post orderby
	 *
	 * @return string
	 */
	public function get_orderby() {
		$valid   = Utils::get_post_orderby();
		$orderby = $this->get_prop( 'orderby' );

		return in_array( $orderby, $valid ) ? $orderby : 'rand';
	}

	/**
	 * Get order
	 *
	 * @return string
	 */
	public function get_order() {
		$order = $this->get_prop( 'order' );

		return in_array( $order, array( 'ASC', 'DESC' ) ) ? $order : 'DESC';
	}

	/**
	 * Get list of post ids
	 *
	 * @return array
	 */
	public function get_post_in() {
		$ids = $this->get_prop( 'post_in' );

		if ( is_string( $ids ) ) {
			$ids = explode( ',', $ids );
		}

		return array_filter( array_map( 'intval', $ids ) );
	}

	/**
	 * Get post categories ids
	 *
	 * @return array
	 */
	public function get_categories() {
		$categories = $this->get_prop( 'categories' );

		if ( is_string( $categories ) ) {
			$categories = explode( ',', $categories );
		}

		$categories = array_filter( array_map( 'intval', $categories ) );

		return $categories;
	}

	/**
	 * Get post tags ids
	 *
	 * @return array
	 */
	public function get_tags() {
		$tags = $this->get_prop( 'tags' );

		if ( is_string( $tags ) ) {
			$tags = explode( ',', $tags );
		}

		return array_filter( array_map( 'intval', $tags ) );
	}

	/**
	 * Get date from
	 *
	 * @return string
	 */
	public function get_date_from() {
		$date = $this->get_prop( 'date_from' );

		return $date;
	}

	/**
	 * Get date to
	 *
	 * @return string
	 */
	public function get_date_to() {
		$date = $this->get_prop( 'date_to' );

		return $date;
	}

	/**
	 * Get post carousel height
	 *
	 * @return int
	 */
	public function get_height() {
		return intval( $this->get_prop( 'height' ) );
	}

	/**
	 * Represent current class as array
	 *
	 * @return array
	 */
	public function to_array() {
		$data               = parent::to_array();
		$data['posts']      = $this->prepare_posts_for_rest();
		$data['height']     = $this->get_height();
		$data['query_type'] = $this->get_query_type();
		$data['per_page']   = $this->get_per_page();
		$data['orderby']    = $this->get_orderby();
		$data['order']      = $this->get_order();
		$data['post_in']    = $this->get_post_in();
		$data['categories'] = $this->get_categories();
		$data['tags']       = $this->get_tags();
		$data['date_from']  = $this->get_date_from();
		$data['date_to']    = $this->get_date_to();

		return $data;
	}

	/**
	 * Read slider data
	 */
	protected function read_slider_data() {
		parent::read_slider_data();
		$this->data['query_type'] = $this->get_meta( '_post_query_type' );
		$this->data['per_page']   = $this->get_meta( '_posts_per_page' );
		$this->data['orderby']    = $this->get_meta( '_post_orderby' );
		$this->data['order']      = $this->get_meta( '_post_order' );
		$this->data['post_in']    = $this->get_meta( '_post_in' );
		$this->data['categories'] = $this->get_meta( '_post_categories' );
		$this->data['tags']       = $this->get_meta( '_post_tags' );
		$this->data['date_from']  = $this->get_meta( '_post_date_after' );
		$this->data['date_to']    = $this->get_meta( '_post_date_before' );
		$this->data['height']     = $this->get_meta( '_post_height' );
	}

	/**
	 * Get properties to meta keys
	 *
	 * @return array
	 */
	protected static function props_to_meta_key() {
		$keys = parent::props_to_meta_key();

		$keys['query_type'] = '_post_query_type';
		$keys['per_page']   = '_posts_per_page';
		$keys['order']      = '_post_order';
		$keys['orderby']    = '_post_orderby';
		$keys['post_in']    = '_post_in';
		$keys['categories'] = '_post_categories';
		$keys['tags']       = '_post_tags';
		$keys['date_from']  = '_post_date_after';
		$keys['date_to']    = '_post_date_before';
		$keys['height']     = '_post_height';

		return $keys;
	}

	/**
	 * Get posts data for array representation
	 *
	 * @return array
	 */
	public function prepare_posts_for_rest() {
		$_posts = $this->get_posts();
		$posts  = array();
		foreach ( $_posts as $post ) {
			$item    = new SliderItem( $post );
			$posts[] = $item->to_array();
		}

		return $posts;
	}

	/**
	 * Get posts
	 *
	 * @return \WP_Post[] list of posts
	 */
	public function get_posts() {
		$query_type = $this->get_query_type();

		$args = array(
			'post_type'      => 'post',
			'post_status'    => 'publish',
			'order'          => $this->get_order(),
			'orderby'        => $this->get_orderby(),
			'posts_per_page' => $this->get_per_page()
		);

		if ( $query_type == 'specific_posts' ) {
			$args = wp_parse_args( array( 'post__in' => $this->get_post_in(), 'posts_per_page' => - 1 ), $args );
		}

		// Get posts by post categories IDs
		if ( $query_type == 'post_categories' ) {
			$args = wp_parse_args( array( 'category__in' => $this->get_categories() ), $args );
		}

		// Get posts by post tags IDs
		if ( $query_type == 'post_tags' ) {
			$args = wp_parse_args( array( 'tag__in' => $this->get_tags() ), $args );
		}

		// Get posts by date range
		if ( $query_type == 'date_range' ) {
			$post_date_after  = $this->get_date_from();
			$post_date_before = $this->get_date_to();

			$date_query = array( 'inclusive' => true, );

			if ( $post_date_after && $post_date_before ) {
				$date_query['after']  = $post_date_after;
				$date_query['before'] = $post_date_before;
			} else if ( $post_date_after ) {
				$date_query['after'] = $post_date_after;
			} else if ( $post_date_before ) {
				$date_query['before'] = $post_date_before;
			}

			$args = wp_parse_args( array( 'date_query' => array( $date_query ) ), $args );
		}

		return get_posts( $args );
	}

	/**
	 * Get post categories list
	 *
	 * @return array
	 */
	public static function get_post_categories() {
		return static::get_terms( 'category' );
	}

	/**
	 * Get post tags list
	 *
	 * @return array
	 */
	public static function get_post_tags() {
		return static::get_terms( 'post_tag' );
	}
}
