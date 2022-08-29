# 优化前端性能

如何优化前端性能,首先你要知道哪些文件构建比较大,对构建结果分析，这个就要借助`webpack-bundle-analyzer`插件来实现了

## 1. 构建结果分析

是一个 webpack 的插件，需要配合 webpack 和 webpack-cli 一起使用。这个插件的功能是生成代码分析报告，帮助提升代码质量和网站性能

1. 安装 [`webpack-bundle-analyzer`](https://www.npmjs.com/package/webpack-bundle-analyzer)，

```js
yarn add -D webpack-bundle-analyzer
```

2. 修改配置

```js
// 费时分析
const { BundleAnalyzerPlugin } = require('swebpack-bundle-analyzer');

module.exports = {
	plugins: [
		new BundleAnalyzerPlugin(), // 使用默认配置
		// 默认配置的具体配置项
		// new BundleAnalyzerPlugin({
		//   analyzerMode: 'server',
		//   analyzerHost: '127.0.0.1',
		//   analyzerPort: '8888',
		//   reportFilename: 'report.html',
		//   defaultSizes: 'parsed',
		//   openAnalyzer: true,
		//   generateStatsFile: false,
		//   statsFilename: 'stats.json',
		//   statsOptions: null,
		//   excludeAssets: null,
		//   logLevel: info
		// })
	],
};
```

3. 执行打包生成文件再分析

打包结束后，会自行启动地址为 http://127.0.0.1:8888 的 web 服务，我们可以看到打包后的模块大小

![构建结果分析](https://cdn.nlark.com/yuque/0/2022/png/566044/1661148909064-3d1a834c-d8f9-4cbf-97a8-a2ab6364fdb0.png?x-oss-process=image%2Fresize%2Cw_750%2Climit_0)

4. 如果，我们只想保留数据不想启动 web 服务，这个时候，我们可以加上两个配置

```js
...
// 费时分析
const { BundleAnalyzerPlugin }  = require("swebpack-bundle-analyzer") ;

module.exports={
  plugins: [
     // 配置插件
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',  // 不启动展示打包报告的http服务器
      generateStatsFile: true, // 是否生成stats.json文件
    })
  ]
}
```

这样再次执行打包的时候就只会在打包目录下面生成 stats.json 的打包结果分析文件了

## 2. 压缩 css

这个插件使用 cssnano 优化和压缩 CSS。

就像 [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin) 一样，但在 `source maps` 和 `assets` 中使用查询字符串会更加准确，`支持缓存和并发模式下运行`

1. 安装 [css-minimizer-webpack-plugin](https://webpack.docschina.org/plugins/css-minimizer-webpack-plugin/#root)

```js
yarn add -D css-minimizer-webpack-plugin
```

2. 配置压缩 css 插件

```js
// 压缩css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
module.exports = {
	optimization: {
		minimizer: [
			// 添加 css 压缩配置
			new CssMinimizerPlugin({
				// test: /\.foo\.css$/i, // 用来匹配文件
				// include: /\/includes/, // 包含的文件
				// exclude: /\/excludes/, // 排除的文件
				// parallel: true, // 进程并发执行，提升构建速度。 运行时默认的并发数：os.cpus().length - 1
				// // 移除所有注释（包括以 /*! 开头的注释）
				// preset: [
				// 	'default',
				// 	{
				// 		discardComments: { removeAll: true },
				// 	},
				// ],
			}),
		],
		minimize: true,
	},
};
```

## 3. 压缩 js

1. 安装 css-minimizer-webpack-plugin

## 4. 清除无用的 CSS

## 5. Tree Shaking

## 6. Scope Hoisting
