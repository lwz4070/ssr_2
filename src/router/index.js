/* router index.js */
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    // 去掉路由地址的#,因为#后面的内容不会发送至服务器，服务器不知道请求的是哪一个路由
    mode: 'history',
    routes: [
        {
            alias: '/', //起个别名
            path: '/home',
            component: require('../components/home.vue')
        },
        {
            path: '/shop',
            component: require('../components/shop.vue')
        },
        {
            path: '/setting',
            component: require('../components/setting.vue')
        }
    ]
});