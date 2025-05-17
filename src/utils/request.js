import axios from 'axios'

const baseURL = 'https://m1.apifoxmock.com/m1/6121716-5813353-default' // 基地址

const request = axios.create({
  baseURL,
  timeout: 10000, // 连接超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加请求拦截器
request.interceptors.request.use(
  (config) => {
    // 发送请求之前
    return config
  },
  (error) => {
    // 对请求错误处理
    return Promise.reject(error)
  }
)

// 添加响应拦截器
request.interceptors.response.use(
  (response) => {
    // 摘取核心响应数据
    if (response?.status >= 200 && response?.status < 300) {
      return response.data
    }
    // 处理业务失败
    ElMessage.error(response?.data.msg || '服务异常')
    return Promise.reject(response.data)
  },
  (error) => {
    // 401: token失效或无权限访问
    if (error.response?.status === 401) router.push('/login')
    // 默认错误
    ElMessage.error(error.response?.data.msg || '服务异常')
    return Promise.reject(error)
  }
)

export default request
export { baseURL }
