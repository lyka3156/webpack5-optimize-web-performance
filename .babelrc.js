// https://webpack.docschina.org/loaders/babel-loader/
module.exports = {
	// 配置balbe预设
	presets: [
		[
			'@babel/preset-env',
			{
				// 刚才也提到了必须使用es6，由于我们项目使用了babel，而babel会默认将所有es6 import转化成cjs，所以我们要关掉这个默认功能
				// webpack开启tree-shaking
				// modules: false,
				// useBuiltIns: false 默认值，无视浏览器兼容配置，引入所有 polyfill
				// useBuiltIns: entry 根据配置的浏览器兼容，引入浏览器不兼容的 polyfill
				// useBuiltIns: usage 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加
				useBuiltIns: 'entry',
				corejs: '3.9.1', // 是 core-js 版本号
				targets: {
					chrome: '58',
					ie: '11',
				},
			},
		],
	],
	plugins: [
		['@babel/plugin-proposal-decorators', { legacy: true }],
		['@babel/plugin-proposal-class-properties', { loose: true }],
	],
};
