<script setup>
import { modifyUserInfoAPI, uploadAvatarAPI } from '@/api/user'
import { useUserStore } from '@/stores'
import { Plus } from '@element-plus/icons-vue'

const formModel = ref({})
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱号', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: '请输入正确的邮箱号',
      trigger: 'blur'
    }
  ]
}

const userStore = useUserStore()
const loading = ref(true)
onMounted(async () => {
  // 重置表单内容
  loading.value = true
  if (!userStore.userInfo.id) await userStore.getUserInfo()
  formModel.value = { ...userStore.userInfo }
  loading.value = false
})

// 更改头像
const imageFile = ref()
const onChangeImage = (file) => {
  imageFile.value = file
  formModel.value.image = URL.createObjectURL(file.raw)
}

// 保存
const form = ref()
const submit = async () => {
  await form.value.validate()
  const loading = ElLoading.service({
    lock: true,
    text: '上传中',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  if (imageFile.value) {
    // 头像有更改
    const url = await uploadAvatarAPI(imageFile.value)
    formModel.value.image = url
  }
  await modifyUserInfoAPI(formModel.value)
  await userStore.getUserInfo() // 刷新个人信息
  formModel.value = { ...userStore.userInfo }
  loading.close()
  ElMessage.success('修改成功')
}
</script>

<template>
  <div class="profile-page">
    <div class="title">个人信息</div>
    <el-divider />
    <el-form
      ref="form"
      :model="formModel"
      :rules="rules"
      label-width="auto"
      hide-required-asterisk
      v-loading="loading"
    >
      <el-form-item label="编号">
        <el-input v-model="formModel.id" disabled />
      </el-form-item>
      <el-form-item label="昵称" prop="username">
        <el-input v-model="formModel.username" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formModel.email" />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="formModel.gender">
          <el-radio :value="1">男</el-radio>
          <el-radio :value="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onChangeImage"
        >
          <img v-if="formModel.image" :src="formModel.image" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="submit">保存修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.profile-page {
  .title {
    padding: 16px 20px;
    line-height: 24px;
    font-size: 18px;
    font-weight: 500;
  }

  .el-divider {
    margin: 0 0 10px;
  }

  .el-form {
    padding: 10px 20px;
    width: 600px;

    :deep(.avatar-uploader) {
      .avatar {
        display: block;
        width: 100px;
        height: 100px;
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
        width: 100px;
        height: 100px;
        font-size: 28px;
        color: #8c939d;
        text-align: center;
      }
    }
  }
}
</style>
