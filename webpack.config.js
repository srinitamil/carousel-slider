const webpack = require('webpack');
const path = require('path');
const config = require('./package.json');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const autoprefixer = require('autoprefixer');

function isProduction() {
	return process.env.NODE_ENV === 'production';
}

let devtool = '#source-map'; //'#eval-source-map';
let appName = '[name].js';
let entryPoints = {
	'admin-vue': './assets/src/admin/main.js',
	vendor: Object.keys(config.dependencies),
	// vueStyle: './assets/scss/style.scss',
};

let exportPath = path.resolve(__dirname, './assets/js');

let plugins = [];

// extract css into its own file
let extractCss = new ExtractTextPlugin({
	filename: "../css/[name].css",
});
plugins.push(extractCss);
plugins.push(autoprefixer);

// Extract all 3rd party modules into a separate 'vendor' chunk
plugins.push(new webpack.optimize.CommonsChunkPlugin({
	name: 'vendor',
	filename: isProduction() ? 'vendor.min.js' : 'vendor.js',
}));

// Compress extracted CSS. We are using this plugin so that possible
// duplicated CSS from different components can be deduped.
plugins.push(new OptimizeCssAssetsPlugin({
	cssProcessorOptions: {
		safe: true,
		map: {
			inline: false
		}
	}
}));

if (isProduction()) {

	plugins.push(new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: '"production"'
		}
	}));

	plugins.push(new webpack.optimize.UglifyJsPlugin({
		sourceMap: true,
		compress: {
			warnings: false
		}
	}));

	plugins.push(new webpack.LoaderOptionsPlugin({
		minimize: true
	}));

	appName = '[name].min.js';
	devtool = '#source-map';
}

module.exports = {
	entry: entryPoints,
	output: {
		path: exportPath,
		filename: appName
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: [path.resolve(__dirname, 'node_modules')],
			},
			{
				test: /\.(scss|sass)$/,
				loader: extractCss.extract({
					use: [
						{loader: 'css-loader',},
						{loader: 'sass-loader',}
					]
				}),
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					extractCSS: true
				}
			},
			{
				test: /\.css$/,
				use: [
					{loader: 'vue-style-loader'},
					{loader: 'css-loader'},
					{
						loader: 'postcss-loader',
						options: {
							plugins: () => [autoprefixer()]
						}
					},
				],
			},
		]
	},
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.esm.js'
		},
		extensions: ['*', '.js', '.vue', '.json']
	},
	plugins: plugins,
	performance: {
		hints: false
	},
	watch: true,
	watchOptions: {
		ignored: /node_modules/
	},
	devtool: devtool
};
