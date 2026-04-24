import type { RouteRecordRaw } from 'vue-router'
import { adminRoutes } from './admin.routes'
import { authRoutes } from './auth.routes'
import { publicRoutes } from './public.routes'

export const routes: RouteRecordRaw[] = [...publicRoutes, ...authRoutes, ...adminRoutes]
