<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view> </router-view>
  </el-config-provider>
</template>

<style>
html {
  scroll-behavior: smooth;
}
</style>
