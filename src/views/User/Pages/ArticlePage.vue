<script setup>
import { deleteArticleAPI, getUserArticleAPI } from '@/api/user'
import ArticleCard from '@/components/ArticleCard.vue'
import { useUserStore } from '@/stores'
import { Setting } from '@element-plus/icons-vue'

const { userId } = useUserStore()

const articleList = ref([])
const loading = ref(true)
const getArticleList = async () => {
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

// 删除文章
const onDelete = async (id) => {
  await ElMessageBox.confirm('删除文章后无法恢复', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await deleteArticleAPI(id)
  ElMessage.success('删除文章成功')
  getArticleList()
}
</script>

<template>
  <div class="article-page">
    <div class="title">我的文章</div>
    <el-divider />
    <div class="article-list">
      <el-skeleton v-if="!articleList.length && loading" :rows="4" animated />
      <ul>
        <li v-for="(item, index) in articleList" :key="index">
          <ArticleCard :detail="item" />
          <el-dropdown>
            <template #default>
              <el-icon class="op"><Setting /></el-icon>
            </template>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>编辑</el-dropdown-item>
                <el-dropdown-item @click="onDelete(item.id)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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

    li {
      position: relative;

      .el-dropdown {
        position: absolute;
        right: 20px;
        top: 15px;
        font-size: 18px;
        color: #8a919f;
        cursor: pointer;

        .op:focus-visible {
          outline: unset;
        }

        .op[aria-expanded='true'] {
          color: $mainColor;
        }
      }
    }
  }
}
</style>
