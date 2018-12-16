<template>
	<div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect" :class="tabsClasses">
		<div class="mdl-tabs__tab-bar">
			<a v-for="tab in tabs" class="mdl-tabs__tab" :class="{'is-active': tab.isActive}"
			   :href="tab.href">{{tab.name}}</a>
		</div>

		<slot></slot>
	</div>
</template>

<script>
	import {MaterialTabs} from './MaterialTabs.js';
	import {MaterialRipple} from '../ripple/MaterialRipple.js';

	export default {
		name: "mdlTabs",
		props: {
			vertical: {type: Boolean, default: false}
		},
		data() {
			return {
				tabs: [],
			}
		},
		computed: {
			tabsClasses() {
				return {
					'mdl-tabs--vertical': this.vertical
				}
			}
		},
		methods: {
			changeSelectedTab(selectedTab) {
				this.tabs.forEach(tab => {
					tab.isActive = (tab.name === selectedTab.name);
				});
			}
		},
		created() {
			this.tabs = this.$children;
		},
		updated() {
			new MaterialTabs(this.$el);
			let links = this.$el.querySelectorAll('.mdl-js-ripple-effect');
			links.forEach(function (link) {
				new MaterialRipple(link);
			})
		}
	}
</script>

<style lang="scss">
	@import "tabs";
	@import "vertical-tabs";
</style>
