import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './views/Home.vue';
import Settings from './views/Settings.vue';
import Documentation from './views/Documentation.vue';
import Slider from './views/Slider.vue';

Vue.use(VueRouter);

const routes = [
	{path: '/', name: 'Home', component: Home},
	{path: '/settings', name: 'Settings', component: Settings},
	{path: '/help', name: 'Documentation', component: Documentation},
	{path: '/:id', name: 'Slider', component: Slider},
];

export default new VueRouter({
	routes // short for `routes: routes`
});
