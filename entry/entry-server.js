/* entry-server.js */
import { createApp } from "../src/app";
export default context => {
    return new Promise((resolve, reject) => {
        const { app, router } = createApp(context);

        //更改路由
        router.push(context.url);
        //获取相应路由下的组件
        const matchedComponents = app.$router.getMatchedComponents();

        //如果没有组件，说明该路由不存在，报错404
        if (!matchedComponents) {
            return reject({ code: 404 });
        }

        resolve(app);
    });
}