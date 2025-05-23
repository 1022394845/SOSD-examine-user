import request from '@/utils/request'

// 登录
export const loginAPI = ({ account, password }) =>
  request.post('/user/login', { account, password })

// 注册
export const registerAPI = ({ account, password, email }) =>
  request.post('/user/login/register', { account, password, email })

// 验证账号已存在
export const isAccountExistAPI = (email) => request.get('/user/login/forget', { params: { email } })

// 获取验证码
export const getCodeAPI = (email) => request.get('/user/login/phrase', { params: { email } })

// 验证码校验
export const validateCodeAPI = ({ email, code }) =>
  request.get('/user/login/verify', { params: { email, code } })

// 修改密码
export const modifyPasswordAPI = ({ email, password }) =>
  request.put('/user/login/password', { email, password })

// 获取用户信息
export const getUserInfoAPI = (id) => request.get('/user/person', { params: { id } })

// 上传头像
export const uploadAvatarAPI = (file) =>
  request.post('/user/common/upload', file, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

// 修改个人信息
export const modifyUserInfoAPI = (data) => request.put('/user/person', data)

// 获取历史记录
export const getHistoryAPI = (id) => request.get('/user/person/history', { params: { id } })

// 获取用户发表的文章
export const getUserArticleAPI = (id) => request.get('/user/person/articles', { params: { id } })

// 删除文章
export const deleteArticleAPI = (id) => request.delete('/user/article', { id })
