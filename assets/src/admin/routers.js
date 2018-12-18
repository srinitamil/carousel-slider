import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './views/Home.vue';
import Settings from './views/Settings.vue';
import Documentation from './views/Documentation.vue';

Vue.use(VueRouter);

const routes = [
	{path: '/', name: 'Home', component: Home},
	{path: '/settings', name: 'Settings', component: Settings},
	{path: '/help', name: 'Documentation', component: Documentation},
];

export default new VueRouter({
	routes // short for `routes: routes`
});
