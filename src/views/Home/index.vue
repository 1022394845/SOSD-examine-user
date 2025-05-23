<script setup>
import { getArticleListAPI, getHotListAPI } from '@/api/article'
import ArticleCard from '@/components/ArticleCard.vue'
import { usePagination } from '@/composables/PageInfo'
import { useArticleStore } from '@/stores'

const { categoryList } = useArticleStore()

// 文章列表
const sort = ref('recommend')
const articleList = ref([])
const articlePage = usePagination()
const loadArticleList = async () => {
  articlePage.loading.value = true
  const {
    data: { total, records }
  } = await getArticleListAPI(articlePage.pageInfo.value, { category: keyword.value })
  articlePage.total.value = total
  articleList.value.push(...records)
  articlePage.loading.value = false
}
onMounted(() => {
  articlePage.registerCallback(() => {
    loadArticleList()
  })
})

const keyword = ref('recommended')
// 更改分类
const onChangeCategory = (val) => {
  keyword.value = val
  window.scrollTo(0, 0)
  articlePage.resetPage()
  articleList.value = []
  articlePage.nextPage()
}

// 热点文章
const hotList = ref([])
const hotLoading = ref(false)
const getHotList = async () => {
  hotLoading.value = true
  const { data } = await getHotListAPI()
  hotList.value = data
  hotLoading.value = false
}
onMounted(() => {
  getHotList()
})
</script>

<template>
  <div class="home-page">
    <!-- 分类导航 -->
    <el-menu
      class="category-nav"
      :default-active="keyword"
      text-color="#515767"
      @select="onChangeCategory"
    >
      <el-menu-item v-for="(item, index) in categoryList" :key="index" :index="item.name">
        <v-icon :name="item.name" style="margin-right: 16px"></v-icon>
        <span>{{ item.label }}</span>
      </el-menu-item>
    </el-menu>
    <!-- 文章列表 -->
    <div class="article-list">
      <el-tabs v-model="sort" class="tabs">
        <el-tab-pane label="推荐" name="recommend">
          <el-skeleton v-if="!articleList.length && articlePage.loading.value" :rows="4" animated />
          <ul
            v-else
            v-infinite-scroll="() => articlePage.nextPage()"
            :infinite-scroll-disabled="articlePage.disableLoad.value"
            :infinite-scroll-delay="1000"
            :infinite-scroll-distance="5"
          >
            <li v-for="(item, index) in articleList" :key="index">
              <ArticleCard :detail="item" />
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="最新" name="last" disabled />
      </el-tabs>
    </div>
    <!-- 热点列表 -->
    <div class="hot-list">
      <div class="title"><img src="@/assets/articleIcon.svg" alt="" />热点文章</div>
      <el-divider />
      <el-skeleton v-if="hotLoading" :rows="3" animated />
      <ul class="list" v-else>
        <li class="hot-item" v-for="(item, index) in hotList" :key="index">
          <div class="index">{{ index + 1 }}</div>
          <div class="content ellipsis">{{ item.title }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-page {
  display: flex;
  justify-content: space-between;
  min-height: 100vh;

  .category-nav {
    position: sticky;
    top: 80px;
    padding: 8px;
    width: 180px;
    height: fit-content;
    border-right: none;
    border-radius: 4px;

    .el-menu-item {
      height: 45px;
      font-size: 16px;
      font-weight: 500;
      border-radius: 4px;

      &.is-active {
        background-color: rgba(#409eff, 0.2);
      }
    }
  }

  .article-list {
    width: 720px;
    height: fit-content;
    background-color: #ffffff;
    border-radius: 4px;

    .tabs {
      :deep(.el-tabs__nav) {
        margin-top: 3px;
      }

      :deep(.el-tabs__item) {
        padding-left: 20px;
        font-size: 16px;
        font-weight: 500;
      }

      :deep(.el-tabs__content) {
        min-height: 80px;
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
  }

  .hot-list {
    position: sticky;
    top: 80px;
    padding: 12px 8px;
    width: 260px;
    height: fit-content;
    background-color: #ffffff;

    .title {
      display: flex;
      align-items: center;
      font-size: 16px;

      img {
        margin-right: 10px;
        width: 20px;
        height: 20px;
        background-color: transparent;
      }
    }

    .el-divider {
      margin: 8px auto;
    }

    .el-skeleton {
      padding: 5px 10px;

      :deep(.el-skeleton__item) {
        height: 14px;
      }

      :deep(.el-skeleton__paragraph) {
        margin-top: 8px;
      }
    }

    .list {
      transition: all 0.3s;

      li {
        display: flex;
        align-items: center;
        padding: 8px;
        cursor: pointer;

        &:hover {
          background-color: #f7f8fa;
        }

        .index {
          margin-right: 20px;
          padding-top: 3px;
          font-family: 'Archivo';
          font-weight: 800;
          color: #8a919f;
        }

        &:nth-child(1) .index {
          background: linear-gradient(180deg, #f64242 20%, rgba(246, 66, 66, 0.4) 80%);
        }
        &:nth-child(2) .index {
          background: linear-gradient(180deg, #ff7426 20%, rgba(255, 116, 38, 0.4) 80%);
        }
        &:nth-child(3) .index {
          background: linear-gradient(180deg, #ffac0c 20%, rgba(255, 172, 12, 0.4) 80%);
        }
        &:nth-child(-n + 3) .index {
          background-clip: text;
          color: transparent;
        }
      }
    }
  }
}
</style>
