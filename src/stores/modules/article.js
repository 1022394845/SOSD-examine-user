import { defineStore } from 'pinia'

export const useArticleStore = defineStore('sosd-article', () => {
  const categoryList = [
    { name: 'recommended', label: '综合' },
    { name: 'frontend', label: '前端' },
    { name: 'backend', label: '后端' },
    { name: 'android', label: '安卓' },
    { name: 'ios', label: 'iOS' },
    { name: 'ai', label: '人工智能' }
  ]

  return {
    categoryList
  }
})
