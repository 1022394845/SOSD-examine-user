<script setup>
import { Search, BellFilled, UserFilled } from '@element-plus/icons-vue'

const activeMenu = ref('/home')

const searchKey = ref('')
</script>

<template>
  <div class="layout-container">
    <el-container>
      <el-header>
        <div class="container">
          <a href="/" class="logo">SOSD博客平台</a>
          <el-menu
            :default-active="activeMenu"
            class="menu"
            mode="horizontal"
            router
            :ellipsis="false"
          >
            <el-menu-item index="/home">首页</el-menu-item>
            <el-menu-item index="" disabled>热点</el-menu-item>
            <el-menu-item index="" disabled>直播</el-menu-item>
            <el-menu-item index="" disabled>课程</el-menu-item>
            <el-menu-item index="" disabled>活动</el-menu-item>
          </el-menu>
          <el-input v-model="searchKey" placeholder="输入搜索内容" style="width: 300px">
            <template #append>
              <el-button :icon="Search" />
            </template>
          </el-input>
          <el-button type="primary" class="author-center">创作者中心</el-button>
          <el-badge :value="3" class="message" :offset="[-10, 5]">
            <el-button :icon="BellFilled" class="bell" />
          </el-badge>
          <el-avatar class="avatar" fit="fill">
            <img v-if="false" src="" alt="" />
            <el-icon v-else><UserFilled /></el-icon>
          </el-avatar>
        </div>
      </el-header>
      <el-main><router-view /></el-main>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
.el-header {
  background-color: #ffffff;

  .container {
    margin: 0 auto;
    width: 1440px;
    height: 60px;
    display: flex;
    align-items: center;

    .logo {
      font-size: 24px;
      font-weight: 700;
    }

    .menu {
      flex: 1;
      margin: 0 20px;
    }

    .author-center {
      margin-left: 20px;
    }

    :deep(.el-badge__content) {
      font-size: 8px;
    }

    .bell {
      font-size: 24px;
      color: #909090;
      border: none;
      background-color: transparent;
    }

    .avatar {
      margin-left: 10px;
      width: 35px;
      height: 35px;
      font-size: 18px;
    }
  }
}
</style>
