/* webpack.client.config */
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
//缓存webpack打包的bundle js文件
const SWPrecchePlugin = require('sw-precache-webpack-plugin'); //用于使用service worker来缓存外部项目依赖项
const base = require('./webpack.base.config');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const projectRoot = path.resolve(__dirname, '..'); //根路径

const config = merge(base, {
    entry: {
        app: path.join(projectRoot, 'entry/entry-client.js')
    },
    resolve: {
        alias: {
            'create-api': './create-api-client.js'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NOE_ENV': JSON.stringify(process.env.NOE_ENV || 'development'),
            'process.env.VUE_ENV': '"server"'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: 'vendor',
            minChunks: function (module) {
                //一个模块被提取到vendor chunk时
                return (
                    //如果他在 node_modules 中
                    /node_modules/.test(module.context) &&
                    //如果 request 是一个 CSS 文件，则无需外置化提取
                    !/\.css$/.test(module.request)
                )
            }
        }),
        //重要信息： 这将webpack运行时分离到一个引导 chunk 中
        //以便可以在之后正确注入一步 chunk
        // 这也为应用程序/vendor代码提供了更好的缓存。
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            //chunks: ['vendors', 'vues']
        }),
        //此插件在输出目录中 生成 'vue-ssr-client-manifest.json'
        new VueSSRClientPlugin()
    ]
});

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
        new SWPrecchePlugin({ //将使用sw-precache生成service worker文件并将其添加到您的构建目录
            cacheId: 'vue-ssr',
            filename: 'service-eorker.js',
            minify: true,
            dontCacheBustUrlsMatching: /\.w{8}\./,
            staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/]
        })
    );
}

module.exports = config;