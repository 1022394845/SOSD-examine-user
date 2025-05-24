<script setup>
import { getArticleDetailAPI } from '@/api/article'
import hljs from 'highlight.js' // 代码块高亮
import 'highlight.js/styles/atom-one-dark.css' // 代码块主题样式
import { UserFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'

const detail = ref({})

const route = useRoute()
const loading = ref(true)
const getArticleDetail = async () => {
  loading.value = true
  const { data } = await getArticleDetailAPI(route.query.id)
  detail.value = data
  await nextTick()
  hljs.highlightAll() // 代码块高亮注册
  loading.value = false
}
onMounted(() => {
  getArticleDetail()
})

const commentRef = ref()
const scrollToComment = () => {
  const rect = commentRef.value.getBoundingClientRect()
  // 计算页面需要滚动到的垂直位置
  const scrollTop = window.pageYOffset + rect.top
  // 执行滚动操作
  window.scrollTo({
    top: scrollTop
    // behavior: 'smooth' // 平滑滚动
  })
}

const userStore = useUserStore()
const comment = ref('')
</script>

<template>
  <div class="article-page" v-loading="loading">
    <div class="detail">
      <h1 class="title">{{ detail.title }}</h1>
      <div class="base-info">
        <div class="author ellipsis" style="margin-right: 20px">{{ detail.author }}</div>
        <div class="time" style="margin-right: 20px">{{ detail.createTime?.substring(0, 10) }}</div>
        <div class="item">
          <v-icon name="view" style="margin-right: 5px" />{{ detail.viewNumber }}
        </div>
      </div>
      <el-divider />
      <div class="content" v-html="detail.content"></div>
    </div>
    <div class="operation" v-if="detail.id">
      <el-badge :value="detail.likeNumber" class="item" color="#c2c8d1">
        <v-icon name="like" />
      </el-badge>
      <el-badge :value="detail.favoriteNumber" class="item" color="#c2c8d1">
        <v-icon name="star" />
      </el-badge>
      <el-badge :value="detail.commentNumber" class="item" color="#c2c8d1" @click="scrollToComment">
        <v-icon name="comment" />
      </el-badge>
    </div>
    <div class="comment" ref="commentRef">
      <div class="title">评论 {{ detail.commentNumber }}</div>
      <div class="publish">
        <el-avatar class="avatar" fit="fill">
          <img v-if="userStore.userInfo?.image" :src="userStore.userInfo.image" alt="" />
          <el-icon v-else><UserFilled /></el-icon>
        </el-avatar>
        <div class="input-box">
          <el-input
            v-model="comment"
            type="textarea"
            placeholder="平等表达，友善交流"
            resize="none"
            :autosize="true"
            @focus="onFocus"
            @blur="onBlur"
          />
          <el-button type="primary" class="submit-btn">发表</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.article-page {
  margin: 0 auto;
  width: 820px;
  min-height: 100vh;

  .detail {
    padding: 30px;
    background-color: #ffffff;

    .title {
      font-size: 32px;
      color: #252933;
    }

    .base-info {
      margin-top: 20px;
      display: flex;
      align-items: center;
      color: #8a919f;

      .author {
        max-width: 160px;
        color: #515767;
      }
    }

    .content {
      line-height: 1.75;
    }
  }

  .operation {
    position: fixed;
    top: 200px;
    left: 200px;
    display: flex;
    flex-direction: column;
    height: fit-content;

    .item {
      margin-bottom: 50px;
      width: 50px;
      height: 50px;
      line-height: 50px;
      border-radius: 50%;
      background-color: #ffffff;
      box-shadow: 0 2px 4px 0 rgba(50, 50, 50, 0.04);
      cursor: pointer;
      text-align: center;

      .v-icon {
        font-size: 28px;
        color: #c2c8d1;
        transition: all 0.3s;

        &:hover {
          color: #515767;
        }
      }
    }
  }

  .comment {
    margin-top: 20px;
    padding: 30px;
    min-height: 220px;
    background-color: #ffffff;

    .title {
      font-size: 20px;
      font-weight: 700;
    }

    .publish {
      margin-top: 20px;
      display: flex;

      .avatar {
        font-size: 24px;
      }

      .input-box {
        flex: 1;
        margin-left: 20px;
        padding: 10px;
        border-radius: 4px;
        background-color: #f2f3f5;
        transition: all 0.3s;

        &:hover {
          background-color: #e4e6eb;
        }

        &:focus-within {
          border: 1px solid $mainColor;
          background-color: transparent;
        }

        :deep(.el-textarea__inner) {
          outline: none;
          border: none;
          box-shadow: none;
          background-color: transparent;
          transition: all 0.3s;

          &:focus {
            min-height: 150px !important;
          }
        }

        .submit-btn {
          display: block;
          margin-left: auto;
        }
      }
    }
  }
}
</style>
