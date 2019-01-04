<?php

namespace CarouselSlider\Modules\PostCarousel;

use CarouselSlider\Abstracts\AbstractSetting;
use CarouselSlider\Supports\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Setting extends AbstractSetting {

	/**
	 * Register carousel settings
	 */
	public function register_settings() {
		$this->set_section( array(
			'id'       => 'post_carousel',
			'title'    => esc_html__( 'Post Carousel', 'carousel-slider' ),
			'priority' => 10,
			'active'   => true,
		) );

		$settings = array(
			array(
				'id'      => 'query_type',
				'section' => 'post_carousel',
				'type'    => 'select',
				'label'   => esc_html__( 'Query Type', 'carousel-slider' ),
				'default' => 'latest_posts',
				'choices' => Utils::get_post_query_type( false ),
			),
			array(
				'id'          => 'date_from',
				'section'     => 'post_carousel',
				'type'        => 'date',
				'label'       => esc_html__( 'Date from', 'carousel-slider' ),
				'description' => sprintf( esc_html__( 'Example: %s', 'carousel-slider' ), date( 'F d, Y', strtotime( '-3 months' ) ) ),
			),
			array(
				'id'          => 'date_to',
				'section'     => 'post_carousel',
				'type'        => 'date',
				'label'       => esc_html__( 'Date to', 'carousel-slider' ),
				'description' => sprintf( esc_html__( 'Example: %s', 'carousel-slider' ), date( 'F d, Y', strtotime( '-7 days' ) ) ),
			),
			array(
				'id'          => 'categories',
				'section'     => 'post_carousel',
				'type'        => 'select',
				'label'       => esc_html__( 'Post Categories', 'carousel-slider' ),
				'description' => esc_html__( 'Show posts associated with selected categories.', 'carousel-slider' ),
				'input_attrs' => array( 'multiple' => true, ),
				'choices'     => Slider::get_post_categories(),
			),
			array(
				'id'          => 'tags',
				'section'     => 'post_carousel',
				'type'        => 'select',
				'label'       => esc_html__( 'Post Tags', 'carousel-slider' ),
				'description' => esc_html__( 'Show posts associated with selected tags.', 'carousel-slider' ),
				'input_attrs' => array( 'multiple' => true, ),
				'choices'     => Slider::get_post_tags(),
			),
			array(
				'id'          => 'post_in',
				'section'     => 'post_carousel',
				'type'        => 'select',
				'label'       => esc_html__( 'Specific posts', 'carousel-slider' ),
				'description' => esc_html__( 'Select posts that you want to show as slider. Select at least 5 posts', 'carousel-slider' ),
				'input_attrs' => array( 'multiple' => true, ),
				'choices'     => Slider::get_posts_list(),
			),
			array(
				'id'          => 'per_page',
				'section'     => 'post_carousel',
				'type'        => 'number',
				'label'       => esc_html__( 'Posts per page', 'carousel-slider' ),
				'default'     => 12,
				'description' => esc_html__( 'How many post you want to show on carousel slide.', 'carousel-slider' ),
			),
			array(
				'id'          => 'orderby',
				'section'     => 'post_carousel',
				'type'        => 'select',
				'label'       => esc_html__( 'Order by', 'carousel-slider' ),
				'default'     => 'ID',
				'choices'     => Utils::get_post_orderby( false ),
				'input_attrs' => array( 'class' => 'sp-input-text' ),
			),
			array(
				'id'      => 'order',
				'section' => 'post_carousel',
				'type'    => 'radio-button',
				'label'   => esc_html__( 'Order', 'carousel-slider' ),
				'default' => 'DESC',
				'choices' => array(
					'ASC'  => esc_html__( 'Ascending', 'carousel-slider' ),
					'DESC' => esc_html__( 'Descending', 'carousel-slider' ),
				),
			),
			array(
				'id'          => 'height',
				'section'     => 'post_carousel',
				'type'        => 'number',
				'label'       => esc_html__( 'Columns Height', 'carousel-slider' ),
				'description' => esc_html__( 'Enter columns height for posts carousel in numbers. 450 (px) is perfect when columns width is around 300px or higher. Otherwise you need to change it for perfection.', 'carousel-slider' ),
				'default'     => 450,
			),
		);

		$this->set_fields( $settings );
	}
}
