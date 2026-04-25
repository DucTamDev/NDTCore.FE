# Layer Reference — Vue 3 + Vuetify + Pinia + TypeScript

## HTTP Config

```typescript
// src/config/http.config.ts
export const HTTP_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL as string,
  TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT ?? 10_000),
  HEADERS: { 'Content-Type': 'application/json' },
} as const
```

## HTTP Service (Axios)

```typescript
// src/services/http.service.ts
import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { HTTP_CONFIG } from '@/config/http.config'
import { ROUTE_NAMES } from '@/constants/app.constants'

let authStoreInstance: ReturnType<typeof import('@/stores/auth.store').useAuthStore> | null = null

function getAuthStore() {
  if (!authStoreInstance) {
    // Lazy import — tránh circular dependency
    const { useAuthStore } = require('@/stores/auth.store')
    authStoreInstance = useAuthStore()
  }
  return authStoreInstance!
}

const instance: AxiosInstance = axios.create({
  baseURL: HTTP_CONFIG.BASE_URL,
  timeout: HTTP_CONFIG.TIMEOUT,
  headers: HTTP_CONFIG.HEADERS,
})

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const authStore = getAuthStore()
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
  }
  return config
})

// Token refresh logic
let isRefreshing = false
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token!)))
  failedQueue = []
}

instance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return instance(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const authStore = getAuthStore()
        const newToken = await authStore.refreshToken()
        processQueue(null, newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return instance(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        const authStore = getAuthStore()
        authStore.clearSession()
        const router = (await import('@/router')).default
        router.push({ name: ROUTE_NAMES.LOGIN })
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export const httpService = instance
```

## Service mẫu

```typescript
// src/services/user.service.ts
import { httpService } from './http.service'
import { API_ENDPOINTS } from '@/constants/api.constants'
import type { User, CreateUserPayload, UpdateUserPayload } from '@/types/user.types'
import type { PaginatedResponse } from '@/types/common.types'

export const userService = {
  async getAll(page: number, limit: number): Promise<PaginatedResponse<User>> {
    const { data } = await httpService.get<PaginatedResponse<User>>(
      API_ENDPOINTS.USERS.BASE,
      { params: { page, limit } },
    )
    return data
  },
  async getById(id: number): Promise<User> {
    const { data } = await httpService.get<User>(API_ENDPOINTS.USERS.BY_ID(id))
    return data
  },
  async create(payload: CreateUserPayload): Promise<User> {
    const { data } = await httpService.post<User>(API_ENDPOINTS.USERS.BASE, payload)
    return data
  },
  async update({ id, ...payload }: UpdateUserPayload): Promise<User> {
    const { data } = await httpService.patch<User>(API_ENDPOINTS.USERS.BY_ID(id), payload)
    return data
  },
  async remove(id: number): Promise<void> {
    await httpService.delete(API_ENDPOINTS.USERS.BY_ID(id))
  },
}
```

---

## Auth Store

```typescript
// src/stores/auth.store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { httpService } from '@/services/http.service'
import { API_ENDPOINTS } from '@/constants/api.constants'
import type { UserRole } from '@/types/user.types'

interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'))
  const _refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const userRole = ref<UserRole>('viewer')

  const isAuthenticated = computed(() => !!accessToken.value)

  function setTokens(tokens: AuthTokens) {
    accessToken.value = tokens.accessToken
    _refreshToken.value = tokens.refreshToken
    localStorage.setItem('accessToken', tokens.accessToken)
    localStorage.setItem('refreshToken', tokens.refreshToken)
  }

  async function refreshToken(): Promise<string> {
    const { data } = await httpService.post<AuthTokens>(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken: _refreshToken.value,
    })
    setTokens(data)
    return data.accessToken
  }

  function clearSession() {
    accessToken.value = null
    _refreshToken.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  return { accessToken, userRole, isAuthenticated, setTokens, refreshToken, clearSession }
})
```

## UI Store

```typescript
// src/stores/ui.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { CONFIRM_DIALOG_DEFAULTS } from '@/constants/app.constants'
import type { ConfirmDialogOptions } from '@/types/common.types'

export const useUiStore = defineStore('ui', () => {
  const confirmDialog = ref({
    show: false,
    title: '',
    message: '',
    confirmText: CONFIRM_DIALOG_DEFAULTS.CONFIRM_TEXT,
    cancelText: CONFIRM_DIALOG_DEFAULTS.CANCEL_TEXT,
    confirmColor: CONFIRM_DIALOG_DEFAULTS.CONFIRM_COLOR,
    resolve: null as ((confirmed: boolean) => void) | null,
  })

  function openConfirmDialog(options: ConfirmDialogOptions): Promise<boolean> {
    return new Promise(resolve => {
      confirmDialog.value = {
        show: true,
        title: options.title,
        message: options.message,
        confirmText: options.confirmText ?? CONFIRM_DIALOG_DEFAULTS.CONFIRM_TEXT,
        cancelText: options.cancelText ?? CONFIRM_DIALOG_DEFAULTS.CANCEL_TEXT,
        confirmColor: options.confirmColor ?? CONFIRM_DIALOG_DEFAULTS.CONFIRM_COLOR,
        resolve,
      }
    })
  }

  function resolveConfirmDialog(confirmed: boolean) {
    confirmDialog.value.resolve?.(confirmed)
    confirmDialog.value.show = false
  }

  const isGlobalLoading = ref(false)
  function setGlobalLoading(value: boolean) {
    isGlobalLoading.value = value
  }

  return { confirmDialog, openConfirmDialog, resolveConfirmDialog, isGlobalLoading, setGlobalLoading }
})
```

---

## Router

```typescript
// src/router/routes.ts
import { ROUTE_NAMES } from '@/constants/app.constants'
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: ROUTE_NAMES.HOME, component: () => import('@/views/HomeView.vue') },
    ],
  },
  {
    path: '/login',
    name: ROUTE_NAMES.LOGIN,
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
]
```

```typescript
// src/router/guards/auth.guard.ts
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { ROUTE_NAMES } from '@/constants/app.constants'
import type { UserRole } from '@/types/user.types'

export function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
): void {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth === false) {
    if (authStore.isAuthenticated && to.name === ROUTE_NAMES.LOGIN) {
      return next({ name: ROUTE_NAMES.HOME })
    }
    return next()
  }

  if (!authStore.isAuthenticated) {
    return next({ name: ROUTE_NAMES.LOGIN, query: { redirect: to.fullPath } })
  }

  const requiredRoles = to.meta.roles as UserRole[] | undefined
  if (requiredRoles?.length && !requiredRoles.includes(authStore.userRole)) {
    return next({ name: ROUTE_NAMES.HOME })
  }

  next()
}
```

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { authGuard } from './guards/auth.guard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: (_to, _from, savedPosition) => savedPosition ?? { top: 0 },
})

router.beforeEach(authGuard)
export default router
```

---

## DefaultLayout

```vue
<!-- src/layouts/DefaultLayout.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { ROUTE_NAMES } from '@/constants/app.constants'

const router = useRouter()
const authStore = useAuthStore()
const drawer = ref(true)

const navItems = [
  { title: 'Trang chủ', icon: 'mdi-home', route: ROUTE_NAMES.HOME },
] as const

async function logout() {
  authStore.clearSession()
  router.push({ name: ROUTE_NAMES.LOGIN })
}
</script>

<template>
  <v-navigation-drawer v-model="drawer">
    <v-list nav>
      <v-list-item
        v-for="item in navItems"
        :key="item.route"
        :prepend-icon="item.icon"
        :title="item.title"
        :to="{ name: item.route }"
        rounded="lg"
      />
    </v-list>
    <template #append>
      <v-list nav>
        <v-list-item prepend-icon="mdi-logout" title="Đăng xuất" rounded="lg" @click="logout" />
      </v-list>
    </template>
  </v-navigation-drawer>

  <v-app-bar>
    <v-app-bar-nav-icon @click="drawer = !drawer" />
    <v-app-bar-title>App Name</v-app-bar-title>
  </v-app-bar>

  <v-main>
    <router-view />
  </v-main>
</template>
```

---

## Env Variables

```env
# .env
VITE_API_BASE_URL=https://api.example.com/v1
VITE_API_TIMEOUT=10000

# .env.development
VITE_API_BASE_URL=http://localhost:3000/v1

# .env.production
VITE_API_BASE_URL=https://api.example.com/v1
```

> Không bao giờ hard-code URL hay timeout. Dùng `import.meta.env.VITE_*`.