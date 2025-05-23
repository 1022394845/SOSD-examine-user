import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout/index.vue'
import Home from '@/views/Home/index.vue'
import User from '@/views/User/index.vue'
import Search from '@/views/Search/index.vue'
import Article from '@/views/Article/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: Home
        },
        {
          path: '/user',
          component: User,
          redirect: '/user/profile',
          children: [
            {
              path: 'profile',
              component: () => import('@/views/User/Pages/ProfilePage.vue')
            },
            {
              path: 'article',
              component: () => import('@/views/User/Pages/ArticlePage.vue')
            },
            {
              path: 'star',
              component: () => import('@/views/User/Pages/StarPgae.vue')
            },
            {
              path: 'history',
              component: () => import('@/views/User/Pages/HistoryPage.vue')
            },
            {
              path: 'publish',
              component: () => import('@/views/User/Pages/PublishPage.vue')
            }
          ]
        },
        {
          path: '/article',
          component: Article
        },
        {
          path: '/search',
          component: Search
        }
      ]
    }
  ],
  // 路由视口置顶
  scrollBehavior() {
    return {
      top: 0
    }
  }
})

export default router
