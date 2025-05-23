<script setup>
import { Setting } from '@element-plus/icons-vue'
import { deleteArticleAPI } from '@/api/user'

const { detail, keyword, manage } = defineProps({
  detail: Object,
  keyword: String,
  manage: Boolean
})

// 高亮匹配内容
const highlightMatch = (text) => {
  if (!keyword) return text
  const regex = new RegExp(`(${keyword})`, 'gi')
  return text.replace(regex, '<em style="color: #e8001c; font-style: normal;">$1</em>')
}

// 标签搜索文章
const router = useRouter()
const onSearchTag = (tag) => {
  router.push({
    path: '/search',
    query: { tag }
  })
}

const emit = defineEmits(['success'])
// 删除文章
const onDelete = async (id) => {
  await ElMessageBox.confirm('删除文章后无法恢复', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await deleteArticleAPI(id)
  ElMessage.success('删除文章成功')
  emit('success')
}
</script>

<template>
  <div class="article-card">
    <div class="main-info">
      <div class="title ellipsis" v-html="highlightMatch(detail.title)"></div>
      <div class="content ellipsis" v-html="highlightMatch(detail.content)"></div>
      <div class="footer">
        <div class="info">
          <div class="hover">{{ detail.author }}</div>
          <el-divider direction="vertical" />
          <div class="item"><v-icon name="view" />{{ detail.viewNumber }}</div>
          <div class="item hover"><v-icon name="like" />{{ detail.likeNumber }}</div>
        </div>
        <div class="tag-list">
          <div
            class="tag hover"
            v-for="(item, index) in detail.tags"
            :key="index"
            @click="onSearchTag(item.name)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
      <!-- 文章管理 -->
      <el-dropdown v-if="manage">
        <template #default>
          <el-icon class="op"><Setting /></el-icon>
        </template>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>编辑</el-dropdown-item>
            <el-dropdown-item @click="onDelete(detail.id)">删除</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-image v-if="detail.image" :src="detail.image" lazy />
  </div>
</template>

<style scoped lang="scss">
.article-card {
  margin: 0 20px;
  padding: 10px 0;
  display: flex;
  align-items: center;
  height: 100px;
  color: #8a919f;
  border-bottom: 1px solid var(--el-border-color);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #f7f8fa;
  }

  .main-info {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;

    .title {
      line-height: 24px;
      font-size: 16px;
      font-weight: 600;
      color: #252933;
    }

    .content {
      margin-top: 4px;
      line-height: 22px;
      font-size: 13px;
    }

    .footer {
      margin-top: 3px;
      display: flex;
      justify-content: space-between;
      line-height: 20px;
      font-size: 13px;

      .hover {
        cursor: pointer;

        &:hover {
          color: var(--el-color-primary);
        }
      }

      .info {
        display: flex;
        align-items: center;

        .el-divider {
          margin: 0 15px;
        }

        .item {
          margin-right: 20px;
          display: flex;
          align-items: center;

          .v-icon {
            margin-right: 5px;
          }
        }
      }

      .tag-list {
        display: flex;

        .tag {
          margin-left: 6px;
          padding: 0 6px;
          max-width: 65px;
          background-color: #f2f3f5;
          border-radius: 2px;
        }
      }
    }

    .el-dropdown {
      position: absolute;
      right: 10px;
      top: 0px;
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

  .el-image {
    flex-shrink: 0;
    margin-left: 24px;
    width: 108px;
    height: 100%;
    border-radius: 4px;
  }
}
</style>
