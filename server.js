/* server.js */
const fs = require('fs');
const express = require('express');
const path = require('path');
const LRU = require('lru-cache');//LRU(Least Recently Used) '最近最少用的'
const { createBundleRenderer } = require('vue-server-renderer');

const resolve = file => path.resolve(__dirname, file);
const template = fs.readFileSync('./src/index.template.html', 'utf-8');
const isProd = process.env.NODE_ENV === 'production';
const server = express();

function createRenderer(bundle, options) {
    return createBundleRenderer(bundle, Object.assign(options, {
        template, //页面模版
        // 在固定的缓存空间下，把最近使用的数据移除，让给最新读取的数据，尽量保留访问最多的数据
        cache: LRU({
            max: 1000,
            maxAge: 1000 * 60 * 15
        }),
        //显式地声明 server bundle 的运行目录。运行时将会以此目录为基准来解析 node_modules 中的依赖模块
        //只有在所生成的 bundle 文件与外部的 NPM 依赖模块放置在不同位置，或者 vue-server-renderer 是通过 NPM link 链接到当前项目中时，才需要配置此选项。
        basedir: resolve('./dist'),
        // 默认true情况下，对于每次渲染，bundle renderer 将创建一个新的 V8 上下文并重新执行整个 bundle。但性能开销大
        runInNewContext: false
    }));
}

let renderer;
const bundle = require('./dist/vue-ssr-server-bundle');
const clientManifest = require('./dist/vue-ssr-client-manifest');
renderer = createRenderer(bundle, { clientManifest });
const serve = (path, cache) => express.static(resolve(path), {
    maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0 //缓存时间设置
})
//use与get、post不同的是，他的网址不是精确匹配的。而是能够有文件夹拓展的
//提供静态资源
//为了给静态资源文件创建一个虚拟的文件前缀(实际上文件系统中并不存在) ，可以使用 express.static 函数指定一个虚拟的静态目录
//http://localhost:8085/dist  使用 /dist 作为前缀来加载 ./dist 文件夹下的文件
server.use('/dist', serve('./dist', true));
server.use(serve(__dirname + '/dist'));
server.get('*', (req, res) => {
    // res.setHeader("Content-type", "text/html;charset=UTF-8");
    const context = {
        title: '服务端渲染SSR',
        url: req.url
    };
    //这里无需传入一个应用程序，因为在执行bundle 时已经自动创建过
    // 现在我们的服务器与应用程序已经解耦
    renderer.renderToString(context, (err, html) => {
        if (err) {
            return res.status(500).end('服务器错误！');
        }
        console.log("==html===", html);
        res.end(html);
    })
});

// 服务器监听地址
server.listen(8085, () => {
    console.log('===服务器已启动！===')
});