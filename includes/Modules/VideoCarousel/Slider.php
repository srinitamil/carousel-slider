<?php

namespace CarouselSlider\Modules\VideoCarousel;

use CarouselSlider\Abstracts\AbstractSlider;
use CarouselSlider\Supports\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Slider extends AbstractSlider {

	/**
	 * Represent current class as array
	 *
	 * @return array
	 */
	public function to_array() {
		$data           = parent::to_array();
		$data['videos'] = $this->get_videos();

		return $data;
	}

	/**
	 * Read slider data
	 */
	protected function read_slider_data() {
		parent::read_slider_data();
		$this->data['video_urls'] = $this->get_meta( '_video_url' );
	}

	/**
	 * Get properties to meta keys
	 *
	 * @return array
	 */
	protected static function props_to_meta_key() {
		$keys = parent::props_to_meta_key();

		$keys['video_urls'] = '_video_url';

		return $keys;
	}

	/**
	 * Get video urls
	 *
	 * @return array
	 */
	public function get_video_urls() {
		$_urls = $this->get_prop( 'video_urls' );

		if ( is_string( $_urls ) ) {
			$_urls = explode( ',', $_urls );
		}

		return $_urls;
	}

	/**
	 *
	 * @return array
	 */
	public function get_videos() {
		$video_urls = $this->get_video_urls();
		$_url       = array();
		foreach ( $video_urls as $video_url ) {
			if ( ! Utils::is_url( $video_url ) ) {
				continue;
			}
			$provider  = '';
			$video_id  = '';
			$thumbnail = '';
			if ( false !== strpos( $video_url, 'youtube.com' ) ) {
				$provider  = 'youtube';
				$video_id  = $this->get_youtube_id_from_url( $video_url );
				$thumbnail = array(
					'large'  => 'https://img.youtube.com/vi/' . $video_id . '/hqdefault.jpg',
					'medium' => 'https://img.youtube.com/vi/' . $video_id . '/mqdefault.jpg',
					'small'  => 'https://img.youtube.com/vi/' . $video_id . '/sddefault.jpg',
				);

			} elseif ( false !== strpos( $video_url, 'vimeo.com' ) ) {
				$provider  = 'vimeo';
				$video_id  = $this->get_vimeo_id_from_url( $video_url );
				$response  = wp_remote_get( "https://vimeo.com/api/v2/video/$video_id.json" );
				$thumbnail = json_decode( wp_remote_retrieve_body( $response ), true );
				$thumbnail = array(
					'large'  => isset( $thumbnail[0]['thumbnail_large'] ) ? $thumbnail[0]['thumbnail_large'] : null,
					'medium' => isset( $thumbnail[0]['thumbnail_medium'] ) ? $thumbnail[0]['thumbnail_medium'] : null,
					'small'  => isset( $thumbnail[0]['thumbnail_small'] ) ? $thumbnail[0]['thumbnail_small'] : null,
				);
			}

			$_url[] = array(
				'provider'  => $provider,
				'url'       => $video_url,
				'video_id'  => $video_id,
				'thumbnail' => $thumbnail,
			);
		}

		return $_url;
	}

	/**
	 * Get Youtube video ID from URL
	 *
	 * @param string $url
	 *
	 * @return mixed Youtube video ID or FALSE if not found
	 */
	private function get_youtube_id_from_url( $url ) {
		$parts = parse_url( $url );
		if ( isset( $parts['query'] ) ) {
			parse_str( $parts['query'], $qs );
			if ( isset( $qs['v'] ) ) {
				return $qs['v'];
			} elseif ( isset( $qs['vi'] ) ) {
				return $qs['vi'];
			}
		}
		if ( isset( $parts['path'] ) ) {
			$path = explode( '/', trim( $parts['path'], '/' ) );

			return $path[ count( $path ) - 1 ];
		}

		return false;
	}

	/**
	 * Get Vimeo video ID from URL
	 *
	 * @param string $url
	 *
	 * @return mixed Vimeo video ID or FALSE if not found
	 */
	private function get_vimeo_id_from_url( $url ) {
		$parts = parse_url( $url );
		if ( isset( $parts['path'] ) ) {
			$path = explode( '/', trim( $parts['path'], '/' ) );

			return $path[ count( $path ) - 1 ];
		}

		return false;
	}
}
