/* webpack.base.config */
/*提取服务端和客户端公共对象*/

const path = require('path'); //获取路径对象
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');//抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象
const isProd = process.env.NODE_ENV === 'production'; //判断运行环境
module.exports = {
    /*生产环境推荐：cheap-module-source-map 开发环境推荐：cheap-module-eval-source-map
    Webpack打包生成的.map后缀文件，使得我们的开发调试更加方便，它能帮助我们链接到断点对应的源代码的位置进行调试
    （//# souceURL），而devtool就是用来指定source-maps的配置方式的。*/
    devtool: isProd ? "#cheap-module-source-map" : "#cheap-module-eval-source-map",
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        filename: '[name].[chunkhash].js' //用于长效缓存
    },
    resolve: {
        //在导入语句没带文件后缀时，Webpack 会自动带上后缀后去尝试访问文件是否存在,按顺序查找
        extensions: ['.js', '.vue', '.json'],
        //别名
        alias: {
            'vue': 'vue/dist/vue.runtime.min.js',
            '@': path.resolve('src'),
            '~': path.resolve('src/components')
        }
    },
    module: {
        //noParse 如果确定一个模块中没有其它新的依赖 就可以配置这项，webpack 将不再扫描这个文件中的依赖。
        noParse: [/es6-promise\.js$/],
        // 因为webpack2，这里必须是rules，如果使用use，会报错：vue this._init is not a function
        rules: [
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader',
                    options: {
                        preserveWhitespace: false,
                        postcss: [
                            require('autoprefixer')({ //处理浏览器兼容
                                browers: ['last 3 versions']
                            })
                        ]
                    }
                }
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, //自动hash命名图片等资源，并修改路径。路径需要根据项目实际情况确定
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: '[name].[ext]?[hash]'
                    }
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'fonts/[name].[hash:7].[ext]'
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                use: ['vue-style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.json$/,
                use: 'json-loader'
            },
            // {
            //     test: /\.(less|css)$/,
            //     use: isProd ?
            //         ExtractTextPlugin.extract({
            //             use: ['css-loader?minimize','less-loader'],
            //             fallback: 'vue-style-loader'
            //         }) :
            //         ['vue-style-loader', 'css-loader', 'less-loader']
            // }
        ]
    },
    //性能
    performance: {
        maxEntrypointSize: 300000, //超过300000bytes 警告提示
        hints: isProd ? 'warning' : false
    },
    plugins: [
        //抽离css样式
        new ExtractTextPlugin({
            filename: 'common.[chunkhash].css'
        }),
        new ExtractTextPlugin({
            filename: 'common.[chunkhash].less'
        })
    ]
}