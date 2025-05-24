import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout/index.vue'
import Home from '@/views/Home/index.vue'
import User from '@/views/User/index.vue'
import Search from '@/views/Search/index.vue'
import Article from '@/views/Article/index.vue'
import ProfilePage from '@/views/User/Pages/ProfilePage.vue'
import ArticlePage from '@/views/User/Pages/ArticlePage.vue'
import StarPgae from '@/views/User/Pages/StarPgae.vue'
import HistoryPage from '@/views/User/Pages/HistoryPage.vue'
import PublishPage from '@/views/User/Pages/PublishPage.vue'

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
              component: ProfilePage
            },
            {
              path: 'article',
              component: ArticlePage
            },
            {
              path: 'star',
              component: StarPgae
            },
            {
              path: 'history',
              component: HistoryPage
            },
            {
              path: 'publish',
              component: PublishPage
            }
          ]
        },
        {
          path: '/post',
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
