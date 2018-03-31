const path = require('path');

const InertEntryPlugin = require('inert-entry-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const rollupCommonjsPlugin = require('rollup-plugin-commonjs');

module.exports = {
	entry: 'extricate-loader!interpolate-loader!./src/manifest.json',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'manifest.json',
	},
	module: {
		rules: [{
			test: /\.entry\.js$/,
			use: [
				{ loader: 'file-loader', options: { name: '[name].js' } },
				{
					loader: 'webpack-rollup-loader',
					options: {
						plugins: [
							rollupCommonjsPlugin({ extensions: ['.png'] }),
						],
					},
				},
			],
		}, {
			test: /\.(png)$/,
			use: [
				{ loader: 'file-loader', options: { name: '[name].[ext]' } },
			],
		}],
	},
	optimization: {
		minimize: false,
	},
	plugins: [
		new InertEntryPlugin(),
		new ZipPlugin({ filename: 'TLD.zip' }),
	],
};
