<script setup>
import { getHistoryAPI } from '@/api/user'
import ArticleCard from '@/components/ArticleCard.vue'
import { useUserStore } from '@/stores'
import { Clock } from '@element-plus/icons-vue'

const { userId } = useUserStore()

const historyList = ref([])
const loading = ref(true)
const getHistory = async () => {
  loading.value = true
  const {
    data: { record }
  } = await getHistoryAPI(userId)
  historyList.value = record
  loading.value = false
}
onMounted(() => {
  getHistory()
})
</script>

<template>
  <div class="history-page">
    <div class="title">历史记录</div>
    <el-divider />
    <div class="article-list">
      <el-skeleton v-if="!historyList.length && loading" :rows="4" animated />
      <div class="group" v-for="(item, index) in historyList" :key="index">
        <div
          class="time"
          v-if="index === 0 || historyList[index - 1].createTime != historyList[index].createTime"
        >
          <el-icon><Clock /></el-icon>
          <span>{{ item.createTime.substring(0, 10) }}</span>
        </div>
        <ArticleCard :detail="item" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.history-page {
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

  .group {
    .time {
      margin: 10px 20px 0;
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      .el-icon {
        margin-right: 10px;
        color: $mainColor;
      }
    }
  }
}
</style>
