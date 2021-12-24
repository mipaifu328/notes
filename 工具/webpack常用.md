# webpack常用

## 常见loader

1. **url-loader**: 资源
```js
module: {
  rules: [
    // 图片 - 考虑 base64 编码的情况
    {
      test: /\.(png|jpg|jpeg|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          // 小于 5kb 的图片用 base64 格式产出
          // 否则，依然延用 file-loader 的形式，产出 url 格式
          limit: 5 * 1024,

          // 打包到 img 目录下
          outputPath: '/img1/',

          // 设置图片的 cdn 地址（也可以统一在外面的 output 中设置，那将作用于所有静态资源）
          // publicPath: 'http://cdn.abc.com'
        }
      }
    },
  ]
},

```
2. 样式相关loader, 包括**style-loader, css-loader, less-loader, postcss-loader, sass-loader, stylus-loader** 
use loader 是`从右到左`进行解析 

```js

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader",
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                [
                  'postcss-preset-env',
                  {
                    // 其他选项
                  },
                ],
              ],
            },
          },
        }]
      },
      {
        test: /\.less$/i,
        loader: [
          // compiles Less to CSS
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // 将 JS 字符串生成为 style 节点
          'style-loader',
          // 将 CSS 转化成 CommonJS 模块
          'css-loader',
          // 将 Sass 编译成 CSS
          'sass-loader',
        ],
      },
      {
        test: /\.styl$/,
        loader: "stylus-loader", // 将 Stylus 文件编译为 CSS
      },
    ],
  },
};

```

3. **babel-loader**： 使用 Babel 和 webpack 转译 JavaScript 文件。
@babel/core、@babel/preset-env 、@babel/polyfill其实都是在做es6的语法转换和弥补缺失的功能，但是当我们在使用webpack打包js时，webpack并不知道应该怎么去调用这些规则去编译js。这时就需要babel-loader了，它作为一个中间桥梁，通过调用babel/core中的api来告诉webpack要如何处理js。

``` js
module: {
  rules: [
    {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          {
            useBuiltIns: 'usage'
          }
        }
      }
    }
  ]
}

```

配置"useBuiltIns": "usage",这样一方面只对使用的新功能做垫片，也不需要我们单独引入import '@babel/polyfill'了，它会在使用的地方自动注入。

## 拆分
1. **MiniCssExtractPlugin**： 将 CSS 提取到单独的文件。
**CssMinimizerWebpackPlugin**: 使用 cssnano 优化和压缩 CSS。

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  optimization: {
    minimizer: [
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
      // `...`,
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
};
```

2. **splitChunks**： js文件分模块打包
```js
optimization: {
  // 分割代码块
  splitChunks: {
    chunks: 'all',
    /**
     * initial 入口chunk，对于异步导入的文件不处理
        async 异步chunk，只对异步导入的文件处理
        all 全部chunk
      */

    // 缓存分组
    cacheGroups: {
        // 第三方模块
      vendor: {
        name: 'vendor', // chunk 名称
        priority: 1, // 权限更高，优先抽离，重要！！！
        test: /node_modules/,
        minSize: 0,  // 大小限制
        minChunks: 1  // 最少复用过几次
      },

      // 公共的模块
      common: {
        name: 'common', // chunk 名称
        priority: 0, // 优先级
        minSize: 0,  // 公共模块的大小限制
        minChunks: 2  // 公共模块最少复用过几次
      }
    }
  }
}
```

## 性能优化
0. **webpack-bundle-analyzer** 包分析报告

1. **IngorePlugin**: 忽略无用文件，不引用不打包，`手动配置`
``` js
// 不引用和打包monment下locale下没使用的文件
new webpack.IgnorePlugin({
  resourceRegExp: /^\.\/locale$/,
  contextRegExp: /moment$/,
})
```
2. **Tree shaking**： 和上面类似，不过Tree shaking是`自动删除`不需要的代码, `只支持 ES module`（import 静态）,不支持require（动态）
```js
// webpack.config.js
module.exports = {
  entry: "./src/index",
  mode: "production",
  devtool: false,
  optimization: {
    usedExports: true,
  },
};

```
[Webpack 原理系列九：Tree-Shaking 实现原理](https://mp.weixin.qq.com/s/McigcfZyIuuA-vfOu3F7VQ)

3. **noParse**：忽略第三方库，不打包
```js
module.exports = {
  //...
  module: {
    noParse: /jquery|lodash/,
  },
};
```

4. **happyPack(不维护了) / thread-loader**： 多进程打包
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve('src'),
        use: [
          'thread-loader',
          // your expensive loader (e.g babel-loader)
        ],
      },
    ],
  },
};

```

[thread-loader](https://github.com/webpack-contrib/thread-loader)

5. **ParallelUglifyPlugin**：多进程压缩 js 
```js
module.exports = {
  plugins: [
    // 使用 ParallelUglifyPlugin 并行压缩输出JS代码
    new ParallelUglifyPlugin({
      // 传递给 UglifyJS的参数如下：
      uglifyJS: {
        output: {
          /*
           是否输出可读性较强的代码，即会保留空格和制表符，默认为输出，为了达到更好的压缩效果，
           可以设置为false
          */
          beautify: false,
          /*
           是否保留代码中的注释，默认为保留，为了达到更好的压缩效果，可以设置为false
          */
          comments: false
        },
        compress: {
          /*
           是否在UglifyJS删除没有用到的代码时输出警告信息，默认为输出，可以设置为false关闭这些作用
           不大的警告
          */
          warnings: false,

          /*
           是否删除代码中所有的console语句，默认为不删除，开启后，会删除所有的console语句
          */
          drop_console: true,

          /*
           是否内嵌虽然已经定义了，但是只用到一次的变量，比如将 var x = 1; y = x, 转换成 y = 5, 默认为不
           转换，为了达到更好的压缩效果，可以设置为false
          */
          collapse_vars: true,

          /*
           是否提取出现了多次但是没有定义成变量去引用的静态值，比如将 x = 'xxx'; y = 'xxx'  转换成
           var a = 'xxxx'; x = a; y = a; 默认为不转换，为了达到更好的压缩效果，可以设置为false
          */
          reduce_vars: true
        }
      }
    }),
  ]
}
```

6. **Dllplugin** 不用于生产环境
把复用性较高的第三方模块打包到动态链接库中，在不升级这些库的情况下，动态库不需要重新打包，每次构建只重新打包业务代码。

