<script setup>
import { getSearchListAPI } from '@/api/article'
import ArticleCard from '@/components/ArticleCard.vue'
import { usePagination } from '@/composables/PageInfo'

const searchList = ref([])
const searchPage = usePagination()
const route = useRoute()
const getSearchList = async () => {
  searchPage.loading.value = true
  const {
    data: { total, records }
  } = await getSearchListAPI(searchPage.pageInfo.value, route.query.title)
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
watch(
  () => route.query.title,
  () => {
    window.scrollTo(0, 0)
    searchPage.resetPage()
    searchList.value = []
    searchPage.nextPage()
  }
)
</script>

<template>
  <div class="search-page">
    <el-skeleton v-if="!searchList.length && searchPage.loading.value" :rows="4" animated />
    <ul
      v-else
      v-infinite-scroll="() => searchPage.nextPage()"
      :infinite-scroll-disabled="searchPage.disableLoad.value"
      :infinite-scroll-delay="1000"
      :infinite-scroll-distance="5"
    >
      <li v-for="(item, index) in searchList" :key="index">
        <ArticleCard :detail="item" />
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.search-page {
  margin: 0 auto;
  width: 700px;
  min-height: 100vh;
  background-color: #ffffff;

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
