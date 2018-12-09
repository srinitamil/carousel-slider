<?php

namespace CarouselSlider\Supports;

use CarouselSlider\Abstracts\Carousel;
use CarouselSlider\GalleryImageCarousel;
use CarouselSlider\HeroCarousel;
use CarouselSlider\PostCarousel;
use CarouselSlider\Product;
use CarouselSlider\ProductCarousel;
use CarouselSlider\UrlImageCarousel;
use CarouselSlider\VideoCarousel;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Utils {

	/**
	 * Check if url is valid as per RFC 2396 Generic Syntax
	 *
	 * @param  string $url
	 *
	 * @return boolean
	 */
	public static function is_url( $url ) {
		return filter_var( $url, FILTER_VALIDATE_URL );
	}

	/**
	 * Sanitizes a Hex, RGB or RGBA color
	 *
	 * @param $color
	 *
	 * @return mixed|string
	 */
	public static function sanitize_color( $color ) {
		if ( '' === $color ) {
			return '';
		}

		// Trim unneeded whitespace
		$color = str_replace( ' ', '', $color );

		// If this is hex color, validate and return it
		if ( 1 === preg_match( '|^#([A-Fa-f0-9]{3}){1,2}$|', $color ) ) {
			return $color;
		}

		// If this is rgb, validate and return it
		if ( 'rgb(' === substr( $color, 0, 4 ) ) {
			list( $red, $green, $blue ) = sscanf( $color, 'rgb(%d,%d,%d)' );

			if ( ( $red >= 0 && $red <= 255 ) &&
			     ( $green >= 0 && $green <= 255 ) &&
			     ( $blue >= 0 && $blue <= 255 )
			) {
				return "rgb({$red},{$green},{$blue})";
			}
		}

		// If this is rgba, validate and return it
		if ( 'rgba(' === substr( $color, 0, 5 ) ) {
			list( $red, $green, $blue, $alpha ) = sscanf( $color, 'rgba(%d,%d,%d,%f)' );

			if ( ( $red >= 0 && $red <= 255 ) &&
			     ( $green >= 0 && $green <= 255 ) &&
			     ( $blue >= 0 && $blue <= 255 ) &&
			     $alpha >= 0 && $alpha <= 1
			) {
				return "rgba({$red},{$green},{$blue},{$alpha})";
			}
		}

		return '';
	}

	/**
	 * Check if WooCommerce is active
	 *
	 * @return bool
	 */
	public static function is_woocommerce_active() {

		if ( in_array( 'woocommerce/woocommerce.php', get_option( 'active_plugins' ) ) ) {
			return true;
		}

		if ( defined( 'WC_VERSION' ) || defined( 'WOOCOMMERCE_VERSION' ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Get products by carousel slider ID
	 *
	 * @param $carousel_id
	 *
	 * @return array
	 */
	public static function get_products( $carousel_id ) {
		$id            = $carousel_id;
		$per_page      = intval( get_post_meta( $id, '_products_per_page', true ) );
		$query_type    = get_post_meta( $id, '_product_query_type', true );
		$query_type    = ! empty( $query_type ) ? $query_type : 'query_product';
		$product_query = get_post_meta( $id, '_product_query', true );

		$args = array( 'posts_per_page' => $per_page );

		if ( $query_type == 'query_product' ) {

			// Get features products
			if ( $product_query == 'featured' ) {
				return Product::featured_products( $args );
			}

			// Get best_selling products
			if ( $product_query == 'best_selling' ) {
				return Product::best_selling_products( $args );
			}

			// Get recent products
			if ( $product_query == 'recent' ) {
				return Product::recent_products( $args );
			}

			// Get sale products
			if ( $product_query == 'sale' ) {
				return Product::sale_products( $args );
			}

			// Get top_rated products
			if ( $product_query == 'top_rated' ) {
				return Product::top_rated_products( $args );
			}
		}

		// Get products by product IDs
		if ( $query_type == 'specific_products' ) {
			$product_in = get_post_meta( $id, '_product_in', true );
			$product_in = array_map( 'intval', explode( ',', $product_in ) );

			return Product::products_by_ids( array(
				'post__in' => $product_in
			) );
		}

		// Get posts by post categories IDs
		if ( $query_type == 'product_categories' ) {
			$product_cat_ids = get_post_meta( $id, '_product_categories', true );
			$product_cat_ids = array_map( 'intval', explode( ",", $product_cat_ids ) );

			return Product::products_by_categories( $product_cat_ids, $per_page );
		}

		// Get posts by post tags IDs
		if ( $query_type == 'product_tags' ) {
			$product_tags = get_post_meta( $id, '_product_tags', true );
			$product_tags = array_map( 'intval', explode( ',', $product_tags ) );

			return Product::products_by_tags( $product_tags, $per_page );
		}

		return array();
	}

	/**
	 * Get default setting
	 *
	 * @param null $key
	 *
	 * @return mixed
	 */
	public static function get_default_setting( $key = null ) {
		$options = array(
			'product_title_color'       => '#323232',
			'product_button_bg_color'   => '#00d1b2',
			'product_button_text_color' => '#f1f1f1',
			'nav_color'                 => '#f1f1f1',
			'nav_active_color'          => '#00d1b2',
			'margin_right'              => 10,
			'lazy_load_image'           => 'on',
		);

		$options = apply_filters( 'carousel_slider_default_settings', $options );

		if ( is_null( $key ) ) {
			return $options;
		}

		return isset( $options[ $key ] ) ? $options[ $key ] : null;
	}

	/**
	 * Get carousel slider available slide type
	 *
	 * @param bool $key_only
	 *
	 * @return array
	 */
	public static function get_slide_types( $key_only = true ) {
		$types = apply_filters( 'carousel_slider_slide_types', array(
			'image-carousel'     => __( 'Image Carousel', 'carousel-slider' ),
			'image-carousel-url' => __( 'Image Carousel (URL)', 'carousel-slider' ),
			'post-carousel'      => __( 'Post Carousel', 'carousel-slider' ),
			'product-carousel'   => __( 'Product Carousel', 'carousel-slider' ),
			'video-carousel'     => __( 'Video Carousel', 'carousel-slider' ),
			'hero-banner-slider' => __( 'Hero Carousel', 'carousel-slider' ),
		) );

		if ( $key_only ) {
			return array_keys( $types );
		}

		return $types;
	}

	/**
	 * Get post query type
	 *
	 * @param bool $key_only
	 *
	 * @return array
	 */
	public static function get_post_query_type( $key_only = true ) {
		$types = array(
			'latest_posts'    => esc_html__( 'Latest Posts', 'carousel-slider' ),
			'date_range'      => esc_html__( 'Date Range', 'carousel-slider' ),
			'post_categories' => esc_html__( 'Post Categories', 'carousel-slider' ),
			'post_tags'       => esc_html__( 'Post Tags', 'carousel-slider' ),
			'specific_posts'  => esc_html__( 'Specific posts', 'carousel-slider' ),
		);

		if ( $key_only ) {
			return array_keys( $types );
		}

		return $types;
	}

	/**
	 * Get post orderby
	 *
	 * @param bool $key_only
	 *
	 * @return array
	 */
	public static function get_post_orderby( $key_only = true ) {
		$options = array(
			'none'          => esc_html__( 'No order', 'carousel-slider' ),
			'ID'            => esc_html__( 'Post id', 'carousel-slider' ),
			'author'        => esc_html__( 'Post author', 'carousel-slider' ),
			'title'         => esc_html__( 'Post title', 'carousel-slider' ),
			'modified'      => esc_html__( 'Last modified date', 'carousel-slider' ),
			'rand'          => esc_html__( 'Random order', 'carousel-slider' ),
			'comment_count' => esc_html__( 'Number of comments', 'carousel-slider' ),
		);

		if ( $key_only ) {
			return array_keys( $options );
		}

		return $options;
	}

	public static function get_sliders( array $args = array() ) {

	}

	/**
	 * Get slider
	 *
	 * @param int $slider_id
	 *
	 * @return Carousel
	 */
	public static function get_slider( $slider_id ) {
		$type = get_post_meta( $slider_id, '_slide_type', true );
		if ( 'image-carousel' == $type ) {
			return new GalleryImageCarousel( $slider_id );
		}
		if ( 'image-carousel-url' == $type ) {
			return new UrlImageCarousel( $slider_id );
		}
		if ( 'post-carousel' == $type ) {
			return new PostCarousel( $slider_id );
		}
		if ( 'product-carousel' == $type ) {
			return new ProductCarousel( $slider_id );
		}
		if ( 'video-carousel' == $type ) {
			return new VideoCarousel( $slider_id );
		}
		if ( 'hero-banner-slider' == $type ) {
			return new HeroCarousel( $slider_id );
		}

		return new Carousel( $slider_id );
	}

	/**
	 * Creates Carousel Slider test page
	 *
	 * @param array $ids
	 */
	public static function create_test_page( array $ids = array() ) {
		$page_path    = 'carousel-slider-test';
		$page_title   = __( 'Carousel Slider Test', 'carousel-slider' );
		$page_content = '';

		if ( empty( $ids ) ) {
			$ids = get_posts( array( 'post_type' => 'carousels', 'post_status' => 'publish', 'numberposts' => - 1 ) );
		}

		foreach ( $ids as $id ) {
			$_post        = get_post( $id );
			$page_content .= '<!-- wp:heading {"level":4} --><h4>' . $_post->post_title . '</h4><!-- /wp:heading -->';
			$page_content .= '<!-- wp:shortcode -->[carousel_slide id=\'' . $id . '\']<!-- /wp:shortcode -->';
			$page_content .= '<!-- wp:spacer {"height":100} --><div style="height:100px" aria-hidden="true" class="wp-block-spacer"></div><!-- /wp:spacer -->';
		}

		// Check that the page doesn't exist already
		$_page = get_page_by_path( $page_path );

		if ( $_page instanceof \WP_Post ) {
			wp_update_post( array(
				'ID'           => $_page->ID,
				'post_content' => $page_content,
				'post_name'    => $page_path,
				'post_title'   => $page_title,
			) );
		} else {
			wp_insert_post( array(
				'post_content'   => $page_content,
				'post_name'      => $page_path,
				'post_title'     => $page_title,
				'post_status'    => 'publish',
				'post_type'      => 'page',
				'ping_status'    => 'closed',
				'comment_status' => 'closed',
			) );
		}
	}

	/**
	 * Get available image sizes
	 *
	 * @param bool $key_only
	 *
	 * @return array
	 */
	public static function get_available_image_sizes( $key_only = false ) {
		global $_wp_additional_image_sizes;

		$sizes = array();

		foreach ( get_intermediate_image_sizes() as $_size ) {
			if ( in_array( $_size, array( 'thumbnail', 'medium', 'medium_large', 'large' ) ) ) {

				$width  = get_option( "{$_size}_size_w" );
				$height = get_option( "{$_size}_size_h" );
				$crop   = (bool) get_option( "{$_size}_crop" ) ? 'hard' : 'soft';

				$sizes[ $_size ] = "{$_size} - $crop:{$width}x{$height}";

			} elseif ( isset( $_wp_additional_image_sizes[ $_size ] ) ) {

				$width  = $_wp_additional_image_sizes[ $_size ]['width'];
				$height = $_wp_additional_image_sizes[ $_size ]['height'];
				$crop   = $_wp_additional_image_sizes[ $_size ]['crop'] ? 'hard' : 'soft';

				$sizes[ $_size ] = "{$_size} - $crop:{$width}x{$height}";
			}
		}

		$sizes = array_merge( $sizes, array( 'full' => 'original uploaded image' ) );

		if ( $key_only ) {
			return array_keys( $sizes );
		}

		return $sizes;
	}
}
