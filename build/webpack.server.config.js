/*webpack.server.config.js*/
const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base.config');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin =require('vue-server-renderer/server-plugin');
const projectRoot = path.resolve(__dirname, '..'); //根路径

module.exports = merge(base, {
    // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
    //这里必须是node，因为打包完成的运行环境是node，在node端运行的，不是在浏览器端运行
    target: "node",
    //对bundle render 提供source map支持
    devtool: '#source-map',
    // entry需要提供一个单独的入口文件
    entry: ['babel-polyfill', path.join(projectRoot, 'entry/entry-server.js')],
    //输出
    output: {
        //制定libraryTarget的类型为commonjs2，用来指定代码export出去的入口形式
        // 在node.js中模块是module.exports = {...},commonjs2打包出来的代码出口的形式九类似于此。
        libraryTarget: "commonjs2",
        path: path.join(projectRoot, 'dist'), //打包出的路径
        filename: "bundle.server.js" //打包最终的文件名，这个文件是给node服务器使用的
    },
    //外置化应用程序依赖模块。可以使服务器构建速度更快
    extensions: nodeExternals({
        whitelist: /\.css$/
    }),
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NOE_ENV': JSON.stringify(process.env.NOE_ENV || 'development'),
            'process.env.VUE_ENV': '"server"'
        }),
        // 这是将服务器的整个输出 构建为单个 JSON 文件的插件
        // 默认文件名为 'vue-ssr-server-bundle.json'，
        // 记录页面所有依赖文件列表，在生成最终HTML时方便注入相应的js链接和css链接。
        new VueSSRServerPlugin()
    ]
});