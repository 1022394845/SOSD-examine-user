<script setup>
import {
  getCodeAPI,
  isAccountExistAPI,
  loginAPI,
  modifyPasswordAPI,
  registerAPI,
  validateCodeAPI
} from '@/api/user'
import { useUserStore } from '@/stores'

const defaultForm = {
  account: '',
  password: '',
  email: '',
  code: ''
}
const form = ref()
const formModel = ref({})
const rules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱号', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: '请输入正确的邮箱号',
      trigger: 'blur'
    }
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  repassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('请确认两次密码是否一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 状态：0-登录 1-注册 2-重置
const status = ref(0)
const statusInfo = ['登录', '注册', '重置']
const changeStatus = (index) => {
  formModel.value = { ...defaultForm }
  if (form.value) form.value.resetFields()
  status.value = index
}

const dialogVisible = ref(false)
const open = () => {
  if (form.value) form.value.resetFields()
  formModel.value = { ...defaultForm }
  dialogVisible.value = true
}
defineExpose({ open })

// 获取验证码
const codeLoading = ref(false)
const codeCountdown = ref(0)
let timer = null
const getCode = async () => {
  await form.value.validateField('email')
  codeLoading.value = true
  try {
    const { code } = await isAccountExistAPI(formModel.value.email)
    if (!code) {
      ElMessage.error('账号不存在')
      throw new Error()
    }
    await getCodeAPI(formModel.value.email)
    ElMessage.success('发送验证码成功')
    codeCountdown.value = 10
    timer = setInterval(() => {
      codeCountdown.value--
      if (codeCountdown.value === 0) {
        clearInterval(timer)
        codeLoading.value = false
      }
    }, 1000)
  } catch {
    codeLoading.value = false
  }
}

const loading = ref(false)
const emit = defineEmits(['success'])
const submit = async () => {
  await form.value.validate()
  loading.value = true
  try {
    if (status.value === 0) {
      const userStore = useUserStore()
      const { data } = await loginAPI(formModel.value)
      userStore.onLogin(data)
      await userStore.getUserInfo()
      emit('success')
      dialogVisible.value = false
    } else {
      await validateCodeAPI(formModel.value)
      if (status.value === 1) await registerAPI(formModel.value)
      else await modifyPasswordAPI(formModel.value)
    }
  } finally {
    loading.value = false
  }
  ElMessage.success(`${statusInfo[status.value]}成功`)
  changeStatus(0)
}
</script>

<template>
  <div class="login-dialog">
    <el-dialog v-model="dialogVisible" width="30%">
      <template #header>
        <div class="title">登录SOSD博客平台</div>
      </template>
      <template #default>
        <div class="type">
          <div
            v-for="(info, index) in statusInfo.slice(0, 2)"
            :key="index"
            class="op"
            :class="{ active: status === index }"
            @click="changeStatus(index)"
          >
            {{ info }}
          </div>
        </div>
        <el-form ref="form" class="form" :model="formModel" :rules="rules">
          <el-form-item v-if="status < 2" prop="account">
            <el-input v-model="formModel.account" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item v-if="status > 0" prop="email">
            <el-input v-model="formModel.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item v-if="status > 0" prop="code">
            <el-input v-model="formModel.code" placeholder="请输入验证码" />
            <el-button class="inline" @click="getCode" :disabled="codeLoading">
              {{ codeLoading && codeCountdown ? `${codeCountdown}秒后重新获取` : '获取验证码' }}
            </el-button>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="formModel.password"
              placeholder="请输入密码"
              maxlength="40"
              type="password"
            />
            <el-button v-if="status === 0" class="inline" @click="status = 2">忘记密码</el-button>
          </el-form-item>
          <el-form-item v-if="status > 0" prop="repassword">
            <el-input
              v-model="formModel.repassword"
              placeholder="请再次确认密码"
              maxlength="40"
              type="password"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="submit"
              size="large"
              @click="submit"
              :disabled="loading"
            >
              {{ statusInfo[status] }}
            </el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.title {
  font-size: 20px;
  font-weight: 500;
}

:deep(.el-dialog__header) {
  position: relative;

  .el-dialog__headerbtn {
    top: -5px;
    font-size: 20px;
  }
}

:deep(.el-dialog__body) {
  border-top: 1px solid var(--el-border-color);
  padding-top: 20px;

  .type {
    display: flex;
    justify-content: center;
    font-size: 16px;
    color: #333333;

    .op {
      margin: 0 20px 10px;
      padding-bottom: 5px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover,
      &.active {
        color: var(--el-color-primary);
      }
    }
  }

  .form {
    margin-top: 10px;

    .el-form-item {
      position: relative;

      .inline {
        position: absolute;
        right: 0;
        top: 2px;
        font-weight: 400;
        background: transparent;
        border: none;
      }

      .submit {
        width: 100%;
        font-size: 20px;
      }
    }
  }
}
</style>
