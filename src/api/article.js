import request from '@/utils/request'

// 获取文章列表
export const getArticleListAPI = (pageInfo, config) =>
  request.get('/user/homepage/articles', { params: { ...pageInfo, ...config } })

// 获取热点文章列表
export const getHotListAPI = () => request.get('/user/homepage/hot')

// 分页获取搜索列表
export const getSearchListAPI = (pageInfo, config) =>
  request.get('/user/homepage/search', { params: { ...pageInfo, ...config } })

// 获取文章详情
export const getArticleDetailAPI = (id) => request.get('/users/article', { params: { id } })
