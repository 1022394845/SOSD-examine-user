// 管理分页获取列表
export const usePagination = () => {
  // 分页信息
  const pageInfo = ref({
    page: 0,
    pageSize: 10
  })
  // 列表总长度
  const total = ref(0)
  const totalPage = computed(() => Math.ceil(total.value / pageInfo.value.pageSize) || 0)
  // 禁用加载
  const disableLoad = computed(() => {
    return pageInfo.value.page > 0 && pageInfo.value.page >= totalPage.value
  })
  // 回调函数
  let callback = null
  // 加载效果
  const loading = ref(false)
  // 注册回调
  const registerCallback = (newCallback) => {
    const prevCallback = callback
    callback = newCallback
    callback() // 注册后立即执行一次
    // 注销清理
    return prevCallback
  }
  // 重置分页
  const resetPage = () => {
    pageInfo.value = {
      page: 0,
      pageSize: 10
    }
  }
  // 下一页
  const nextPage = () => {
    if (total.value != -1 && pageInfo.value.page >= totalPage.value) return
    pageInfo.value.page++
    if (callback) callback()
  }
  // 上一页
  const prevPage = () => {
    if (pageInfo.value.page <= 0) return
    pageInfo.value.page--
    if (callback) callback()
  }

  return {
    pageInfo,
    total,
    loading,
    disableLoad,
    registerCallback,
    resetPage,
    nextPage,
    prevPage
  }
}
