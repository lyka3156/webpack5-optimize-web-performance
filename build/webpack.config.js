const path = require('path');
const resolvePath = (p) => path.resolve(__dirname, p);
const config = {
	// 入口文件
	entry: {
		page1: './src/page1.js',
		page2: './src/page2.js',
		page3: './src/page3.js',
	},

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
		chunkFilename: '[name]_[contenthash:8].chunk.js',
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

	// 优化
	optimization: {
		splitChunks: {
			chunks: 'all', //默认作用于异步chunk，值为all/initial/async
			minSize: 0, //默认值是30kb,代码块的最小尺寸
			minChunks: 1, //被多少模块共享,在分割之前模块的被引用次数
			maxAsyncRequests: 2, //限制异步模块内部的并行最大请求数的，说白了你可以理解为是每个import()它里面的最大并行请求数量
			maxInitialRequests: 4, //限制入口的拆分数量
			automaticNameDelimiter: '~', //默认webpack将会使用入口名和代码块的名称生成命名,比如 'vendors~main.js'
			cacheGroups: {
				//设置缓存组用来抽取满足不同规则的chunk,下面以生成common为例
				vendors: {
					name: 'chunk-vendors',
					chunks: 'all',
					test: /node_modules/, //条件
					priority: -10, ///优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中,为了能够让自定义缓存组有更高的优先级(默认0),默认缓存组的priority属性为负值.
				},
				commons: {
					name: 'chunk-common',
					chunks: 'all',
					minSize: 0, //最小提取字节数
					minChunks: 2, //最少被几个chunk引用
					priority: -20,
				},
			},
		},
	},
};

module.exports = config;
