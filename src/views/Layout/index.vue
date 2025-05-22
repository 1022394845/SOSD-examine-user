<script setup>
import {
  Search,
  BellFilled,
  UserFilled,
  User,
  Document,
  Star,
  Clock,
  SwitchButton
} from '@element-plus/icons-vue'
import LoginDialog from './components/LoginDialog.vue'
import { useUserStore } from '@/stores'

// 菜单激活项
const activeMenu = ref('/home')

// 搜索关键字
const searchKey = ref('')
const router = useRouter()
const route = useRoute()
const onSearch = () => {
  if (!searchKey.value || route.query.title === searchKey.value) return
  router.push({
    path: '/search',
    query: {
      title: searchKey.value
    }
  })
}

const userStore = useUserStore()
onMounted(() => {
  if (userStore.userId) userStore.getUserInfo()
})

// 下拉菜单处理
const loginDialog = ref()
const handleCommand = async (key) => {
  switch (key) {
    // 登录
    case 'login': {
      loginDialog.value.open()
      break
    }
    // 退出
    case 'logout': {
      // 询问退出
      await ElMessageBox.confirm('确认退出账号吗？', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
      // 退出
      userStore.onLogout()
      ElMessage.success('退出成功')
      router.replace('/home')
      break
    }
  }
}
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
          <el-input
            v-model="searchKey"
            placeholder="输入搜索内容"
            style="width: 300px"
            @keyup.enter="onSearch"
          >
            <template #append>
              <el-button :icon="Search" @click="onSearch" />
            </template>
          </el-input>
          <el-button type="primary" class="author-center">创作者中心</el-button>
          <el-badge :value="3" class="message" :offset="[-10, 5]">
            <el-button :icon="BellFilled" class="bell" />
          </el-badge>
          <!-- 头像&下拉菜单 -->
          <el-dropdown @command="handleCommand" placement="bottom-end">
            <template #default>
              <el-avatar class="avatar" fit="fill">
                <img v-if="userStore.userInfo?.image" :src="userStore.userInfo.image" alt="" />
                <el-icon v-else><UserFilled /></el-icon>
              </el-avatar>
            </template>
            <template #dropdown>
              <el-dropdown-menu v-if="userStore.userId">
                <el-dropdown-item command="profile" :icon="User">基本信息</el-dropdown-item>
                <el-dropdown-item command="article" :icon="Document">我的文章</el-dropdown-item>
                <el-dropdown-item command="star" :icon="Star">我的收藏</el-dropdown-item>
                <el-dropdown-item command="star" :icon="Clock">历史记录</el-dropdown-item>
                <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
              </el-dropdown-menu>
              <el-dropdown-menu v-else>
                <el-dropdown-item command="login" :icon="User">登录账号</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main><router-view /></el-main>
    </el-container>
    <LoginDialog ref="loginDialog" @success="$router.replace('/home')" />
  </div>
</template>

<style scoped lang="scss">
.el-header {
  position: sticky;
  top: 0;
  background-color: #ffffff;
  z-index: 99;

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
      border-bottom: none;
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
      cursor: pointer;
    }
  }
}

.el-main {
  margin: 0 auto;
  padding: 20px 0;
  width: 1200px;
  overflow: visible;
}
</style>
