/*entry-client.js*/
import { createApp } from "../src/app";
const { app, router } = createApp();

router.onReady(() => {
    app.$mount('#app')
});