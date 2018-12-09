<?php

use CarouselSlider\Supports\Form;
use CarouselSlider\Supports\Utils;

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}
?>
<div data-id="open" id="section_post_query" class="shapla-toggle shapla-toggle--stroke"
     style="display: <?php echo $slide_type != 'post-carousel' ? 'none' : 'block'; ?>">
	<span class="shapla-toggle-title">
		<?php esc_html_e( 'Post Query', 'carousel-slider' ); ?>
	</span>
    <div class="shapla-toggle-inner">
        <div class="shapla-toggle-content">
			<?php
			echo Form::field( array(
				'type'             => 'select',
				'id'               => '_post_query_type',
				'label'            => esc_html__( 'Query Type', 'carousel-slider' ),
				'default'          => 'latest_posts',
				'choices'          => Utils::get_post_query_type( false ),
				'input_attributes' => array( 'class' => 'sp-input-text post_query_type' ),
			) );

			echo Form::field( array(
				'type'             => 'date',
				'id'               => '_post_date_after',
				'label'            => esc_html__( 'Date from', 'carousel-slider' ),
				'description'      => sprintf( esc_html__( 'Example: %s', 'carousel-slider' ), date( 'F d, Y', strtotime( '-3 months' ) ) ),
				'input_attributes' => array( 'class' => 'sp-input-text post_date_after' ),
			) );

			echo Form::field( array(
				'type'             => 'date',
				'id'               => '_post_date_before',
				'label'            => esc_html__( 'Date to', 'carousel-slider' ),
				'description'      => sprintf( esc_html__( 'Example: %s', 'carousel-slider' ), date( 'F d, Y', strtotime( '-7 days' ) ) ),
				'input_attributes' => array( 'class' => 'sp-input-text post_date_before' ),
			) );

			echo Form::field( array(
				'type'             => 'post_terms',
				'id'               => '_post_categories',
				'taxonomy'         => 'category',
				'label'            => esc_html__( 'Post Categories', 'carousel-slider' ),
				'description'      => esc_html__( 'Show posts associated with selected categories.', 'carousel-slider' ),
				'input_attributes' => array(
					'class'    => 'sp-input-text select2 post_categories',
					'multiple' => true,
				),
			) );

			echo Form::field( array(
				'type'             => 'post_terms',
				'id'               => '_post_tags',
				'taxonomy'         => 'post_tag',
				'label'            => esc_html__( 'Post Tags', 'carousel-slider' ),
				'description'      => esc_html__( 'Show posts associated with selected tags.', 'carousel-slider' ),
				'input_attributes' => array(
					'class'    => 'sp-input-text select2 post_tags',
					'multiple' => true,
				),
			) );

			echo Form::field( array(
				'type'             => 'posts_list',
				'id'               => '_post_in',
				'label'            => esc_html__( 'Specific posts', 'carousel-slider' ),
				'description'      => esc_html__( 'Select posts that you want to show as slider. Select at least 5 posts', 'carousel-slider' ),
				'input_attributes' => array(
					'class'    => 'sp-input-text select2 post_in',
					'multiple' => true,
				),
			) );

			echo Form::field( array(
				'type'             => 'number',
				'id'               => '_posts_per_page',
				'label'            => esc_html__( 'Posts per page', 'carousel-slider' ),
				'default'          => 12,
				'description'      => esc_html__( 'How many post you want to show on carousel slide.', 'carousel-slider' ),
				'input_attributes' => array( 'class' => 'sp-input-text posts_per_page' ),
			) );

			echo Form::field( array(
				'type'             => 'select',
				'id'               => '_post_orderby',
				'label'            => esc_html__( 'Order by', 'carousel-slider' ),
				'default'          => 'ID',
				'choices'          => Utils::get_post_orderby( false ),
				'input_attributes' => array( 'class' => 'sp-input-text' ),
			) );

			echo Form::field( array(
				'type'             => 'buttonset',
				'id'               => '_post_order',
				'label'            => esc_html__( 'Order', 'carousel-slider' ),
				'default'          => 'DESC',
				'choices'          => array(
					'ASC'  => esc_html__( 'Ascending', 'carousel-slider' ),
					'DESC' => esc_html__( 'Descending', 'carousel-slider' ),
				),
				'input_attributes' => array( 'class' => 'sp-input-text' ),
			) );

			echo Form::field( array(
				'type'             => 'number',
				'id'               => '_post_height',
				'label'            => esc_html__( 'Colums Height', 'carousel-slider' ),
				'description'      => esc_html__( 'Enter colums height for posts carousel in numbers. 450 (px) is perfect when columns width is around 300px or higher. Otherwise you need to change it for perfection.', 'carousel-slider' ),
				'default'          => 450,
				'input_attributes' => array( 'class' => 'sp-input-text' ),
			) );
			?>
        </div>
    </div>
</div>