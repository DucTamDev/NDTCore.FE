import { createRouter, createWebHistory } from 'vue-router'
import { APP_NAME } from '@/constants/app.constants'
import { routes } from './routes'
import { authGuard } from './guards/auth.guard'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: (_to, _from, savedPosition) => savedPosition ?? { top: 0 },
})

router.beforeEach((to) => {
  document.title = `${to.meta.title || APP_NAME} | ${APP_NAME}`
})

router.beforeEach(authGuard)
