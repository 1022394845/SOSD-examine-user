<script setup>
import { User, Document, Star, Clock } from '@element-plus/icons-vue'
</script>

<template>
  <div class="user-page">
    <!-- 导航 -->
    <el-menu class="nav" :default-active="$route.path" text-color="#515767" router>
      <el-button type="primary" class="publish-btn" @click="$router.push('/user/publish')">
        写文章
      </el-button>
      <el-menu-item index="/user/profile">
        <el-icon><User /></el-icon>
        <span>个人信息</span>
      </el-menu-item>
      <el-menu-item index="/user/article">
        <el-icon><Document /></el-icon>
        <span>文章管理</span>
      </el-menu-item>
      <el-menu-item index="/user/star">
        <el-icon><Star /></el-icon>
        <span>我的收藏</span>
      </el-menu-item>
      <el-menu-item index="/user/history">
        <el-icon><Clock /></el-icon>
        <span>历史记录</span>
      </el-menu-item>
    </el-menu>
    <div class="container">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-page {
  display: flex;
  justify-content: space-between;
  min-height: 100vh;

  .nav {
    position: sticky;
    top: 80px;
    padding: 12px 8px 8px;
    width: 200px;
    height: fit-content;
    border-right: none;
    border-radius: 4px;

    .publish-btn {
      margin-bottom: 10px;
      width: 100%;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
    }

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

  .container {
    width: 980px;
    background-color: #ffffff;
    overflow-x: hidden;
  }
}

// 路由切换过渡
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateX(-5%);
}
.fade-leave-to {
  opacity: 0;
  transform: translateX(5%);
}
</style>
