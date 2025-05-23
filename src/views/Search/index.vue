<script setup>
import { getSearchListAPI } from '@/api/article'
import ArticleCard from '@/components/ArticleCard.vue'
import { usePagination } from '@/composables/PageInfo'

const searchList = ref([])
const searchPage = usePagination()
const route = useRoute()
const getSearchList = async () => {
  searchPage.loading.value = true
  const config = {}
  if (route.query.title) config.title = route.query.title
  if (route.query.tag) config.tag = route.query.tag
  const {
    data: { total, records }
  } = await getSearchListAPI(searchPage.pageInfo.value, config)
  searchPage.total.value = total
  searchList.value.push(...records)
  searchPage.loading.value = false
}
onMounted(() => {
  searchPage.registerCallback(() => {
    getSearchList()
  })
})

// 监听keyword变化
const keyword = ref(Object.values(route.query)[0])
watch(
  () => route.query,
  () => {
    keyword.value = Object.values(route.query)[0]
    window.scrollTo(0, 0)
    searchPage.resetPage()
    searchList.value = []
    searchPage.nextPage()
  },
  {
    deep: true
  }
)
</script>

<template>
  <div class="search-page">
    <div class="title">{{ keyword }}</div>
    <div class="article-list">
      <el-skeleton v-if="!searchList.length && searchPage.loading.value" :rows="4" animated />
      <ul
        v-else
        v-infinite-scroll="() => searchPage.nextPage()"
        :infinite-scroll-disabled="searchPage.disableLoad.value"
        :infinite-scroll-delay="1000"
        :infinite-scroll-distance="5"
      >
        <li v-for="(item, index) in searchList" :key="index">
          <ArticleCard :detail="item" :keyword="keyword" />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-page {
  margin: 0 auto;
  width: 700px;
  min-height: 100vh;

  .title {
    margin-bottom: 10px;
    font-size: 25px;
    font-weight: 700;
    color: #666666;
    text-align: center;
  }

  .article-list {
    background-color: #ffffff;
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
