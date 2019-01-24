<!--App.vue-->
<template>
    <div id="app">
        <h1 class="title">服务端渲染SSR</h1>
        <router-link to="/home">首页</router-link>
        <router-link to="/shop">店铺</router-link>
        <router-link to="/setting">设置</router-link>
        <router-view></router-view>
    </div>
</template>
<script>

</script>
<style>
    .title {
        color: red;
    }
</style>