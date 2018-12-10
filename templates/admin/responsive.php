<?php

use CarouselSlider\Supports\Form;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

echo Form::field( array(
	'type'             => 'slider',
	'id'               => '_items',
	'label'            => esc_html__( 'Columns', 'carousel-slider' ),
	'description'      => esc_html__( 'The number of items you want to see on the Extra Large Desktop Layout (Screens size greater than 1921 pixels DP)', 'carousel-slider' ),
	'default'          => 4,
	'input_attributes' => array( 'min' => 1, 'max' => 20 ),
) );
echo Form::field( array(
	'type'             => 'slider',
	'id'               => '_items_desktop',
	'label'            => esc_html__( 'Columns : Desktop', 'carousel-slider' ),
	'description'      => esc_html__( 'The number of items you want to see on the Desktop Layout (Screens size from 1200 pixels DP to 1920 pixels DP)', 'carousel-slider' ),
	'default'          => 4,
	'input_attributes' => array( 'min' => 1, 'max' => 20 ),
) );
echo Form::field( array(
	'type'             => 'slider',
	'id'               => '_items_small_desktop',
	'label'            => esc_html__( 'Columns : Small Desktop', 'carousel-slider' ),
	'description'      => esc_html__( 'The number of items you want to see on the Small Desktop Layout (Screens size from 993 pixels DP to 1199 pixels DP)', 'carousel-slider' ),
	'default'          => 4,
	'input_attributes' => array( 'min' => 1, 'max' => 20 ),
) );
echo Form::field( array(
	'type'             => 'slider',
	'id'               => '_items_portrait_tablet',
	'label'            => esc_html__( 'Columns : Tablet', 'carousel-slider' ),
	'description'      => esc_html__( 'The number of items you want to see on the Tablet Layout (Screens size from 768 pixels DP to 992 pixels DP)', 'carousel-slider' ),
	'default'          => 3,
	'input_attributes' => array( 'min' => 1, 'max' => 10 ),
) );
echo Form::field( array(
	'type'             => 'slider',
	'id'               => '_items_small_portrait_tablet',
	'label'            => esc_html__( 'Columns : Small Tablet', 'carousel-slider' ),
	'description'      => esc_html__( 'The number of items you want to see on the Small Tablet Layout(Screens size from 600 pixels DP to 767 pixels DP)', 'carousel-slider' ),
	'default'          => 2,
	'input_attributes' => array( 'min' => 1, 'max' => 10 ),
) );
echo Form::field( array(
	'type'             => 'slider',
	'id'               => '_items_portrait_mobile',
	'label'            => esc_html__( 'Columns : Mobile', 'carousel-slider' ),
	'description'      => esc_html__( 'The number of items you want to see on the Mobile Layout (Screens size from 320 pixels DP to 599 pixels DP)', 'carousel-slider' ),
	'default'          => 1,
	'input_attributes' => array( 'min' => 1, 'max' => 10 ),
) );
