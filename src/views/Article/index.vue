<script setup>
import { getArticleDetailAPI } from '@/api/article'
import hljs from 'highlight.js' // 代码块高亮
import 'highlight.js/styles/atom-one-dark.css' // 代码块主题样式

const detail = ref({})

const route = useRoute()
const loading = ref(true)
const getArticleDetail = async () => {
  loading.value = true
  const { data } = await getArticleDetailAPI(route.query.id)
  detail.value = data
  await nextTick()
  hljs.highlightAll() // 代码块高亮注册
  loading.value = false
}
onMounted(() => {
  getArticleDetail()
})
</script>

<template>
  <div class="article-page" v-loading="loading">
    <h1 class="title">{{ detail.title }}</h1>
    <div class="base-info">
      <div class="author ellipsis" style="margin-right: 20px">{{ detail.author }}</div>
      <div class="time" style="margin-right: 20px">{{ detail.createTime?.substring(0, 10) }}</div>
      <div class="item">
        <v-icon name="view" style="margin-right: 5px" />{{ detail.viewNumber }}
      </div>
    </div>
    <el-divider />
    <div class="content" v-html="detail.content"></div>
  </div>
</template>

<style scoped lang="scss">
.article-page {
  margin: 0 auto;
  padding: 30px;
  width: 820px;
  min-height: 100vh;
  background-color: #ffffff;

  .title {
    font-size: 32px;
    color: #252933;
  }

  .base-info {
    margin-top: 20px;
    display: flex;
    align-items: center;
    color: #8a919f;

    .author {
      max-width: 160px;
      color: #515767;
    }
  }

  .content {
    line-height: 1.75;
  }
}
</style>
