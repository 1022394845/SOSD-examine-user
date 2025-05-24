<script setup>
import { getAIAbstractAPI, getArticleDetailAPI, getCommentListAPI } from '@/api/article'
import hljs from 'highlight.js' // 代码块高亮
import 'highlight.js/styles/atom-one-dark.css' // 代码块主题样式
import { UserFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import CommentInput from './components/CommentInput.vue'
import aiLogo from '@/assets/ai_abstract_logo.png'

const detail = ref({})

const route = useRoute()
const detailLoading = ref(true)
const getArticleDetail = async () => {
  detailLoading.value = true
  const { data } = await getArticleDetailAPI(route.query.id)
  detail.value = data
  await nextTick()
  hljs.highlightAll() // 代码块高亮注册
  detailLoading.value = false
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

const commentList = ref([])
const commentLoading = ref(true)
const getCommentList = async () => {
  commentLoading.value = true
  const {
    data: { comments }
  } = await getCommentListAPI(route.query.id)
  comments.forEach((item) => {
    item.reply = ''
    item.onReply = false
  })
  commentList.value = comments
  commentLoading.value = false
}
onMounted(() => {
  getCommentList()
})

// 回复
let lastActiveIndex = null
const onReply = (index) => {
  const status = commentList.value[index].onReply
  if (status) commentList.value[index].onReply = false
  else {
    if (lastActiveIndex !== null) {
      commentList.value[lastActiveIndex].onReply = false
    }
    lastActiveIndex = index
    commentList.value[index].onReply = true
  }
}

// AI总结
const AIAbstract = ref('')
const getAIAbstract = async () => {
  const {
    data: { summary }
  } = await getAIAbstractAPI(route.query.id)
  AIAbstract.value = summary
}
onMounted(() => {
  getAIAbstract()
})
</script>

<template>
  <div class="article-page" v-loading="detailLoading">
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
      <div class="ai-abstract" v-if="AIAbstract">
        <img :src="aiLogo" alt="" />
        {{ AIAbstract }}
      </div>
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
          <el-icon class="user-icon" v-else><UserFilled /></el-icon>
        </el-avatar>
        <CommentInput v-model="comment" @success="getCommentList" />
      </div>
      <div class="comment-list">
        <div class="item" v-for="(item, index) in commentList" :key="index">
          <el-avatar class="avatar" fit="fill">
            <img v-if="item.image" :src="item.image" alt="" />
            <el-icon class="user-icon" v-else><UserFilled /></el-icon>
          </el-avatar>
          <div class="info">
            <div class="user ellipsis">{{ item.username }}</div>
            <div class="content">{{ item.content }}</div>
            <div class="comment-btn" @click="onReply(index)" :class="{ active: item.onReply }">
              <v-icon name="comment" style="margin-right: 5px" />
              <span>{{ item.onReply ? '取消评论' : '评论' }}</span>
            </div>
            <CommentInput
              v-if="item.onReply"
              v-model="item.reply"
              :autoFocus="true"
              @success="getCommentList"
            />
          </div>
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

    .ai-abstract {
      margin-bottom: 20px;
      padding: 8px 16px;
      background: url('@/assets/ai_abstract_bg.png') no-repeat center/cover;
      border-radius: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      word-break: break-all;
      -webkit-line-clamp: 3;
      color: #222226;
      font-family: 'PingFang SC';
      font-size: 16px;
      line-height: 32px;
      word-break: break-all;

      img {
        margin-right: 8px;
        height: 25px;
        vertical-align: text-bottom;
      }
    }

    .content {
      line-height: 1.75;
    }
  }

  .operation {
    position: fixed;
    top: 200px;
    left: 10%;
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
    }

    .user-icon {
      font-size: 24px;
    }

    .comment-list {
      .item {
        margin: 20px 0;
        display: flex;

        .info {
          margin-left: 20px;
          flex: 1;
          overflow: hidden;
          font-size: 16px;

          .user {
            margin-bottom: 5px;
            color: #515767;
          }

          .comment-btn {
            margin: 5px 0;
            color: #8a919f;
            cursor: pointer;
            font-size: 14px;

            &:hover,
            &.active {
              color: $mainColor;
            }
          }
        }

        .input-box {
          margin-left: 0;
        }
      }
    }
  }
}
</style>
