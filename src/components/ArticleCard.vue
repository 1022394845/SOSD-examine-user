<script setup>
const { detail } = defineProps({ detail: Object })
</script>

<template>
  <div class="article-card">
    <div class="title ellipsis">{{ detail.title }}</div>
    <div class="content ellipsis">{{ detail.content }}</div>
    <div class="footer">
      <div class="info">
        <div class="hover">{{ detail.author }}</div>
        <el-divider direction="vertical" />
        <div class="item"><v-icon name="view" />{{ detail.viewNumber }}</div>
        <div class="item hover"><v-icon name="like" />{{ detail.likeNumber }}</div>
      </div>
      <div class="tag-list">
        <div class="tag hover" v-for="(item, index) in detail.tags" :key="index">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.article-card {
  margin: 0 20px;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100px;
  color: #8a919f;
  border-bottom: 1px solid var(--el-border-color);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #f7f8fa;
  }

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
}
</style>
