import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/content/content.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

/**
 * 路由守卫
 */
router.beforeEach((to, from, next) => {
  let token = sessionStorage.getItem('token')
  
  if (to.name === 'login') {
    if (!token) {
      next()
    } else {
      next({ path: from.path })
    }
  } else {
    if (!token) {
      next({
        path:'login'
      })
    } else {
      next()
    }
  }
})

export default router
