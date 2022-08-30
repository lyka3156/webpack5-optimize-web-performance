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

该插件使用 [terser](https://github.com/terser/terser) 来压缩 JavaScript

webpack v5 开箱即带有最新版本的 [`terser-webpack-plugin`](https://webpack.docschina.org/plugins/terser-webpack-plugin/#root)。
如果你使用的是 webpack v5 或更高版本，同时希望自定义配置，那么仍需要安装 `terser-webpack-plugin`。
如果使用 webpack v4，则必须安装 `terser-webpack-plugin` v4 的版本

1. 安装插件

```js
yarn add -D terser-webpack-plugin
```

2. 配置压缩 js 插件

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	// 优化
	optimization: {
		minimizer: [
			// 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
			// `...`,
			// https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
			new TerserPlugin({
				terserOptions: {
					// parallel: true, // 启用/禁用多进程并发运行功能
					// cache: true,
					compress: {
						warnings: true, // 是否去除warnig
						drop_console: isProd, // 是否去除console
						drop_debugger: isProd, // 移除自动断点功能
						// pure_funcs: ['console.log', 'console.error'], //配置移除指定的指令，如console.log,alert等
					},
					// 删除注释 如果要在构建时去除注释，请使用以下配置
					format: {
						comments: false,
					},
				},
				// 是否将注释剥离到单独的文件中
				extractComments: false,
			}),
		],
		// 告知 webpack 使用 TerserPlugin 或其它在 optimization.minimizer定义的插件压缩 bundle
		minimize: true,
	},
};
```

## 4. 清除无用的 CSS

[purgecss-webpack-plugin](https://www.npmjs.com/package/purgecss-webpack-plugin) 会单独提取 CSS 并清除用不到的 CSS

注意：

-   必须配合[mini-css-extract-plugin](https://webpack.docschina.org/plugins/mini-css-extract-plugin#root)插件一起使用
-   需要剔除无用 css 的目录，使用此插件，如果是一些公共的 css 文件，不需要剔除的 css 不需要配置剔除
    -   像 body, > div 这种样式，你在模块中没有实际引用到的样式，也会剔除掉

1. 安装插件

```js
yarn add -D purgecss-webpack-plugin
```

2. 修改 webpack 配置

```js
// 去除无用的css
const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssWebpackPlugin = require('purgecss-webpack-plugin');

// 需要剔除无用css的目录
const PATHS = {
	src: path.join(__dirname, 'src'),
};

module.exports = {
	rules: [
		{
			test: /\.css$/,
			use: [MiniCssExtractPlugin.loader, 'css-loader'],
		},
	],
	plugins: [
		// 该插件将CSS提取到单独的文件中。它会为每个chunk创造一个css文件。需配合loader一起使用
		new MiniCssExtractPlugin({
			filename: 'css/[name]_[contenthash:8].css',
			// chunkFilename: 'css/[name]_[contenthash:8].css',
		}),
		// 清除用不到的 CSS
		new PurgecssWebpackPlugin({
			paths: glob.sync(
				`${PATHS.src}/**/*`,
				// 不匹配目录，只匹配文件
				{ nodir: true }
			),
		}),
	],
};
```

## 5. Tree Shaking [文档地址](https://webpack.docschina.org/guides/tree-shaking/#root)

-   一个模块可以有多个方法，只要其中某个方法使用到了，则整个文件都会被打到 bundle 里面去，tree shaking 就是只把用到的方法打入 bundle,没用到的方法会 uglify 阶段擦除掉
-   原理是利用 es6 模块的特点,只能作为模块顶层语句出现,import 的模块名只能是字符串常量
-   新的 webpack 4 正式版本扩展了此检测能力，通过 package.json 的 "sideEffects" 属性作为标记

### 5.1 开发环境下的配置

-   开发环境配置只是标记了哪些需要删除的“未引用代码(dead code)”

```js
// webpack.config.js
module.exports = {
	// ...
	mode: 'development',
	optimization: {
		//  usedExports为true可以标记哪些代码使用了，哪些代码未被使用，压缩的时候标记为未被使用的就会被删除
		usedExports: true,
	},
};
```

### 5.2 生产环境下的配置

-   通过 import 和 export 语法，我们已经找出需要删除的“未引用代码(dead code)”，然而，不仅仅是要找出，还要在 bundle 中删除它们。为此，我们需要将 mode 配置选项设置为 production。

-   在生产环境下，Webpack 默认会添加 `Tree Shaking` 的配置，因此只需写一行 `mode: 'production'` 即可。

```js
// webpack.config.js
module.exports = {
	// ...
	mode: 'production',
};
```

### 5.3 将文件标记为 side-effect-free(无副作用)

在一个纯粹的 ESM 模块世界中，很容易识别出哪些文件有副作用。然而，我们的项目无法达到这种纯度，所以，此时有必要提示 webpack compiler 哪些代码是“纯粹部分”。

通过 `package.json` 的 `"sideEffects"` 属性，来实现这种方式。

sideEffects 的几种配置方式如下:

-   sideEffects 默认为 true， 告诉 Webpack ，所有文件都有副作用，他们不能被 Tree Shaking。
-   sideEffects 为 false 时，告诉 Webpack ，没有文件是有副作用的，他们都可以 Tree Shaking。
-   sideEffects 为一个数组时，告诉 Webpack ，数组中那些文件不要进行 Tree Shaking，其他的可以 Tree Shaking。

```js
// package.json
{
  "sideEffects": false,
  // ...
}
```

如果所有代码都不包含副作用，我们就可以简单地将该属性标记为 false，来告知 webpack 它可以安全地删除未用到的 export。

> Tip
> 注意，所有导入文件都会受到 tree shaking 的影响。这意味着，如果在项目中使用类似 css-loader 并 import 一个 CSS 文件，则需要将其添加到 side effect 列表中，以免在生产模式中无意中将它删除：

```js
{
  "name": "your-project",
  "sideEffects": ["./src/some-side-effectful-file.js", "*.css",]
}
```

## 6. Scope Hoisting

-   Scope Hoisting 即作用域提升，原理是将所有的模块按照引用顺序放在一个函数作用域里，并重命名防止命名冲突，`通过这种方式可以减少函数声明和内存开销`
-   Scope Hoisting 可以让 Webpack 打包出来的代码文件更小、运行的更快
-   这个功能在 mode 为 production 下默认开启,开发环境要用 [webpack.optimize.ModuleConcatenationPlugin](https://webpack.docschina.org/plugins/module-concatenation-plugin/#root) 插件
-   只支持 es6 代码

hello.js

```js
export default 'Hello';
```

index.js

```js
import str from './hello.js';
console.log(str);
```

最终打包输出的`main.js`

```js
console.log('hello');
```
