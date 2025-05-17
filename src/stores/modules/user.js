import { getUserInfoAPI } from '@/api/user'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'sosd-user',
  () => {
    const userId = ref()
    const token = ref('')
    const userInfo = ref({})

    const onLogin = ({ id: newId, token: newToken }) => {
      userId.value = newId
      token.value = newToken
      getUserInfo()
    }

    const onLogout = () => {
      userId.value = null
      token.value = ''
      userInfo.value = {}
    }

    const getUserInfo = async () => {
      const { data } = await getUserInfoAPI(userId.value)
      userInfo.value = { ...data }
    }

    return {
      userId,
      token,
      userInfo,
      onLogin,
      onLogout,
      getUserInfo
    }
  },
  {
    persist: {
      pick: ['userId', 'token']
    }
  }
)
