<?php

namespace CarouselSlider;

use CarouselSlider\Abstracts\Carousel;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class ProductCarousel extends Carousel {

	/**
	 * Get query type
	 *
	 * @return string
	 */
	public function get_query_type() {
		$query_type = $this->get_prop( 'query_type' );
		$query      = $this->get_prop( 'query' );
		if ( 'query_product' == $query_type ) {
			$query_type = $query;
		}

		return $query_type;
	}

	/**
	 * Get list of products ids
	 *
	 * @return array
	 */
	public function get_product_in() {
		$ids = $this->get_prop( 'product_in' );

		if ( is_string( $ids ) ) {
			$ids = explode( ',', $ids );
		}

		return array_filter( array_map( 'intval', $ids ) );
	}

	/**
	 * Get products categories ids
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
	 * Get products tags ids
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
	 * Get total number of slider to show
	 *
	 * @return int
	 */
	public function get_per_page() {
		return intval( $this->get_prop( 'per_page' ) );
	}

	/**
	 * Show product title
	 *
	 * @return bool
	 */
	public function show_title() {
		return $this->is_checked( $this->get_prop( 'title' ) );
	}

	/**
	 * Show product rating
	 *
	 * @return bool
	 */
	public function show_rating() {
		return $this->is_checked( $this->get_prop( 'rating' ) );
	}

	/**
	 * Show product price
	 *
	 * @return bool
	 */
	public function show_price() {
		return $this->is_checked( $this->get_prop( 'price' ) );
	}

	/**
	 * Show product cart button
	 *
	 * @return bool
	 */
	public function show_cart_button() {
		return $this->is_checked( $this->get_prop( 'cart_button' ) );
	}

	/**
	 * Show product onsale
	 *
	 * @return bool
	 */
	public function show_onsale() {
		return $this->is_checked( $this->get_prop( 'onsale' ) );
	}

	/**
	 * Show product wishlist
	 *
	 * @return bool
	 */
	public function show_wishlist() {
		return $this->is_checked( $this->get_prop( 'wishlist' ) );
	}

	/**
	 * Show product quick view button
	 *
	 * @return bool
	 */
	public function show_quick_view() {
		return $this->is_checked( $this->get_prop( 'quick_view' ) );
	}

	/**
	 * Get title text color
	 *
	 * @return string
	 */
	public function get_title_color() {
		return $this->get_prop( 'title_color' );
	}

	/**
	 * Get button background color
	 *
	 * @return string
	 */
	public function get_button_color() {
		return $this->get_prop( 'button_color' );
	}

	/**
	 * Get button text color
	 *
	 * @return string
	 */
	public function get_button_text_color() {
		return $this->get_prop( 'button_text_color' );
	}

	/**
	 * Represent current class as array
	 *
	 * @return array
	 */
	public function to_array() {
		$data                      = parent::to_array();
		$data['show_title']        = $this->show_title();
		$data['show_rating']       = $this->show_rating();
		$data['show_price']        = $this->show_price();
		$data['show_cart_button']  = $this->show_cart_button();
		$data['show_onsale']       = $this->show_onsale();
		$data['show_wishlist']     = $this->show_wishlist();
		$data['show_quick_view']   = $this->show_quick_view();
		$data['title_color']       = $this->get_title_color();
		$data['button_color']      = $this->get_button_color();
		$data['button_text_color'] = $this->get_button_text_color();
		$data['products']          = array();

		return $data;
	}

	/**
	 * Read slider data
	 */
	protected function read_slider_data() {
		parent::read_slider_data();
		$this->data['query_type']        = $this->get_meta( '_product_query_type' );
		$this->data['query']             = $this->get_meta( '_product_query' );
		$this->data['categories']        = $this->get_meta( '_product_categories' );
		$this->data['tags']              = $this->get_meta( '_product_tags' );
		$this->data['product_in']        = $this->get_meta( '_product_in' );
		$this->data['per_page']          = $this->get_meta( '_products_per_page' );
		$this->data['title']             = $this->get_meta( '_product_title' );
		$this->data['rating']            = $this->get_meta( '_product_rating' );
		$this->data['price']             = $this->get_meta( '_product_price' );
		$this->data['cart_button']       = $this->get_meta( '_product_cart_button' );
		$this->data['onsale']            = $this->get_meta( '_product_onsale' );
		$this->data['wishlist']          = $this->get_meta( '_product_wishlist' );
		$this->data['quick_view']        = $this->get_meta( '_product_quick_view' );
		$this->data['title_color']       = $this->get_meta( '_product_title_color' );
		$this->data['button_color']      = $this->get_meta( '_product_button_bg_color' );
		$this->data['button_text_color'] = $this->get_meta( '_product_button_text_color' );
	}

	/**
	 * Get properties to meta keys
	 *
	 * @return array
	 */
	protected static function props_to_meta_key() {
		$keys = parent::props_to_meta_key();

		$keys['query_type']        = '_product_query_type';
		$keys['query']             = '_product_query';
		$keys['categories']        = '_product_categories';
		$keys['tags']              = '_product_tags';
		$keys['product_in']        = '_product_in';
		$keys['per_page']          = '_products_per_page';
		$keys['title']             = '_product_title';
		$keys['rating']            = '_product_rating';
		$keys['price']             = '_product_price';
		$keys['cart_button']       = '_product_cart_button';
		$keys['onsale']            = '_product_onsale';
		$keys['wishlist']          = '_product_wishlist';
		$keys['quick_view']        = '_product_quick_view';
		$keys['title_color']       = '_product_title_color';
		$keys['button_color']      = '_product_button_bg_color';
		$keys['button_text_color'] = '_product_button_text_color';

		return $keys;
	}
}
