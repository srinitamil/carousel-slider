<template>
	<div :class="outer_classes">
		<div :id='slider_id' :class='slider_classes' data-carousel_slider="true" :data-slide-type='options.type'>
			<div class="carousel-slider-post" v-for="post in options.posts">
				<a class="carousel-slider-post__thumbnail" v-if="post.thumbnail" :href="post.link">
					<img :src="post.thumbnail.src" alt="">
				</a>
				<header class="carousel-slider-post__header">
					<div class="carousel-slider-post__cat-links">
						<template v-for="(category, cat_index) in post.categories">
							<template v-if="cat_index > 0">,</template>
							<a :href="category.link">{{category.name}}</a>
						</template>
					</div>
					<h2 class="carousel-slider-post__title">
						<a :href="post.link" rel="bookmark">{{post.title}}</a>
					</h2>
				</header>
				<div class="carousel-slider-post__summary" v-html="post.excerpt"></div>
				<div class="carousel-slider-post__tags-links">
					<template v-for="(tag, tag_index) in post.tags">
						<template v-if="tag_index > 0">,</template>
						<a :href="tag.link">{{tag.name}}</a>
					</template>
				</div>
				<footer class="carousel-slider-post__footer">
					<span class="carousel-slider-post__byline">
						<span class="carousel-slider-post__vcard"><img :src="post.author.avatar"/></span>
						<span class="carousel-slider-post__author">
							by <a class="url fn n" :href="post.author.url">{{post.author.name}}</a></span>
					</span>
					<span class="carousel-slider-post__posted-on">
						<a :href="post.link" rel="bookmark">{{post.date.updated}}</a>
					</span>
				</footer>
			</div>
		</div>
	</div>
</template>

<script>
	import {carousel} from './carousel.js';

	export default {
		name: "PostCarousel",
		mixins: [carousel],
		props: {
			options: {type: Object, required: true}
		},
		watch: {
			options(newValue, oldValue) {
				this.rebuildCarousel();
			}
		},
		mounted() {
			this.initCarousel();
		}
	}
</script>

<style scoped>

</style>
