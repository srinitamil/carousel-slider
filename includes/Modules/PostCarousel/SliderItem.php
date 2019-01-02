<?php

namespace CarouselSlider\Modules\PostCarousel;

class SliderItem implements \JsonSerializable {

	/**
	 * @var int
	 */
	private $id = 0;

	/**
	 * @var \WP_Post
	 */
	private $post;

	/**
	 * List of post categories
	 *
	 * @var \WP_Term[]
	 */
	private $categories;

	/**
	 * List of post tags
	 *
	 * @var \WP_Term[]
	 */
	private $tags;

	/**
	 * SliderItem constructor.
	 *
	 * @param null|\WP_Post $post
	 */
	public function __construct( $post = null ) {
		$this->post       = get_post( $post );
		$this->id         = $this->post->ID;
		$this->categories = get_the_terms( $this->post, 'category' );
		$this->tags       = get_the_terms( $this->post, 'post_tag' );
	}

	/**
	 * Get current class as array
	 *
	 * @return array
	 */
	public function to_array() {
		return array(
			'id'         => $this->get_id(),
			'link'       => $this->get_permalink(),
			'title'      => $this->get_title(),
			'excerpt'    => $this->get_excerpt(),
			'author'     => array(
				'id'     => $this->get_author_id(),
				'name'   => $this->get_author_display_name(),
				'url'    => $this->get_author_url(),
				'avatar' => $this->get_author_avatar_url(),
			),
			'date'       => array(
				'created'  => mysql_to_rfc3339( $this->post->post_date ),
				'modified' => mysql_to_rfc3339( $this->post->post_modified ),
			),
			'date_gmt'   => array(
				'created'  => mysql_to_rfc3339( $this->post->post_date_gmt ),
				'modified' => mysql_to_rfc3339( $this->post->post_modified_gmt ),
			),
			'categories' => $this->categories_to_array(),
			'tags'       => $this->tags_to_array(),
		);
	}

	/**
	 * Get categories to array
	 *
	 * @return array
	 */
	public function categories_to_array() {
		$categories = array();
		foreach ( $this->get_categories() as $category ) {
			$categories[] = array(
				'id'    => $category->term_id,
				'name'  => $category->name,
				'count' => $category->count,
				'link'  => get_category_link( $category->term_id ),
			);
		}

		return $categories;
	}

	/**
	 * Get tags to array
	 *
	 * @return array
	 */
	public function tags_to_array() {
		$tags = array();
		foreach ( $this->tags as $tag ) {
			$tags[] = array(
				'id'    => $tag->term_id,
				'name'  => $tag->name,
				'count' => $tag->count,
				'link'  => get_category_link( $tag->term_id ),
			);
		}

		return $tags;
	}

	/**
	 * @return \WP_Post
	 */
	public function get_post() {
		return $this->post;
	}

	/**
	 * @return \WP_Term[]
	 */
	public function get_categories() {
		return $this->categories;
	}

	/**
	 * @return \WP_Term[]
	 */
	public function get_tags() {
		return $this->tags;
	}

	/**
	 * Get slider id
	 *
	 * @return int
	 */
	public function get_id() {
		return $this->id;
	}

	/**
	 * Get post title
	 *
	 * @return string
	 */
	public function get_title() {
		return get_the_title( $this->get_post() );
	}

	/**
	 * Get post excerpt
	 *
	 * @param int $length
	 * @param string $more
	 *
	 * @return string
	 */
	public function get_excerpt( $length = 20, $more = ' ...' ) {
		return wp_trim_words( $this->post->post_content, $length, $more );
	}

	/**
	 * Get post permalink
	 *
	 * @return string
	 */
	public function get_permalink() {
		return get_permalink( $this->get_post() );
	}

	/**
	 * Get post author id
	 *
	 * @return int
	 */
	public function get_author_id() {
		return (int) $this->get_post()->post_author;
	}

	/**
	 * Get post author url
	 *
	 * @return string
	 */
	public function get_author_url() {
		return esc_url( get_author_posts_url( $this->get_author_id() ) );
	}

	/**
	 * Get post author display name
	 *
	 * @return string
	 */
	public function get_author_display_name() {
		return esc_html( get_the_author_meta( 'display_name', $this->get_author_id() ) );
	}

	/**
	 * Get author avatar url
	 *
	 * @param int $size
	 *
	 * @return false|string
	 */
	public function get_author_avatar_url( $size = 20 ) {
		return get_avatar_url( $this->get_author_id(), $size );
	}

	/**
	 * Specify data which should be serialized to JSON
	 * @link https://php.net/manual/en/jsonserializable.jsonserialize.php
	 * @return mixed data which can be serialized by <b>json_encode</b>,
	 * which is a value of any type other than a resource.
	 */
	public function jsonSerialize() {
		return $this->to_array();
	}
}
