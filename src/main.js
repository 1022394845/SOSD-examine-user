import { createApp } from 'vue'
import pinia from '@/stores/index'

import App from './App.vue'
import router from './router'

// 默认样式
import '@/styles/common.scss'

// iconfont字体图标
import VIcon from '@/components/v-icon/index.vue'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.component('v-icon', VIcon)

app.mount('#app')
