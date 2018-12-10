<?php

use CarouselSlider\Supports\Form;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
?>
<div data-id="open" id="section_images_settings" class="shapla-toggle shapla-toggle--stroke"
     style="display: <?php echo $slide_type != 'image-carousel' ? 'none' : 'block'; ?>">
	<span class="shapla-toggle-title">
		<?php esc_html_e( 'Media Images', 'carousel-slider' ); ?>
	</span>
    <div class="shapla-toggle-inner">
        <div class="shapla-toggle-content">
			<?php
			echo Form::field( array(
				'type'        => 'image_gallery',
				'id'          => '_wpdh_image_ids',
				'label'       => esc_html__( 'Carousel Images', 'carousel-slider' ),
				'description' => esc_html__( 'Choose carousel images from media library.', 'carousel-slider' ),
			) );
			?>
        </div>
    </div>
</div>