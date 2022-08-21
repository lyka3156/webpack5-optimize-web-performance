# 优化前端性能

如何优化前端性能,首先你要知道哪些文件构建比较大,对构建结果分析，这个就要借助`webpack-bundle-analyzer`插件来实现了

## 1. 构建结果分析
是一个webpack的插件，需要配合webpack和webpack-cli一起使用。这个插件的功能是生成代码分析报告，帮助提升代码质量和网站性能

1. 安装 [`webpack-bundle-analyzer`](https://www.npmjs.com/package/webpack-bundle-analyzer)，

```js
yarn add -D webpack-bundle-analyzer
```

2. 修改配置

```js
...
// 费时分析
const { BundleAnalyzerPlugin }  = require("swebpack-bundle-analyzer") ;

module.exports={
  plugins: [
    new BundleAnalyzerPlugin()  // 使用默认配置
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
  ]
}
```

3. 执行打包生成文件再分析



## 2. 压缩js

## 3. 压缩css

## 4. 清除无用的CSS

## 5. Tree Shaking

## 6. Scope Hoisting