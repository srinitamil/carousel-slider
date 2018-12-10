<?php

use CarouselSlider\Supports\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

$slide_types = Utils::get_slide_types( false );
?>
<div class="sp-input-group" style="margin: 10px 0 30px;">
    <div class="sp-input-label">
        <label for="_carousel_slider_slide_type">
			<?php esc_html_e( 'Slide Type', 'carousel-slider' ); ?>
        </label>
    </div>
    <div class="sp-input-field">
        <select name="carousel_slider[_slide_type]" id="_carousel_slider_slide_type" class="sp-input-text">
			<?php
			foreach ( $slide_types as $slug => $label ) {
				$selected = ( $slug == $slide_type ) ? 'selected' : '';

				if ( 'product-carousel' == $slug ) {
					$disabled = Utils::is_woocommerce_active() ? '' : 'disabled';
					echo '<option value="' . $slug . '" ' . $selected . ' ' . $disabled . '>' . $label . '</option>';
					continue;
				}

				echo '<option value="' . $slug . '" ' . $selected . '>' . $label . '</option>';
			}
			?>
        </select>
    </div>
</div>