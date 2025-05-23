<script setup>
import { getUserArticleAPI } from '@/api/user'
import ArticleCard from '@/components/ArticleCard.vue'
import { useUserStore } from '@/stores'

const { userId } = useUserStore()

const articleList = ref([])
const loading = ref(true)
const getArticleList = async () => {
  articleList.value = []
  loading.value = true
  const {
    data: { record }
  } = await getUserArticleAPI(userId)
  articleList.value = record
  loading.value = false
}
onMounted(() => {
  getArticleList()
})
</script>

<template>
  <div class="article-page">
    <div class="title">我的文章</div>
    <el-divider />
    <div class="article-list">
      <el-skeleton v-if="!articleList.length || loading" :rows="4" animated />
      <ul>
        <li v-for="(item, index) in articleList" :key="index">
          <ArticleCard :detail="item" :manage="true" @success="getArticleList" />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.article-page {
  .title {
    padding: 16px 20px;
    line-height: 24px;
    font-size: 18px;
    font-weight: 500;
  }

  .el-divider {
    margin: 0 0 10px;
  }

  .el-skeleton {
    padding: 10px 20px;

    :deep(.el-skeleton__item) {
      height: 14px;
    }

    :deep(.el-skeleton__paragraph) {
      margin-top: 8px;
    }
  }

  ul {
    height: fit-content;
  }
}
</style>
