<?php

namespace CarouselSlider\Modules\ProductCarousel;

use CarouselSlider\Abstracts\Carousel;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class ProductCarousel extends Carousel {

	/**
	 * Check if WooCommerce version at least 3.0.0
	 *
	 * @return bool
	 */
	public static function is_wc_version_3() {
		return defined( 'WC_VERSION' ) && version_compare( WC_VERSION, '3.0.0', '>=' );
	}

	/**
	 * Get query types
	 *
	 * @param bool $key_only
	 *
	 * @return array
	 */
	public static function get_query_types( $key_only = false ) {
		$types = array(
			'query_product'      => esc_html__( 'Query Products', 'carousel-slider' ),
			'product_categories' => esc_html__( 'Product Categories', 'carousel-slider' ),
			'product_tags'       => esc_html__( 'Product Tags', 'carousel-slider' ),
			'specific_products'  => esc_html__( 'Specific Products', 'carousel-slider' ),
		);

		if ( $key_only ) {
			return array_keys( $types );
		}

		return $types;
	}

	/**
	 * Get product query types
	 *
	 * @param bool $key_only
	 *
	 * @return array
	 */
	public static function get_product_query_types( $key_only = false ) {
		$types = array(
			'featured'                => esc_html__( 'Featured Products', 'carousel-slider' ),
			'recent'                  => esc_html__( 'Recent Products', 'carousel-slider' ),
			'sale'                    => esc_html__( 'Sale Products', 'carousel-slider' ),
			'best_selling'            => esc_html__( 'Best-Selling Products', 'carousel-slider' ),
			'top_rated'               => esc_html__( 'Top Rated Products', 'carousel-slider' ),
			'product_categories_list' => esc_html__( 'Product Categories List', 'carousel-slider' ),
		);

		if ( $key_only ) {
			return array_keys( $types );
		}

		return $types;
	}

	/**
	 * Get query type
	 *
	 * @return string
	 */
	public function get_query_type() {
		$valid_query_type = static::get_query_types( true );
		$query_type       = $this->get_prop( 'query_type' );
		// Typo mistake, for backup compatibility
		$query_type = ( 'query_porduct' == $query_type ) ? 'query_product' : $query_type;
		$query_type = in_array( $query_type, $valid_query_type ) ? $query_type : 'query_product';

		$valid_query = static::get_product_query_types( true );
		$query       = $this->get_prop( 'query' );
		$query       = in_array( $query, $valid_query ) ? $query : 'recent';


		if ( 'query_product' == $query_type ) {
			$query_type = $query;
		}

		return $query_type;
	}

	/**
	 * Check if product categories list slider
	 *
	 * @return bool
	 */
	public function is_product_categories_list() {
		return $this->get_query_type() == 'product_categories_list';
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

	/**
	 * Get products by carousel slider ID
	 *
	 * @return array|\WP_Post[] List of posts.
	 */
	public function get_products() {
		$product_query = $this->get_query_type();

		if ( $product_query == 'featured' ) {
			return $this->get_featured_products();
		}

		if ( $product_query == 'best_selling' ) {
			return $this->get_best_selling_products();
		}

		if ( $product_query == 'recent' ) {
			return $this->get_recent_products();
		}

		if ( $product_query == 'sale' ) {
			return $this->get_sale_products();
		}

		if ( $product_query == 'top_rated' ) {
			return $this->get_top_rated_products();
		}

		if ( $product_query == 'specific_products' ) {
			return $this->get_products_by_ids();
		}

		if ( $product_query == 'product_categories' ) {
			return $this->get_products_by_categories();
		}

		if ( $product_query == 'product_tags' ) {
			return $this->get_products_by_tags();
		}

		return array();
	}

	/**
	 * List multiple products by product ids
	 * Works with WooCommerce Version 2.5.*, 2.6.*, 3.0.* - 3.5.*
	 *
	 * @return array|\WP_Post[] List of posts.
	 */
	public function get_products_by_ids() {
		$query_args = array(
			'posts_per_page'      => - 1,
			'post_type'           => 'product',
			'post_status'         => 'publish',
			'ignore_sticky_posts' => 1,
			'orderby'             => 'title',
			'order'               => 'asc',
			'post__in'            => $this->get_product_in(),
			'meta_query'          => WC()->query->get_meta_query(),
		);

		if ( static::is_wc_version_3() ) {
			$query_args['tax_query'] = WC()->query->get_tax_query();
		}

		return get_posts( $query_args );
	}

	/**
	 * Get Recent Products
	 * Works with WooCommerce Version 2.5.*, 2.6.*, 3.0.* - 3.5.*
	 *
	 * @return array|\WP_Post[] List of posts.
	 */
	public function get_recent_products() {
		$query_args = array(
			'post_type'           => 'product',
			'post_status'         => 'publish',
			'ignore_sticky_posts' => 1,
			'orderby'             => 'date',
			'order'               => 'desc',
			'posts_per_page'      => $this->get_per_page(),
			'meta_query'          => WC()->query->get_meta_query(),
		);

		if ( static::is_wc_version_3() ) {
			$query_args['tax_query'] = WC()->query->get_tax_query();
		}

		return get_posts( $query_args );
	}

	/**
	 * List best selling products on sale.
	 * Works with WooCommerce Version 2.5.*, 2.6.*, 3.0.* - 3.5.*
	 *
	 * @return array|\WP_Post[] List of posts.
	 */
	public function get_best_selling_products() {
		$query_args = array(
			'post_type'           => 'product',
			'post_status'         => 'publish',
			'ignore_sticky_posts' => 1,
			'meta_key'            => 'total_sales',
			'orderby'             => 'meta_value_num',
			'posts_per_page'      => $this->get_per_page(),
			'meta_query'          => WC()->query->get_meta_query(),
		);

		if ( static::is_wc_version_3() ) {
			$query_args['tax_query'] = WC()->query->get_tax_query();
		}

		return get_posts( $query_args );
	}

	/**
	 * Get WooCommerce featured products
	 * Works with WooCommerce Version 2.5.*, 2.6.*, 3.0.* - 3.5.*
	 *
	 * @return array|\WP_Post[] List of posts.
	 */
	public function get_featured_products() {
		$meta_query = WC()->query->get_meta_query();

		if ( ! static::is_wc_version_3() ) {
			$meta_query[] = array( 'key' => '_featured', 'value' => 'yes' );
		}

		$query_args = array(
			'post_type'           => 'product',
			'post_status'         => 'publish',
			'ignore_sticky_posts' => 1,
			'orderby'             => 'date',
			'order'               => 'desc',
			'posts_per_page'      => $this->get_per_page(),
			'meta_query'          => $meta_query,
		);

		if ( static::is_wc_version_3() ) {
			$tax_query               = WC()->query->get_tax_query();
			$tax_query[]             = array(
				'taxonomy' => 'product_visibility',
				'field'    => 'name',
				'terms'    => 'featured',
				'operator' => 'IN',
			);
			$query_args['tax_query'] = $tax_query;
		}

		return get_posts( $query_args );
	}

	/**
	 * List all products on sale.
	 * Works with WooCommerce Version 2.5.*, 2.6.*, 3.0.* - 3.5.*
	 *
	 * @return array|\WP_Post[] List of posts.
	 */
	public function get_sale_products() {
		$query_args = array(
			'orderby'        => 'title',
			'order'          => 'asc',
			'no_found_rows'  => 1,
			'post_status'    => 'publish',
			'post_type'      => 'product',
			'posts_per_page' => $this->get_per_page(),
			'meta_query'     => WC()->query->get_meta_query(),
			'post__in'       => array_merge( array( 0 ), wc_get_product_ids_on_sale() ),
		);

		if ( static::is_wc_version_3() ) {
			$query_args['tax_query'] = WC()->query->get_tax_query();
		}

		return get_posts( $query_args );
	}

	/**
	 * Get top rated products
	 * Works with WooCommerce Version 2.5.*, 2.6.*, 3.0.* - 3.5.*
	 *
	 * @return array|\WP_Post[] List of posts.
	 */
	public function get_top_rated_products() {
		if ( static::is_wc_version_3() ) {
			$query_args = array(
				'no_found_rows'  => 1,
				'post_status'    => 'publish',
				'post_type'      => 'product',
				'meta_key'       => '_wc_average_rating',
				'orderby'        => 'meta_value_num',
				'order'          => 'DESC',
				'posts_per_page' => $this->get_per_page(),
				'meta_query'     => WC()->query->get_meta_query(),
				'tax_query'      => WC()->query->get_tax_query(),
			);

			return get_posts( $query_args );
		}

		// For WooCommerce version is less than 2.7.0
		add_filter( 'posts_clauses', array( WC()->query, 'order_by_rating_post_clauses' ) );

		$query_args = array(
			'post_type'           => 'product',
			'post_status'         => 'publish',
			'orderby'             => 'title',
			'order'               => 'asc',
			'ignore_sticky_posts' => 1,
			'posts_per_page'      => $this->get_per_page(),
			'meta_query'          => WC()->query->get_meta_query(),
		);

		$_posts = get_posts( $query_args );

		remove_filter( 'posts_clauses', array( WC()->query, 'order_by_rating_post_clauses' ) );

		return $_posts;
	}


	/**
	 * List all (or limited) product categories.
	 * Works with WooCommerce Version 2.5.*, 2.6.*, 3.0.* - 3.5.*
	 *
	 * @return \WP_Term[] List of products terms.
	 */
	public function get_product_categories() {
		$terms = get_terms( array(
			'taxonomy'   => 'product_cat',
			'hide_empty' => 1,
			'orderby'    => 'name',
			'order'      => 'ASC',
		) );

		if ( is_wp_error( $terms ) ) {
			return array();
		}

		return $terms;
	}

	/**
	 * Get products by categories ids
	 * Works with WooCommerce Version 2.5.*, 2.6.*, 3.0.* - 3.5.*
	 *
	 * @return array|\WP_Post[] List of posts.
	 */
	public function get_products_by_categories() {
		$args = array(
			'post_type'          => 'product',
			'post_status'        => 'publish',
			'ignore_sticky_post' => 1,
			'posts_per_page'     => $this->get_per_page(),
			'tax_query'          => array(
				array(
					'taxonomy' => 'product_cat',
					'field'    => 'term_id',
					'terms'    => $this->get_categories(),
					'operator' => 'IN',
				),
			),
		);

		return get_posts( $args );
	}

	/**
	 * Get products by tags ids
	 * Works with WooCommerce Version 2.5.*, 2.6.*, 3.0.* - 3.5.*
	 *
	 * @return array|\WP_Post[] List of posts.
	 */
	public function get_products_by_tags() {
		$args = array(
			'post_type'          => 'product',
			'post_status'        => 'publish',
			'ignore_sticky_post' => 1,
			'posts_per_page'     => $this->get_per_page(),
			'tax_query'          => array(
				array(
					'taxonomy' => 'product_tag',
					'field'    => 'term_id',
					'terms'    => $this->get_tags(),
					'operator' => 'IN',
				),
			),
		);

		return get_posts( $args );
	}
}
