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

## 7. 代码分割

-   对于大的 Web 应用来讲，将所有的代码都放在一个文件中显然是不够有效的，特别是当你的某些代码块是在某些特殊的时候才会被用到。
-   webpack 有一个功能就是将你的代码库分割成 chunks 语块，当代码运行到需要它们的时候再进行加载

### 1. 入口点分割

-   配置多个打包入口，多页打包
-   Entry Points：入口文件设置的时候可以配置
-   这种方法的问题
    -   如果入口 chunks 之间包含重复的模块(lodash)，那些重复模块都会被引入到各个 bundle 中
    -   不够灵活，并且不能将核心应用程序逻辑进行动态拆分代码

```js
entry: {
    index: "./src/index.js",
    login: "./src/login.js"
}
```

### 2. splitChunks 分包配置, 提取公共代码 [文档地址](https://webpack.docschina.org/plugins/split-chunks-plugin#optimizationsplitchunks)

-   从 webpack v4 开始，移除了 CommonsChunkPlugin，取而代之的是 optimization.splitChunks
-   默认情况下，它只会影响到按需加载的 chunks，因为修改 initial chunks 会影响到项目的 HTML 文件中的脚本标签。

#### 1. 为什么需要提取公共代码

-   网站有多个页面,每个页面包含很多公共代码,导致相同的资源被重复的加载，浪费用户的流量和服务器的成本；
-   每个页面需要加载的资源太大，导致网页首屏加载缓慢，影响用户体验。
-   如果能把公共代码抽离成单独文件进行加载能进行优化，可以优化网页首屏加载速度,减少网络传输流量，降低服务器成本,

#### 2. 如何提取公共代码

-   基础类库，方便长期缓存
-   页面之间的公用代码
-   各个页面单独生成文件

#### 3. 使用 splitChunks 提取公共代码

##### 1. module chunk bundle

-   module：就是 js 的模块化 webpack 支持 commonJS、ES6 等模块化规范，简单来说就是你通过 import 语句引入的代码
-   chunk: chunk 是 webpack 根据功能拆分出来的，包含三种情况
    -   你的项目入口（entry）
    -   通过 import()动态引入的代码
    -   通过 splitChunks 拆分出来的代码
-   bundle：bundle 是 webpack 打包之后的各个文件，一般就是和 chunk 是一对一的关系，bundle 就是对 chunk 进行编译压缩打包等处理之后的产出

##### 2. splitChunks 默认配置

webpack 默认 将根据以下条件自动拆分 chunks

-   新的 chunk 可以被共享，或者模块来自于 node_modules 文件夹
-   新的 chunk 体积大于 20kb（在进行 min+gz 之前的体积）
-   当按需加载 chunks 时，并行请求的最大数量小于或等于 30
-   当加载初始化页面时，并发请求的最大数量小于或等于 30

当尝试满足最后两个条件时，最好使用较大的 chunks

`webpack配置`

```js
module.exports = {
	//...
	optimization: {
		splitChunks: {
			chunks: 'async', // 有效值为 `all`，`async` 和 `initial`
			minSize: 20000, // 生成 chunk 的最小体积（≈ 20kb)
			minRemainingSize: 0, // 确保拆分后剩余的最小 chunk 体积超过限制来避免大小为零的模块
			minChunks: 1, // 拆分前必须共享模块的最小 chunks 数。
			maxAsyncRequests: 30, // 最大的按需(异步)加载次数
			maxInitialRequests: 30, // 打包后的入口文件加载时，还能同时加载js文件的数量（包括入口文件）
			enforceSizeThreshold: 50000,
			cacheGroups: {
				// 配置提取模块的方案
				defaultVendors: {
					test: /[\/]node_modules[\/]/,
					priority: -10,
					reuseExistingChunk: true,
				},
				default: {
					minChunks: 2,
					priority: -20,
					reuseExistingChunk: true,
				},
			},
		},
	},
};
```

##### 3. splitChunks 项目中的配置

```js
const config = {
	//...
	optimization: {
		splitChunks: {
			cacheGroups: {
				// 配置提取模块的方案
				default: false,
				styles: {
					name: 'styles',
					test: /\.(s?css|less|sass)$/,
					chunks: 'all',
					enforce: true,
					priority: 10,
				},
				common: {
					name: 'chunk-common',
					chunks: 'all',
					minChunks: 2,
					maxInitialRequests: 5,
					minSize: 0,
					priority: 1,
					enforce: true,
					reuseExistingChunk: true,
				},
				vendors: {
					name: 'chunk-vendors',
					test: /[\\/]node_modules[\\/]/,
					chunks: 'all',
					priority: 2,
					enforce: true,
					reuseExistingChunk: true,
				},
				// ... 根据不同项目再细化拆分内容
			},
		},
	},
};
```

### 3. 代码懒加载(按需加载)

针对首屏加载不太需要的一些资源，我们可以通过懒加载的方式去实现

#### 1. webpack 的懒加载

`hello.js`

```js
module.exports = 'hello';
```

`index.js`

```js
document.querySelector('#clickBtn').addEventListener('click', () => {
	import('./hello').then((result) => {
		console.log(result.default);
	});
});
```

`index.html`

```js
<button id="clickBtn">懒加载资源</button>
```

`点击前加载的资源如下`
![点击前](https://cdn.nlark.com/yuque/0/2022/png/566044/1661909892578-a7abde64-7541-47d9-a75c-6696ccedbfb9.png)

`点击后加载的资源如下`
![点击前](https://cdn.nlark.com/yuque/0/2022/png/566044/1661909905065-990ed74e-3877-48f2-80c8-fe2ef83c35d6.png)

#### 2. react 的懒加载

`index.js` 入口文件配置

```js
// src/index.js
import React, { Component, Suspense } from 'react';
import ReactDOM from 'react-dom';
import Loading from './components/Loading';
// lazy的简单实现原理
/* function lazy(loadFunction) {
  return class LazyComponent extends React.Component {
    state = { Comp: null };
    componentDidMount() {
      loadFunction().then((result) => {
        this.setState({ Comp: result.default });
      });
    }
    render() {
      let Comp = this.state.Comp;
      return Comp ? <Comp {...this.props} /> : null;
    }
  };
} */
// 需要懒加载组件
const AppTitle = React.lazy(() =>
	import(/* webpackChunkName: "title" */ './components/Title')
);

class App extends Component {
	state = {
		visible: false,
	};
	show = () => {
		this.setState({ visible: true });
	};
	render() {
		return (
			<>
				{/* 懒加载组件显示的地方 */}
				{this.state.visible && (
					<Suspense fallback={<Loading />}>
						<AppTitle />
					</Suspense>
				)}
				<button onClick={this.show}>加载</button>
			</>
		);
	}
}
ReactDOM.render(<App />, document.querySelector('#root'));
```

`Loading.js`

-   懒加载资源未加载完成的过渡页面

```js
// src\components\Loading.js
import React from 'react';
export default (props) => {
	return <p>Loading</p>;
};
```

`Title.js`

-   需要懒加载的组件

```js
// src\components\Title.js
import React from 'react';
export default (props) => {
	return <p>Title</p>;
};
```

### 4. prefetch 和 preload

上面我们使用异步加载的方式引入资源,假如我们需要异步加载的文件比较大,在点击的时候去加载也会影响用户的体验,这个时候可以考虑使用 prefetch 来进行预拉取

#### 1. prefetch

1.  概念:

-   (预拉取)：浏览器空闲的时候进行资源的拉取

2. 作用或者场景:

-   它的作用是告诉浏览器未来可能会使用到的某个资源，浏览器就会在闲时去加载对应的资源，若能预测到用户的行为，比如懒加载，点击到其它页面等则相当于提前预加载了需要的资源

3. 用法:

-   在资源上添加预先加载的注释，你指明该模块需要立即被使用

`html` 中使用

```js
<link rel="prefetch" href="js/utils.js" as="script">
```

`react` 中

```js
button.addEventListener('click', () => {
	import(
		`./utils.js`
		/* webpackPrefetch: true */
		/* webpackChunkName: "utils" */
	).then((result) => {
		result.default.log('hello');
	});
});
```

`改造一下上面懒加载获取的代码`

-   这样的话,浏览器会在空闲时间加载 hello 文件,不用我们自己去点击的时候再加载文件了

```js
document.querySelector('#clickBtn').addEventListener('click', () => {
	import(/* webpackPrefetch: true */ './hello').then((result) => {
		console.log(result.default);
	});
});
```

#### 2. preload

1. 概念:

-   preload (预加载)：提前加载后面会用到的关键资源
-   因为会提前拉取资源，如果不是特殊需要，谨慎使用

2. 场景:

-   preload 通常用于本页面要用到的关键资源，包括`关键 js、字体、css `文件
-   preload 将会把资源得下载顺序权重提高，使得关键数据提前下载好,优化页面打开速度

3. 用法:

-   在资源上添加预先加载的注释，你指明该模块需要立即被使用

`html` 中

```js
<link rel="preload" as="script" href="js/utils.js">
```

`react` 中

```js
import(
	`./utils.js`
	/* webpackPreload: true */
	/* webpackChunkName: "utils" */
);
```

#### 3. 加载的优先级

-   一个资源的加载的优先级被分为五个级别,分别是
    -   Highest 最高
    -   High 高
    -   Medium 中等
    -   Low 低
    -   Lowest 最低
-   异步/延迟/插入的脚本（无论在什么位置）在网络优先级中是 Low
    -   Preload, High
    -   Prefetch, Medium
    -   & Priorities Low
    -   in chrome Lowest

#### 4. prefetch 和 preload 的区别

-   preload 是告诉浏览器页面必定需要的资源，浏览器一定会加载这些资源
-   而 prefetch 是告诉浏览器页面可能需要的资源，浏览器不一定会加载这些资源
-   所以建议：对于当前页面很有必要的资源使用 preload,对于可能在将来的页面中使用的资源使用 prefetch

### 5. CDN

-   最影响用户体验的是网页首次打开时的加载等待。 导致这个问题的根本是网络传输过程耗时大，CDN 的作用就是加速网络传输。
-   CDN 又叫内容分发网络，通过把资源部署到世界各地，用户在访问时按照就近原则从离用户最近的服务器获取资源，从而加速资源的获取速度
-   用户使用浏览器第一次访问我们的站点时，该页面引入了各式各样的静态资源，如果我们能做到持久化缓存的话，可以在 http 响应头加上 Cache-control 或 Expires 字段来设置缓存，浏览器可以将这些资源一一缓存到本地
-   用户在后续访问的时候，如果需要再次请求同样的静态资源，且静态资源没有过期，那么浏览器可以直接走本地缓存而不用再通过网络请求资源
-   缓存配置
    -   HTML 文件不缓存，放在自己的服务器上，关闭自己服务器的缓存，静态资源的 URL 变成指向 CDN 服务器的地址
    -   静态的 JavaScript、CSS、图片等文件开启 CDN 和缓存，并且文件名带上 HASH 值
    -   为了并行加载不阻塞，把不同的静态资源分配到不同的 CDN 服务器上
-   域名限制
    -   同一时刻针对同一个域名的资源并行请求是有限制
    -   可以把这些静态资源分散到不同的 CDN 服务上去
    -   多个域名后会增加域名解析时间
    -   可以通过在 HTML HEAD 标签中 加入 去预解析域名，以降低域名解析带来的延迟

#### 1 webpack.config.js

```js
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UploadPlugin = require("./plugins/UploadPlugin");
const glob = require("glob");
const PATHS = {
    src: path.join(__dirname, "src"),
};
module.exports = {
  mode: "development",
  devtool: false,
  context: process.cwd(),
  entry: {
    main: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
+    filename: "[name].[hash].js",
+    chunkFilename: "[name].[hash].chunk.js",
+    publicPath: "http://xxxx.cn/", // cdn地址
  },
  optimization: {
    minimize: true,
    minimizer: [
      //压缩JS
      /* new TerserPlugin({}),
      //压缩CSS
      new CssMinimizerPlugin({}), */
    ],
    //自动分割第三方模块和公共模块
    splitChunks: {
      chunks: "all", //默认作用于异步chunk，值为all/initial/async
      minSize: 0, //默认值是30kb,代码块的最小尺寸
      minChunks: 1, //被多少模块共享,在分割之前模块的被引用次数
      maxAsyncRequests: 2, //限制异步模块内部的并行最大请求数的，说白了你可以理解为是每个import()它里面的最大并行请求数量
      maxInitialRequests: 4, //限制入口的拆分数量
      automaticNameDelimiter: "~", //默认webpack将会使用入口名和代码块的名称生成命名,比如 'vendors~main.js'
      cacheGroups: {
        //设置缓存组用来抽取满足不同规则的chunk,下面以生成common为例
        vendors: {
          chunks: "all",
          test: /node_modules/, //条件
          priority: -10, ///优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中,为了能够让自定义缓存组有更高的优先级(默认0),默认缓存组的priority属性为负值.
        },
        commons: {
          chunks: "all",
          minSize: 0, //最小提取字节数
          minChunks: 2, //最少被几个chunk引用
          priority: -20,
          reuseExistingChunk: true, //如果该chunk中引用了已经被抽取的chunk，直接引用该chunk，不会重复打包代码
        },
      },
    },
    //为了长期缓存保持运行时代码块是单独的文件
    /*  runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    }, */
  },
  module: {
    rules: [
      {
        test: /\.js/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                ["@babel/preset-env", { modules: false }],
                "@babel/preset-react",
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|gif|jpeg|ico)$/,
        use: [
          "file-loader",
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: "65-90",
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin({
+      filename: "[name].[hash].css",
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    }),
+   new UploadPlugin({}),
  ],
};
```

#### 2 UploadPlugin.js

-   自己实现一个插件,在文件打包完成将资源上传到服务器上去,然后静态资源通过 cdn 的方式引入

```js
const qiniu = require('qiniu');
const path = require('path');
//https://developer.qiniu.com/kodo/sdk/1289/nodejs
require('dotenv').config();
const defaultAccessKey = process.env.accessKey;
const defaultSecretKey = process.env.secretKey;
class UploadPlugin {
	constructor(options) {
		this.options = options || {};
	}
	apply(compiler) {
		compiler.hooks.afterEmit.tap('UploadPlugin', (compilation) => {
			let assets = compilation.assets;
			let promises = Object.keys(assets)
				.filter((item) => !item.includes('.html'))
				.map(this.upload.bind(this));
			Promise.all(promises).then((err, data) => console.log(err, data));
		});
	}
	upload(filename) {
		return new Promise((resolve, reject) => {
			let {
				bucket = 'cnpmjs',
				accessKey = defaultAccessKey,
				secretKey = defaultSecretKey,
			} = this.options;
			let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
			let options = {
				scope: bucket,
			};

			let putPolicy = new qiniu.rs.PutPolicy(options);
			let uploadToken = putPolicy.uploadToken(mac);
			let config = new qiniu.conf.Config();

			let localFile = path.resolve(__dirname, '../dist', filename);
			let formUploader = new qiniu.form_up.FormUploader(config);
			let putExtra = new qiniu.form_up.PutExtra();
			formUploader.putFile(
				uploadToken,
				filename,
				localFile,
				putExtra,
				(err, body, info) => {
					err ? reject(err) : resolve(body);
				}
			);
		});
	}
}

module.exports = UploadPlugin;
```
