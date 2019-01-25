/* app.js */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { sync } from 'vuex-router-sync';

// 导出一个工厂函数，用于创建新的vue实例
export function createApp(ssrContext) {
    // console.log("===router", router)
    const app = new Vue({
        router,
        ssrContext,
        render: h => h(App)
    });
    return {app, router};
}