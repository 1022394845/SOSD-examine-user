<script setup>
import ArticleEditor from '@/components/ArticleEditor.vue'
import { useArticleStore } from '@/stores'

// 表单
const form = ref()
const formModel = ref({})
// 校验规则
const rules = {
  title: [{ required: true, message: '标题不可为空', trigger: 'blur' }],
  category: [{ required: true, message: '分类不可为空', trigger: 'blur' }]
}

const { categoryList } = useArticleStore()
</script>

<template>
  <div class="publish-page">
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
        <el-input-tag v-model="formModel.tag" placeholder="请输入文章标签" />
      </el-form-item>
    </el-form>
    <ArticleEditor />
  </div>
</template>

<style scoped lang="scss">
.publish-page {
  padding: 20px;
}
</style>
