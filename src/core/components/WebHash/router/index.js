import { createRouter, createWebHashHistory } from 'vue-router'

import init from './modules/init'
import Designer from './modules/designer'
import login from './modules/login'
/* 菜单栏的路由 */
// 固定菜单
export const fixedRoutes = [
  ...init,
  ...Designer,
  ...login
]

// 动态菜单
export const asyncRoutes = []

const router = createRouter({
  history: createWebHashHistory(),
  routes: fixedRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { left: 0, top: 0 }
    }
  }
})

export default router
