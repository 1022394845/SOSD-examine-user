<script setup>
const props = defineProps({ name: String })
</script>

<template>
  <i class="v-icon" :class="'v-icon-' + props.name"></i>
</template>

<style lang="scss">
@import url('./iconfont.css');
</style>
