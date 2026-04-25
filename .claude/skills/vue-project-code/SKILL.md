---
name: vue-project-code
description: >
  Viết, review, và refactor code Vue 3 + Vuetify 3 + Pinia + TypeScript theo chuẩn SOLID,
  không hard-code, layer-based architecture với ApiClient infrastructure layer và Vue Router.
  LUÔN dùng skill này khi user đề cập bất kỳ thứ nào sau: Vue, Vuetify, Pinia,
  Composition API, store, composable, TypeScript interface/type, ApiClient, service,
  Vue Router guard, defineStore, ref/reactive/computed, useRoute/useRouter,
  v-form, v-data-table, v-dialog, toast notification, vue-toastification, theme,
  vite-plugin-vuetify, hoặc bất kỳ yêu cầu nào liên quan đến frontend Vue 3 + Vuetify.
  Cũng trigger khi user paste code Vue/Pinia/TS và muốn review, refactor, tạo mới
  component, view, store, service, composable, hoặc hỏi về cấu trúc thư mục.
---

# Vue 3 + Vuetify 3 + Pinia + TypeScript — Production Skill

## Stack thực tế

| Package               | Version     | Ghi chú                                         |
| --------------------- | ----------- | ----------------------------------------------- |
| `vue`                 | ^3.5        | Composition API + `<script setup>`              |
| `vuetify`             | ^3.11       | UI, theme — **không dùng Tailwind**             |
| `vite-plugin-vuetify` | ^2.1        | Auto-import, **không** `import * as components` |
| `pinia`               | ^3.0        | Setup Store pattern                             |
| `vue-router`          | ^4.6        | SPA routing                                     |
| `axios`               | ^1.13       | HTTP client (devDeps)                           |
| `vue-toastification`  | ^2.0.0-rc.5 | Toast (devDeps) — thay Vuetify snackbar         |
| `@mdi/font`           | ^7.4        | Icons (devDeps)                                 |
| `sass`                | ^1.97       | SCSS (devDeps)                                  |

> ⚠️ `@tailwindcss/vite` có trong devDeps nhưng **không được dùng trong code** — chỉ Vuetify utilities + SCSS.

---

## Nguyên tắc cốt lõi

1. **Không hard-code** — URL, route, label, timeout, role, màu hex → `constants/`, `config/`, env, Vuetify theme
2. **SOLID** — Single Responsibility mỗi file; Dependency Inversion qua composables
3. **Type-safe hoàn toàn** — Không `any`. API response, props, emits đều có interface/type
4. **Layer flow** — `types → constants → infrastructure → services → stores → composables → components/views`
5. **Không logic trong template** — Template chỉ bind + emit; logic ở `<script setup>`
6. **Vuetify-first** — Vuetify components + theme colors; không inline style; không Tailwind
7. **Toast qua `useToast()`** — Không Vuetify snackbar, không gọi store trực tiếp từ view

---

## Cấu trúc thư mục

```
src/
├── types/
│   ├── api.types.ts              # ApiResponse<T>, PagedApiResponse<T>, RequestConfig
│   ├── auth.types.ts             # User, Permission, LoginRequest, AuthTokens, AuthSession
│   └── common.types.ts           # LoadingState, PaginatedResponse, ConfirmDialogOptions
├── constants/
│   ├── api.constants.ts          # API_ENDPOINTS
│   ├── app.constants.ts          # APP_NAME, ROUTE_NAMES, ROUTE_PATHS, USER_ROLES, DEFAULT_PAGINATION, TOAST_CONFIG
│   └── validation.constants.ts   # Form validation rules
├── models/                       # Re-export adapters từ types/ (không logic)
│   ├── api.models.ts             # re-export từ @/types/api.types
│   ├── auth.models.ts
│   └── [domain].models.ts
├── config/
│   └── http.config.ts            # BASE_URL, TIMEOUT từ env
├── infrastructure/               # HTTP plumbing — không import trực tiếp từ component/view
│   ├── http/
│   │   ├── api-client.ts         # ApiClient class singleton — KHÔNG phải Axios wrapper đơn giản
│   │   ├── http-headers.ts
│   │   └── loading.service.ts
│   ├── auth/
│   │   └── token.service.ts
│   ├── errors/
│   │   └── api-error-handler.ts
│   ├── config/
│   │   └── api.config.ts
│   ├── storage/
│   │   └── local-storage.ts
│   └── logger.ts
├── services/
│   ├── auth.service.ts           # Class AuthService, export singleton authService
│   ├── http.service.ts
│   └── [domain].service.ts       # Class [Domain]Service, export singleton
├── stores/
│   ├── auth.store.ts
│   ├── ui.store.ts               # Confirm dialog + global loading
│   └── [domain].store.ts
├── composables/
│   ├── useAuth.ts                # Wraps authService + authStore
│   ├── useToast.ts
│   ├── useConfirmDialog.ts
│   └── use[Domain].ts
├── data/                         # Business domain data (không phải app config)
│   ├── home.constants.ts         # Menu items, FAQs, benefits, steps
│   └── home.images.ts            # Image keys/paths
├── plugins/
│   ├── vuetify/                  # Full design token system
│   ├── toast/
│   └── index.ts                  # registerPlugins(app)
├── router/
│   ├── index.ts
│   ├── routes.ts
│   ├── guards.ts / guards/auth.guard.ts
│   ├── routes/
│   │   ├── public.routes.ts
│   │   ├── auth.routes.ts
│   │   └── admin.routes.ts
│   └── types.ts
├── layouts/
│   ├── AdminLayout.vue
│   ├── AuthLayout.vue
│   ├── BlankLayout.vue
│   └── DefaultLayout.vue
├── views/[Domain]View.vue         # Thin wrappers — logic ở composables/components
└── components/
    ├── common/
    │   ├── AppConfirmDialog.vue
    │   └── AppLoadingOverlay.vue
    ├── auth/                      # LoginForm.vue, RegisterForm.vue
    ├── home/                      # HomeNav, HomeHero, HomeAbout, ...
    └── [domain]/
```

> **`data/` vs `constants/`**: `constants/` = cấu hình app (routes, roles, pagination). `data/` = dữ liệu business domain (menu items, FAQs, images).  
> **`models/` vs `types/`**: `types/` = source of truth. `models/` = re-export adapter, không chứa logic.

---

## API Types — PascalCase fields

```typescript
// src/types/api.types.ts
export interface ApiResponse<T> {
  IsSuccess: boolean
  IsFailure: boolean
  Data: T
  Message: string | null
  Error: ApiError | null
  Metadata: ApiResponseMetadata | null
}

export interface PagedApiResponse<T> extends ApiResponse<T[]> {
  PageNumber: number
  PageSize: number
  TotalCount: number
  TotalPages: number
  HasPreviousPage: boolean
  HasNextPage: boolean
}

export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean
  skipErrorNotification?: boolean
  showLoading?: boolean
  cache?: boolean
  cacheTime?: number
}
```

> ⚠️ **PascalCase** cho tất cả API response fields — `IsSuccess`, `Data`, `Error`, không phải `isSuccess`, `data`.

---

## Infrastructure Layer — ApiClient

```typescript
// src/infrastructure/http/api-client.ts
class ApiClient {
  get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>
  getPaged<T>(url: string, config?: RequestConfig): Promise<PagedApiResponse<T>>
  post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>
  put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>
  patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>
  delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>
}
export const apiClient = new ApiClient()
```

`ApiClient` xử lý: 401 token refresh, exponential retry, in-memory cache, loading service. Không bao giờ dùng Axios trực tiếp trong service — luôn qua `apiClient`.

---

## Service Pattern — Class-based singleton

```typescript
// src/services/auth.service.ts
class AuthService {
  initialize(): void
  async login(payload: LoginRequest): Promise<AuthSession>
  async register(payload: RegisterRequest): Promise<User>
  async logout(): Promise<void>
  isAuthenticated(): boolean
  getUserRole(): UserRole | null
  hasPermission(permission: Permission): boolean
  hasAnyPermission(permissions: Permission[]): boolean
  hasAllPermissions(permissions: Permission[]): boolean
}
export const authService = new AuthService()
```

```typescript
// src/services/[domain].service.ts
class UserService {
  async getUsers(params?: PaginationParams): Promise<PagedApiResponse<User>>
  async createUser(payload: CreateUserPayload): Promise<ApiResponse<User>>
  // ...
}
export const userService = new UserService()
```

> Service gọi `apiClient.post(API_ENDPOINTS.AUTH.LOGIN, payload)` — không gọi Axios trực tiếp.

---

## Stores — Pinia Setup Store

```typescript
// src/stores/auth.store.ts
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const tokens = ref<AuthTokens | null>(null)

  const isAuthenticated = computed(() => !!user.value && !!tokens.value)
  const accessToken = computed(() => tokens.value?.accessToken ?? null)
  const refreshToken = computed(() => tokens.value?.refreshToken ?? null)
  const userRole = computed(() => user.value?.role ?? null)

  function setSession(session: AuthSession) { /* ... */ }
  function setUser(newUser: User) { /* ... */ }
  function clearSession() { /* ... */ }

  return { user, tokens, isAuthenticated, accessToken, refreshToken, userRole, setSession, setUser, clearSession }
})
```

---

## Composables

```typescript
// src/composables/useAuth.ts
export function useAuth() {
  const authStore = useAuthStore()
  const { isAuthenticated, currentUser } = storeToRefs(authStore)

  return {
    isAuthenticated,
    currentUser,
    can: (permission: Permission) => authService.hasPermission(permission),
    canAny: (permissions: Permission[]) => authService.hasAnyPermission(permissions),
    canAll: (permissions: Permission[]) => authService.hasAllPermissions(permissions),
    login: (payload: LoginRequest) => authService.login(payload),
    register: (payload: RegisterRequest) => authService.register(payload),
    logout: () => authService.logout(),
  }
}
```

**Permission check trong component/route:**
```typescript
const { can } = useAuth()
// Route meta:  permissions: [{ resource: 'users', action: 'read' }]
can({ resource: 'users', action: 'read' })
```

---

## Constants mẫu

```typescript
// src/constants/app.constants.ts
export const USER_ROLES = {
  ADMIN: 'admin',
  ORG_ADMIN: 'org_admin',
  SUPER_ADMIN: 'super_admin',
  CASHIER: 'cashier',
  USER: 'user',
} as const

export const ROUTE_NAMES = { HOME: 'home', LOGIN: 'login', DASHBOARD_HOME: 'dashboard-home' } as const
export const ROUTE_PATHS = { HOME: '/', LOGIN: '/auth/login', ADMIN: '/admin' } as const

export const DEFAULT_PAGINATION = { PAGE: 1, LIMIT: 10, LIMIT_OPTIONS: [10, 25, 50, 100] } as const
export const TOAST_CONFIG = { TIMEOUT: 3000 } as const
export const CONFIRM_DIALOG_DEFAULTS = {
  CONFIRM_TEXT: 'Xác nhận',
  CANCEL_TEXT: 'Hủy',
  CONFIRM_COLOR: 'error',
} as const
```

---

## Composables quan trọng

```typescript
// src/composables/useToast.ts
export function useToast() {
  const toast = useToastification()
  return {
    success: (msg: string) => toast.success(msg),
    error: (msg: string) => toast.error(msg),
    warning: (msg: string) => toast.warning(msg),
    info: (msg: string) => toast.info(msg),
  }
}
```

```typescript
// src/composables/useConfirmDialog.ts
export function useConfirmDialog() {
  const uiStore = useUiStore()
  return {
    confirm: (options: ConfirmDialogOptions) => uiStore.openConfirmDialog(options),
  }
}
```

**Mẫu domain composable:**

```typescript
// src/composables/useUser.ts
export function useUser() {
  const store = useUserStore()
  const { users, total, loadingState } = storeToRefs(store)
  const toast = useToast()
  const { confirm } = useConfirmDialog()

  const isLoading = computed(() => loadingState.value === 'loading')

  async function removeUser(id: number) {
    const ok = await confirm({ title: 'Xóa người dùng?', message: 'Hành động này không thể hoàn tác.' })
    if (!ok) return
    try {
      await store.deleteUser(id)
      toast.success('Xóa thành công')
    } catch {
      toast.error('Xóa thất bại')
    }
  }

  return { users, total, isLoading, fetchUsers: store.fetchUsers, removeUser }
}
```

---

## View Pattern — Thin wrapper

```vue
<!-- src/views/UsersView.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useUser } from '@/composables/useUser'
import UsersDataTable from '@/components/users/UsersDataTable.vue'

const { users, total, isLoading, fetchUsers } = useUser()
onMounted(fetchUsers)
</script>

<template>
  <v-container>
    <UsersDataTable :users="users" :total="total" :loading="isLoading" />
  </v-container>
</template>
```

> View không chứa business logic, không import service trực tiếp, không gọi `apiClient`.

---

## App.vue pattern

```vue
<script setup lang="ts">
import AppConfirmDialog from '@/components/common/AppConfirmDialog.vue'
import AppLoadingOverlay from '@/components/common/AppLoadingOverlay.vue'
</script>

<template>
  <v-app>
    <router-view />
    <AppConfirmDialog />
    <AppLoadingOverlay />
  </v-app>
</template>
```

---

## Quick-ref: Patterns

| Situation                          | ✅ Đúng                                  | ❌ Sai                              |
| ---------------------------------- | ---------------------------------------- | ----------------------------------- |
| Destructure store                  | `storeToRefs(store)`                     | `const { x } = useStore()`          |
| Notification                       | `useToast().success(...)`                | `uiStore.showSnackbar(...)`         |
| Confirm                            | `await confirm({...})`                   | inline `v-dialog` trong view        |
| HTTP call                          | `apiClient.get/post/...`                 | `axios.get(...)` trực tiếp          |
| HTTP call trong component          | qua composable                           | import service trực tiếp            |
| API response field                 | `response.IsSuccess`, `response.Data`    | `response.isSuccess`, `response.data` |
| Role check                         | `USER_ROLES.ADMIN`                       | `'admin'` string literal            |
| Permission check                   | `can({ resource: 'x', action: 'read' })` | hard-code role string               |
| Màu sắc                            | `color="primary"`                        | `style="color: #1976D2"`            |
| Loading state                      | `LoadingState` type                      | `isLoading` boolean                 |
| Derived state                      | `computed(...)`                          | method không cache                  |
| Pagination                         | `v-data-table-server`                    | load all rồi phân trang client      |
| Store style                        | Setup Store                              | Options Store                       |
| Service                            | class + export singleton                 | functional export                   |

---

## Checklist output

- [ ] Không hard-code: URL, route path, role string, màu hex, timeout
- [ ] Không `any` type
- [ ] Không Tailwind — Vuetify utilities + SCSS
- [ ] Toast dùng `useToast()`, không Vuetify snackbar
- [ ] `storeToRefs` khi destructure state/getters từ store
- [ ] API response fields dùng PascalCase: `IsSuccess`, `Data`, `Error`
- [ ] HTTP calls qua `apiClient`, không Axios trực tiếp
- [ ] Service là class-based singleton, export `const xyzService = new XyzService()`
- [ ] View là thin wrapper — logic ở composables, component
- [ ] Validation rules từ `validation.constants.ts`
- [ ] Vuetify plugin qua `vite-plugin-vuetify` (không `import * as components`)
- [ ] Error state được xử lý (không chỉ happy path)
- [ ] Store không import component; Component không import service/apiClient trực tiếp

---

## References

Đọc thêm khi cần chi tiết:

- `references/layers.md` — HTTP Service, Router, Auth Store, Layout, Env
- `references/patterns.md` — ✅/❌ patterns đầy đủ, file naming, responsibility matrix
- `references/plugins.md` — Vuetify + Toast plugin setup chi tiết
