---
name: vue-project-code
description: >
  Viết, review, và refactor code Vue 3 + Vuetify 3 + Pinia + TypeScript theo chuẩn SOLID,
  không hard-code, layer-based architecture với Axios API layer và Vue Router.
  LUÔN dùng skill này khi user đề cập bất kỳ thứ nào sau: Vue, Vuetify, Pinia,
  Composition API, store, composable, TypeScript interface/type, Axios service,
  Vue Router guard, defineStore, ref/reactive/computed, useRoute/useRouter,
  v-form, v-data-table, v-dialog, toast notification, vue-toastification, theme,
  vite-plugin-vuetify, hoặc bất kỳ yêu cầu nào liên quan đến frontend Vue 3 + Vuetify.
  Cũng trigger khi user paste code Vue/Pinia/TS và muốn review, refactor, tạo mới
  component, view, store, service, hoặc composable.
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
4. **Layer flow** — `types → constants → services → stores → composables → components/views`
5. **Không logic trong template** — Template chỉ bind + emit; logic ở `<script setup>`
6. **Vuetify-first** — Vuetify components + theme colors; không inline style; không Tailwind
7. **Toast qua `useToast()`** — Không Vuetify snackbar, không gọi store trực tiếp từ view

---

## Cấu trúc thư mục

```
src/
├── constants/
│   ├── api.constants.ts          # API endpoints
│   ├── app.constants.ts          # Route names, roles, pagination, toast, theme
│   └── validation.constants.ts   # Form validation rules
├── types/
│   ├── common.types.ts           # LoadingState, PaginatedResponse, ConfirmDialogOptions
│   └── [domain].types.ts         # Mỗi domain một file
├── config/
│   └── http.config.ts            # BASE_URL, TIMEOUT từ env
├── plugins/
│   ├── vuetify.ts
│   ├── toast.ts
│   └── index.ts                  # registerPlugins(app)
├── services/
│   ├── http.service.ts           # Axios instance + interceptors
│   └── [domain].service.ts
├── stores/
│   ├── ui.store.ts               # Confirm dialog + global loading
│   ├── auth.store.ts
│   └── [domain].store.ts
├── composables/
│   ├── useToast.ts
│   ├── useConfirmDialog.ts
│   └── use[Domain].ts
├── router/
│   ├── index.ts
│   ├── routes.ts
│   └── guards/auth.guard.ts
├── layouts/DefaultLayout.vue
├── views/[Domain]View.vue
└── components/
    ├── common/
    │   ├── AppConfirmDialog.vue
    │   └── AppLoadingOverlay.vue
    └── [domain]/
```

---

## Types cốt lõi

```typescript
// src/types/common.types.ts
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface ConfirmDialogOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmColor?: string
}
```

---

## Constants mẫu

```typescript
// src/constants/app.constants.ts
export const ROUTE_NAMES = {
  HOME: 'home',
  LOGIN: 'login',
} as const

export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const

export const APP_THEME = { DEFAULT: 'light', DARK: 'dark', LIGHT: 'light' } as const
export const DEFAULT_PAGINATION = { PAGE: 1, LIMIT: 10, LIMIT_OPTIONS: [10, 25, 50, 100] } as const
export const TOAST_CONFIG = { TIMEOUT: 3000 } as const
export const CONFIRM_DIALOG_DEFAULTS = {
  CONFIRM_TEXT: 'Xác nhận',
  CANCEL_TEXT: 'Hủy',
  CONFIRM_COLOR: 'error',
} as const
```

```typescript
// src/constants/validation.constants.ts
export const VALIDATION_RULES = {
  required:
    (label = 'Trường này') =>
    (v: unknown) =>
      !!v || `${label} là bắt buộc`,
  maxLength: (max: number) => (v: string) => !v || v.length <= max || `Tối đa ${max} ký tự`,
  minLength: (min: number) => (v: string) => !v || v.length >= min || `Tối thiểu ${min} ký tự`,
  email: (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email không hợp lệ',
} as const
```

---

## Composables quan trọng

```typescript
// src/composables/useToast.ts
import { useToast as useToastification } from 'vue-toastification'

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
import { useUiStore } from '@/stores/ui.store'
import type { ConfirmDialogOptions } from '@/types/common.types'

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
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user.store'
import { useToast } from './useToast'
import { useConfirmDialog } from './useConfirmDialog'
import type { CreateUserPayload } from '@/types/user.types'

export function useUser() {
  const store = useUserStore()
  const { users, total, loadingState } = storeToRefs(store)
  const toast = useToast()
  const { confirm } = useConfirmDialog()

  const isLoading = computed(() => loadingState.value === 'loading')

  async function removeUser(id: number) {
    const ok = await confirm({
      title: 'Xóa người dùng?',
      message: 'Hành động này không thể hoàn tác.',
    })
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

> Không có `AppSnackbar` — toast được inject qua `vue-toastification` plugin.

---

## Quick-ref: Patterns

| Situation                 | ✅ Đúng                   | ❌ Sai                         |
| ------------------------- | ------------------------- | ------------------------------ |
| Destructure store         | `storeToRefs(store)`      | `const { x } = useStore()`     |
| Notification              | `useToast().success(...)` | `uiStore.showSnackbar(...)`    |
| Confirm                   | `await confirm({...})`    | inline `v-dialog` trong view   |
| HTTP call trong component | qua composable            | import service trực tiếp       |
| Role check                | `USER_ROLES.ADMIN`        | `'admin'` string literal       |
| Màu sắc                   | `color="primary"`         | `style="color: #1976D2"`       |
| Loading state             | `LoadingState` type       | `isLoading` boolean            |
| Derived state             | `computed(...)`           | method không cache             |
| Pagination                | `v-data-table-server`     | load all rồi phân trang client |
| Store style               | Setup Store               | Options Store                  |

---

## Checklist output

- [ ] Không hard-code: URL, route path, role string, màu hex, timeout
- [ ] Không `any` type
- [ ] Không Tailwind — Vuetify utilities + SCSS
- [ ] Toast dùng `useToast()`, không Vuetify snackbar
- [ ] `storeToRefs` khi destructure state/getters từ store
- [ ] Validation rules từ `validation.constants.ts`
- [ ] Vuetify plugin qua `vite-plugin-vuetify` (không `import * as components`)
- [ ] Error state được xử lý (không chỉ happy path)
- [ ] Store không import component; Component không import service trực tiếp

---

## References

Đọc thêm khi cần chi tiết:

- `references/layers.md` — HTTP Service, Router, Auth Store, Layout, Env
- `references/patterns.md` — ✅/❌ patterns đầy đủ, file naming, responsibility matrix
- `references/plugins.md` — Vuetify + Toast plugin setup chi tiết
