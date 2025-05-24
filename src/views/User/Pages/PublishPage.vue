<script setup>
import {
  getArticleDetailAPI,
  modifyArticleAPI,
  publishArticleAPI,
  uploadAvatarAPI
} from '@/api/user'
import ArticleEditor from '@/components/ArticleEditor.vue'
import { useArticleStore } from '@/stores'
import { Plus } from '@element-plus/icons-vue'

// 表单
const form = ref()
const formModel = ref({})
// 校验规则
const rules = {
  title: [{ required: true, message: '标题不可为空', trigger: 'blur' }],
  category: [{ required: true, message: '分类不可为空', trigger: 'blur' }],
  content: [
    {
      validator: (rule, value, callback) => {
        if (getText()) callback()
        else callback(new Error('内容不可为空'))
      },
      trigger: 'blur'
    }
  ]
}

// 分类列表
const { categoryList } = useArticleStore()

// 编辑文章数据回显
const route = useRoute()
const loading = ref(false)
const getDetail = async () => {
  if (!route.query.id) return
  loading.value = true
  const {
    data: { records }
  } = await getArticleDetailAPI(route.query.id)
  const { id, title, category, tags, image, content } = records[0]
  const detail = { id, title, category, tags, image, content }
  detail.tags = detail.tags.map((item) => item.name)
  formModel.value = { ...detail }
  setHtml(detail.content)
  imageUrl.value = detail.image
  loading.value = false
}
onMounted(() => {
  getDetail()
})

// 更改头像
const imageFile = ref()
const imageUrl = ref()
const onChangeImage = (file) => {
  imageFile.value = file
  imageUrl.value = URL.createObjectURL(file.raw)
}

const editorRef = ref()
// 获取富文本
const getHtml = () => {
  return editorRef.value.getHtml()
}
// 获取纯文本
const getText = () => {
  return editorRef.value.getText()
}
// 设置富文本
const setHtml = (content) => {
  editorRef.value.setHtml(content)
}

const router = useRouter()
const submit = async () => {
  await form.value.validate()
  const loading = ElLoading.service({
    lock: true,
    text: '发布中',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    formModel.value.content = getHtml()
    if (imageFile.value) {
      // 封面有更改
      const { data: url } = await uploadAvatarAPI(imageFile.value)
      formModel.value.image = url
    }
    if (formModel.value.id) await modifyArticleAPI(formModel.value)
    else await publishArticleAPI(formModel.value)
  } finally {
    loading.close()
  }
  router.push('/user/article')
  ElMessage.success('发布成功')
}
</script>

<template>
  <div class="publish-page">
    <div class="title">发布文章</div>
    <el-divider />
    <div v-loading="loading">
      <el-form
        ref="form"
        :model="formModel"
        :rules="rules"
        label-width="auto"
        label-position="left"
        hide-required-asterisk
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="formModel.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="formModel.category" placeholder="请选择分类">
            <el-option
              v-for="item in categoryList"
              :key="item.name"
              :label="item.label"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-input-tag v-model="formModel.tags" placeholder="请输入文章标签" />
        </el-form-item>
        <el-form-item label="封面">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="onChangeImage"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item prop="content">
          <ArticleEditor ref="editorRef" />
        </el-form-item>
      </el-form>
      <el-button type="primary" class="submit-btn" @click="submit">发布</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.publish-page {
  padding: 0 20px 20px;

  .title {
    padding: 16px 20px;
    line-height: 24px;
    font-size: 18px;
    font-weight: 500;
  }

  .el-divider {
    margin: 0 0 20px;
  }

  :deep(.avatar-uploader) {
    .avatar {
      display: block;
      width: 165px;
      height: 120px;
      border-radius: 4px;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);

      &:hover {
        border-color: var(--el-color-primary);
      }
    }

    .el-icon {
      width: 165px;
      height: 120px;
      font-size: 28px;
      color: #8c939d;
      text-align: center;
    }
  }

  .submit-btn {
    display: block;
    margin: 10px auto 0;
    width: 200px;
    height: 40px;
    font-size: 20px;
  }
}
</style>
