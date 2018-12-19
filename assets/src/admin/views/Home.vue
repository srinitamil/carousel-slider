<template>
	<div class="carousel-slider-list-page">
		<h1 class="wp-heading-inline">Sliders</h1>

		<list-table
				:columns="columns"
				:rows="rows"
				:actions="actions"
				:bulk-actions="bulkActions"
				action-column="title"
				@action:click="onActionClick"
				@bulk:click="onBulkAction"
		>
			<template slot="sliderType" slot-scope="data">
				<span>{{sliderTypes[data.row.type]}}</span>
			</template>
			<template slot="shortcode" slot-scope="data">
				<copy-to-clipboard :value="shortcode(data.row)"></copy-to-clipboard>
			</template>
		</list-table>

		<mdl-fab @click="openModal">+</mdl-fab>
		<mdl-modal :active="modalActive" @close="closeModal" title="Add New Slider">
			<p v-for="(label, slug) in sliderTypes">
				<mdl-radio v-model="sliderType" :value="slug">{{label}}</mdl-radio>
			</p>
		</mdl-modal>
	</div>
</template>

<script>
	import ListTable from '../components/ListTable.vue';
	import CopyToClipboard from '../components/CopyToClipboard.vue';
	import mdlFab from '../../material-design-lite/button/mdlFab.vue';
	import mdlModal from '../../material-design-lite/modal/mdlModal.vue';
	import mdlRadio from '../../material-design-lite/radio/mdlRadio.vue';

	export default {
		name: "Home",
		components: {ListTable, mdlFab, mdlModal, mdlRadio, CopyToClipboard},
		data() {
			return {
				modalActive: false,
				sliderTypes: {},
				sliderType: 'image-carousel',
				postStatus: 'publish',
				rows: [],
				columns: {},
				actions: [],
				bulkActions: [],
			}
		},
		mounted() {
			let settings = window.carouselSliderSettings;
			this.sliderTypes = settings.sliderTypes;
			this.columns = settings.columns;
			this.actions = settings.actions.publish;
			this.bulkActions = settings.bulkActions.publish;
			this.getItems();
		},
		methods: {
			shortcode(item) {
				return `[carousel_slide id='${item.id}']`
			},
			openModal() {
				this.modalActive = true;
			},
			closeModal() {
				this.modalActive = false;
			},
			getItems() {
				let $ = window.jQuery, self = this;
				$.ajax({
					url: carouselSliderSettings.root + '/sliders',
					method: 'GET',
					data: {
						per_page: 20,
					},
					success: function (response) {
						if (response.data) {
							self.rows = response.data;
						}
					}
				})
			},
			onActionClick(action, row) {
				if ('edit' === action) {
				} else if ('trash' === action) {
					if (confirm('Are you sure to delete permanently?')) {
					}
				}
			},
			onBulkAction(action, items) {
				if ('delete' === action) {
					if (confirm('Are you sure to delete all selected items permanently?')) {

					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.carousel-slider-list-page {
		.mdl-button--fab {
			position: fixed;
			bottom: 20px;
			right: 20px;
			z-index: 100;
		}
	}
</style>
