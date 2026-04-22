---
name: vue-module-view-architecture
description: >
  Kiến trúc Vue 3 phân layer chuẩn: views/ (page-level) · modules/ (feature
  logic + components) · shared/ (UI chung) · core/ (infrastructure) · app/
  (bootstrapping). Dùng skill này TRƯỚC KHI tạo bất kỳ file hoặc thư mục mới
  trong dự án Vue 3. Trigger khi người dùng hỏi về: cấu trúc dự án, đặt file
  ở đâu, tạo module mới, refactor page thành module, import rules, thin view,
  barrel export, composable, store, module auth/home/user, hoặc bất kỳ câu hỏi
  nào dạng "file này để ở đâu?" / "tạo thư mục như thế nào?".
---

# Vue 3 Module–View Architecture

## Mental model — 1 phút

```
src/
├── app/      → bootstrap, routes → views/*
├── core/     → HTTP, guards, interceptors          ← nền móng, không ai phụ thuộc
├── design/   → tokens, themes, styles              ← nền móng, không ai phụ thuộc
├── assets/   → static files, i18n, entry styles
├── shared/   → UI + logic CHUNG (không domain)     ← dùng lại được ở mọi nơi
├── modules/  → feature components + logic          ← đóng gói theo tính năng
└── views/    → page = 1 route, chỉ compose         ← mỏng nhất có thể
```

Luồng dependency (chỉ đi 1 chiều ↓):

```
app  →  views  →  modules  →  shared  →  core / design
```

---

## Đặt file ở đâu? (dùng bảng này trước tiên)

| Câu hỏi                                   | Đặt vào                                         |
| ----------------------------------------- | ----------------------------------------------- |
| Đây là 1 route / page?                    | `views/FeatureView.vue`                         |
| Component thuộc 1 feature?                | `modules/{feature}/components/`                 |
| Composable thuộc 1 feature?               | `modules/{feature}/composables/`                |
| Store (Pinia) của feature?                | `modules/{feature}/stores/`                     |
| Gọi HTTP của feature?                     | `modules/{feature}/api/`                        |
| Types / interfaces của feature?           | `modules/{feature}/types/`                      |
| Static data, constants, images?           | `modules/{feature}/data/`                       |
| Component / composable dùng ở ≥2 feature? | `shared/components/` hoặc `shared/composables/` |
| Layout (AuthLayout, DashboardLayout…)?    | `shared/layouts/`                               |
| HTTP client, interceptor, guard?          | `core/api/` hoặc `core/guards/`                 |
| Design token, theme, utility style?       | `design/tokens/` hoặc `design/themes/`          |
| Config app, provider, route list?         | `app/config/` hoặc `app/routes.ts`              |

---

## Import rules (không được vi phạm)

| Layer       | ✅ Được import từ           | ❌ Không được import   |
| ----------- | --------------------------- | ---------------------- |
| `app/`      | `views/` `core/` `shared/`  | `modules/` trực tiếp   |
| `core/`     | _(không ai)_                | mọi layer khác         |
| `design/`   | _(không ai)_                | mọi layer khác         |
| `shared/`   | `core/` `design/`           | `modules/` `views/`    |
| `modules/*` | `shared/` `core/` `design/` | `views/` · module khác |
| `views/`    | `modules/` `shared/`        | `core/` trực tiếp      |

> **Khi 2 module cần dùng chung logic** → đẩy lên `shared/` hoặc `core/`, không cross-import.

---

## Module — anatomy chuẩn

```
src/modules/{feature}/
  api/            {feature}.api.ts        # HTTP calls, trả raw data
  stores/         {feature}.store.ts      # Pinia: state + actions
  components/     Feature*.vue            # UI thuộc feature này
  composables/    use{Feature}.ts         # wrap store + api → expose cho view
  types/          {feature}.types.ts      # interfaces, enums
  data/           {feature}.constants.ts  # static data (tabs, steps, faqs…)
                  {feature}.images.ts     # base64 / image URLs
  index.ts                                # ← barrel export, BẮT BUỘC
```

### Barrel export (`index.ts`) — bắt buộc

```typescript
// modules/home/index.ts
export { default as HomeNav } from './components/HomeNav.vue'
export { default as HomeHero } from './components/HomeHero.vue'
// … tất cả components
export * from './types/home.types'
export * from './data/home.constants'
```

Sau đó view import gọn:

```typescript
import { HomeNav, HomeHero, HomeAbout } from '@/modules/home'
//       ↑ KHÔNG import đường dẫn trực tiếp vào file .vue của module
```

---

## View — thin pattern

View = compose các module. Không logic, không API call.

```vue
<!-- views/HomeView.vue -->
<template>
  <v-layout>
    <HomeNav />
    <v-main>
      <HomeHero />
      <HomeAbout />
      <HomeMenu />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { HomeNav, HomeHero, HomeAbout, HomeMenu } from '@/modules/home'
</script>
```

```vue
<!-- views/LoginView.vue -->
<template>
  <AuthLayout><LoginForm /></AuthLayout>
</template>

<script setup lang="ts">
import AuthLayout from '@/shared/layouts/AuthLayout.vue'
import { LoginForm } from '@/modules/auth'
</script>
```

---

## Anti-patterns nhanh

```typescript
// ❌ Import sâu vào file cụ thể của module
import { LoginForm } from '@/modules/auth/components/LoginForm.vue'
// ✅ Luôn qua barrel
import { LoginForm } from '@/modules/auth'

// ❌ Business logic / API call trong view
const items = ref([...])
const submit = () => fetch('/api/...')
// ✅ Dùng composable của module
const { items, submit } = useContactForm()

// ❌ Cross-import giữa 2 module
// modules/home/HomeHero.vue
import { useAuth } from '@/modules/auth'
// ✅ Đẩy logic dùng chung vào shared
import { useCurrentUser } from '@/shared/composables/useCurrentUser'
```

---

## Chi tiết thư mục từng layer

Khi cần xem toàn bộ cây thư mục của `app/`, `core/`, `design/`, `shared/`:

> 📂 Đọc `references/layers.md`
