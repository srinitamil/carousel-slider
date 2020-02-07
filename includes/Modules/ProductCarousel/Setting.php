<?php

namespace CarouselSlider\Modules\ProductCarousel;

use CarouselSlider\Abstracts\AbstractSetting;
use CarouselSlider\Supports\Utils;

if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

class Setting extends AbstractSetting
{

	/**
	 * Register carousel settings
	 */
	public function register_settings()
	{
		$this->set_section(array(
			'id' => 'product_carousel',
			'title' => esc_html__('Product Carousel', 'carousel-slider'),
			'priority' => 10,
			'active' => true,
		));

		$fields = array(
			array(
				'id' => 'query_type',
				'section' => 'product_carousel',
				'type' => 'select',
				'label' => esc_html__('Query Type', 'carousel-slider'),
				'default' => 'recent',
				'choices' => Slider::get_query_types(),
			),
			array(
				'id' => 'categories',
				'section' => 'product_carousel',
				'type' => 'select',
				'label' => esc_html__('Product Categories', 'carousel-slider'),
				'description' => esc_html__('Show products associated with selected categories.', 'carousel-slider'),
				'input_attrs' => array('multiple' => true),
				'choices' => Slider::get_product_categories_list(),
				'conditions' => array(
					array(
						'name' => 'query_type',
						'operator' => '==',
						'value' => 'product_categories',
					),
				),
			),
			array(
			'id' => 'product_query',
			'section' => 'product_carousel',
			'type' => 'select',
			'label' => esc_html__('Choose Query', 'carousel-slider'),
			'description' => esc_html__('Show products associated with selected queries.', 'carousel-slider'),
			'input_attrs' => array('multiple' => true),
			'choices' => Slider::_get_query_types(),
			'conditions' => array(
				array(
					'name' => 'query_type',
					'operator' => '==',
					'value' => 'product_query',
				),
			),
			),
			array(
				'id' => 'categories',
				'section' => 'product_carousel',
				'type' => 'select',
				'label' => esc_html__('Product Categories', 'carousel-slider'),
				'description' => esc_html__('Show products associated with selected categories.', 'carousel-slider'),
				'input_attrs' => array('multiple' => true),
				'choices' => Slider::get_product_categories_list(),
				'conditions' => array(
					array(
						'name' => 'query_type',
						'operator' => '==',
						'value' => 'product_categories',
					),
				),
			),
			array(
				'id' => 'tags',
				'section' => 'product_carousel',
				'type' => 'select',
				'label' => esc_html__('Product Tags', 'carousel-slider'),
				'description' => esc_html__('Show products associated with selected tags.', 'carousel-slider'),
				'input_attrs' => array('multiple' => true),
				'choices' => Slider::get_product_tags_list(),
				'conditions' => array(
					array(
						'name' => 'query_type',
						'operator' => '==',
						'value' => 'product_tags',
					),
				),
			),
			array(
				'id' => 'product_in',
				'section' => 'product_carousel',
				'type' => 'select',
				'label' => esc_html__('Specific products', 'carousel-slider'),
				'description' => esc_html__('Select products that you want to show as slider. Select at least 5 products', 'carousel-slider'),
				'input_attrs' => array('multiple' => true),
				'choices' => Slider::get_posts_list('product'),
				'conditions' => array(
					array(
						'name' => 'query_type',
						'operator' => '==',
						'value' => 'specific_products',
					),
				),
			),
			array(
				'id' => 'per_page',
				'section' => 'product_carousel',
				'type' => 'number',
				'label' => esc_html__('Product per page', 'carousel-slider'),
				'default' => 12,
				'description' => esc_html__('How many products you want to show on carousel slide.', 'carousel-slider'),
				'conditions' => array(
					array(
						'name' => 'query_type',
						'operator' => '!=',
						'value' => 'specific_products',
					),
				),
			),
			array(
				'id' => 'show_title',
				'section' => 'product_carousel',
				'type' => 'switch',
				'label' => esc_html__('Show Title.', 'carousel-slider'),
				'description' => esc_html__('Check to show product title.', 'carousel-slider'),
				'default' => true
			),
			array(
				'id' => 'show_rating',
				'section' => 'product_carousel',
				'type' => 'switch',
				'label' => esc_html__('Show Rating.', 'carousel-slider'),
				'description' => esc_html__('Check to show product rating.', 'carousel-slider'),
				'default' => true
			),
			array(
				'id' => 'show_price',
				'section' => 'product_carousel',
				'type' => 'switch',
				'label' => esc_html__('Show Price.', 'carousel-slider'),
				'description' => esc_html__('Check to show product price.', 'carousel-slider'),
				'default' => true
			),
			array(
				'id' => 'show_cart_button',
				'section' => 'product_carousel',
				'type' => 'switch',
				'label' => esc_html__('Show Cart Button.', 'carousel-slider'),
				'description' => esc_html__('Check to show product add to cart button.', 'carousel-slider'),
				'default' => true
			),
			array(
				'id' => 'show_onsale',
				'section' => 'product_carousel',
				'type' => 'switch',
				'label' => esc_html__('Show Sale Tag', 'carousel-slider'),
				'description' => esc_html__('Check to show product onsale tag for products on sale.', 'carousel-slider'),
				'default' => true
			),
			array(
				'id' => 'show_quick_view',
				'section' => 'product_carousel',
				'type' => 'switch',
				'label' => esc_html__('Show Quick View', 'carousel-slider'),
				'description' => esc_html__('Check to show quick view button.', 'carousel-slider'),
				'default' => true
			),
			array(
				'id' => 'title_color',
				'section' => 'product_carousel',
				'type' => 'color',
				'label' => esc_html__('Title Color', 'carousel-slider'),
				'description' => esc_html__('Pick a color for product title. This color will also apply to sale tag and price.', 'carousel-slider'),
				'default' => Utils::get_default_setting('product_title_color'),
			),
			array(
				'id' => 'button_color',
				'section' => 'product_carousel',
				'type' => 'color',
				'label' => esc_html__('Button Background Color', 'carousel-slider'),
				'description' => esc_html__('Pick a color for button background color. This color will also apply to product rating.', 'carousel-slider'),
				'default' => Utils::get_default_setting('product_button_bg_color')
			),
			array(
				'id' => 'button_text_color',
				'section' => 'product_carousel',
				'type' => 'color',
				'label' => esc_html__('Button Text Color', 'carousel-slider'),
				'description' => esc_html__('Pick a color for button text color.', 'carousel-slider'),
				'default' => Utils::get_default_setting('product_button_text_color')
			)
		);
		$this->set_fields($fields);
	}
}
