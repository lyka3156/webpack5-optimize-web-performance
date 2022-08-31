const path = require('path');
const resolvePath = (p) => path.resolve(__dirname, p);
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = {
	// 入口文件
	entry: './src/index.js',

	// 区分模式     development/production
	mode: 'development',

	// 打包输出
	output: {
		// 输出文件目录（将来所有资源输出的公共目录，包括css和静态文件等等）
		path: resolvePath('../dist'),
		// 输出文件名，默认main.js
		filename: 'js/[name]_[contenthash:8].js',
		// 所有资源引入公共路径前缀，一般用于生产环境，小心使用
		publicPath: '',
		// 静态文件打包后的路径及文件名（默认是走全局的，如果有独立的设置就按照自己独立的设置来。）
		// assetModuleFilename: 'assets/[name]_[hash][ext]',

		// 非入口文件chunk的名称。所谓非入口即import动态导入形成的chunk或者optimization中的splitChunks提取的公共chunk
		// 它支持和 filename 一致的内置变量
		chunkFilename: 'js/[name]_[contenthash:8].chunk.js',
		// 打包前清空输出目录，相当于clean-webpack-plugin插件的作用,webpack5新增。
		clean: true,
		// 当用 Webpack 去构建一个可以被其他模块导入使用的库时需要用到library   (自己写插件的时候用到)
		// library: {
		// 	// 整个库向外暴露的变量名
		// 	name: '[name]',
		// 	// 库暴露的方式
		// 	type: 'window',
		// },
	},

	// 配置插件
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html', // html模板路劲
			filename: 'index.html', // 打包之后的html名称
		}),
	],
};

module.exports = config;
