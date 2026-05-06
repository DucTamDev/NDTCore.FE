# Menu Config Design

**Date:** 2026-04-28
**Status:** Approved

## Tổng quan

Thiết kế lại hệ thống menu sidebar cho AdminLayout của NDTCore.FE. Menu hiện tại chỉ có 2 mục phẳng (Dashboard, Users) và bị duplicate logic giữa `NavigationDrawer` và `NavigationMenu`. Thiết kế mới hỗ trợ phân nhóm, sub-item expandable, và phân quyền theo role.

## Quyết định thiết kế

- **Cấu trúc:** Menu phân nhóm (section headers) thay vì phẳng
- **Sub-items:** Một số mục có children expandable (Sản phẩm)
- **Ngôn ngữ:** Tiếng Việt toàn bộ
- **Phân quyền:** Role-based (`roles[]` trên mỗi item); không dùng `permissions` (chưa implement thật)
- **ORG_CASHIER:** Chỉ thấy Nghiệp vụ (Bán hàng, Đơn hàng) + Báo cáo ca (giới hạn data ở tầng API)

## Phần 1: Types

### `src/core/types/nav.types.ts`

```ts
export interface MenuItemBadge {
  text: string
  color: string
}

export interface MenuItem {
  title: string
  icon?: string
  to?: string
  roles?: string[]       // undefined = hiện cho tất cả authenticated users
  badge?: MenuItemBadge
  children?: MenuItem[]  // nếu có children và không có `to` → expandable group thuần
}

export interface MenuSection {
  section: string        // label section header, vd: "Quản lý"
  items: MenuItem[]
}

export type MenuEntry = MenuItem | MenuSection

export function isMenuSection(entry: MenuEntry): entry is MenuSection {
  return 'section' in entry
}
```

**Thay đổi so với cũ:** Bỏ `permissions` (chưa dùng thật), thêm `MenuSection`, `MenuEntry`, `isMenuSection`.

## Phần 2: Menu Config

### `src/core/constants/menu-config.constants.ts`

```ts
import type { MenuEntry } from '@/core/types'
import { APP_ROUTES } from '@/core/constants/app-routes.constants'
import { USER_ROLES } from './app.constants'

export const menuConfig: MenuEntry[] = [
  // ── Standalone ──────────────────────────────────────────
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    to: APP_ROUTES.ADMIN.CHILDREN.DASHBOARD.NAME,
    roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_ADMIN],
  },

  // ── Quản lý ─────────────────────────────────────────────
  {
    section: 'Quản lý',
    items: [
      {
        title: 'Người dùng',
        icon: 'mdi-account-group',
        to: APP_ROUTES.ADMIN.CHILDREN.USERS.NAME,
        roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_ADMIN],
      },
      {
        title: 'Sản phẩm',
        icon: 'mdi-package-variant-closed',
        roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_ADMIN],
        children: [
          { title: 'Danh sách sản phẩm', to: 'admin:products' },
          { title: 'Danh mục',           to: 'admin:product-categories' },
        ],
      },
      {
        title: 'Cửa hàng',
        icon: 'mdi-store',
        to: 'admin:stores',
        roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_ADMIN],
      },
    ],
  },

  // ── Nghiệp vụ ───────────────────────────────────────────
  {
    section: 'Nghiệp vụ',
    items: [
      {
        title: 'Bán hàng',
        icon: 'mdi-cart-outline',
        to: 'admin:sales',
        roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_ADMIN, USER_ROLES.ORG_CASHIER],
      },
      {
        title: 'Đơn hàng',
        icon: 'mdi-clipboard-list-outline',
        to: 'admin:orders',
        roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_ADMIN, USER_ROLES.ORG_CASHIER],
      },
    ],
  },

  // ── Báo cáo ─────────────────────────────────────────────
  {
    section: 'Báo cáo',
    items: [
      {
        title: 'Doanh thu',
        icon: 'mdi-chart-line',
        to: 'admin:reports-revenue',
        roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_ADMIN],
      },
      {
        title: 'Báo cáo ca',
        icon: 'mdi-calendar-clock',
        to: 'admin:reports-shift',
        roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_ADMIN, USER_ROLES.ORG_CASHIER],
        // ORG_CASHIER thấy mục này nhưng API chỉ trả data ca của chính họ
      },
      {
        title: 'Sản phẩm bán chạy',
        icon: 'mdi-fire',
        to: 'admin:reports-top-products',
        roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_ADMIN],
      },
    ],
  },
]
```

### Phân quyền theo role

| Section | Item | SUPER_ADMIN / ORG_ADMIN | ORG_CASHIER |
|---|---|---|---|
| *(standalone)* | Dashboard | ✅ | ❌ |
| **Quản lý** | Người dùng | ✅ | ❌ |
| | Sản phẩm (+ Danh mục) | ✅ | ❌ |
| | Cửa hàng | ✅ | ❌ |
| **Nghiệp vụ** | Bán hàng | ✅ | ✅ |
| | Đơn hàng | ✅ | ✅ |
| **Báo cáo** | Doanh thu | ✅ | ❌ |
| | Báo cáo ca | ✅ | ✅ *(data filtered by API)* |
| | Sản phẩm bán chạy | ✅ | ❌ |

### Routes placeholder

Các route chưa tồn tại (sẽ thêm khi implement từng module):
- `admin:products`, `admin:product-categories`
- `admin:stores`
- `admin:sales`
- `admin:orders`
- `admin:reports-revenue`, `admin:reports-shift`, `admin:reports-top-products`

## Phần 3: Access Control

### Composable `useMenuAccess` — `src/composables/useMenuAccess.ts`

Extract logic ra composable để tránh duplicate giữa các component:

```ts
import { useAuthStore } from '@/stores/auth.store'
import type { MenuItem, MenuSection } from '@/core/types'

export function useMenuAccess() {
  const authStore = useAuthStore()

  function hasAccess(item: MenuItem): boolean {
    const roleOk = !item.roles?.length ||
      item.roles.some(r => authStore.user?.roles?.includes(r))
    if (!roleOk) return false

    // Group thuần (không có route) → hiện nếu có ít nhất 1 child accessible
    if (!item.to && item.children?.length) {
      return item.children.some(child => hasAccess(child))
    }

    return true
  }

  function hasAccessToSection(section: MenuSection): boolean {
    return section.items.some(hasAccess)
  }

  return { hasAccess, hasAccessToSection }
}
```

**Giả định:** `authStore.user` có field `roles: string[]`. Nếu backend trả về format khác, cần adapter ở store layer — logic `hasAccess` giữ nguyên.

## Phần 4: Components

### Files thay đổi

| File | Thay đổi |
|---|---|
| `src/core/types/nav.types.ts` | Thêm `MenuSection`, `MenuEntry`, `isMenuSection()` |
| `src/core/constants/menu-config.constants.ts` | Rewrite với structure mới |
| `src/composables/useMenuAccess.ts` | **File mới** — `hasAccess`, `hasAccessToSection` |
| `src/components/layout/NavigationMenu.vue` | Xử lý `MenuEntry[]`, dùng `useMenuAccess`, section headers |
| `src/components/layout/NavigationDrawer.vue` | Bỏ list tự render, delegate sang `NavigationMenu` |
| `src/components/layout/NavigationMenuItem.vue` | **File mới** — render 1 item (leaf hoặc group), dùng `useMenuAccess` |

### `NavigationDrawer.vue` — sau khi sửa

```vue
<template>
  <v-navigation-drawer v-model="model" :rail="rail" @update:rail="emit('update:rail', $event)">
    <NavigationMenu :rail="rail" />
  </v-navigation-drawer>
</template>
```

### `NavigationMenu.vue` — sau khi sửa

```vue
<template>
  <v-list nav density="compact">
    <template v-for="(entry, index) in menuConfig" :key="index">
      <template v-if="!isMenuSection(entry) && hasAccess(entry)">
        <NavigationMenuItem :item="entry" />
      </template>
      <template v-else-if="isMenuSection(entry) && hasAccessToSection(entry)">
        <v-list-subheader v-if="!rail">{{ entry.section }}</v-list-subheader>
        <NavigationMenuItem
          v-for="item in entry.items.filter(hasAccess)"
          :key="item.title"
          :item="item"
        />
      </template>
    </template>
  </v-list>
</template>
```

### `NavigationMenuItem.vue` — file mới

```vue
<template>
  <!-- Leaf item -->
  <v-list-item
    v-if="!item.children"
    :to="item.to ? { name: item.to } : undefined"
    :prepend-icon="item.icon"
    :title="item.title"
    color="primary"
  >
    <template v-if="item.badge" #append>
      <v-chip size="x-small" :color="item.badge.color">{{ item.badge.text }}</v-chip>
    </template>
  </v-list-item>

  <!-- Expandable group -->
  <v-list-group v-else :value="item.title">
    <template #activator="{ props }">
      <v-list-item v-bind="props" :prepend-icon="item.icon" :title="item.title" />
    </template>
    <v-list-item
      v-for="child in item.children.filter(hasAccess)"
      :key="child.title"
      :to="child.to ? { name: child.to } : undefined"
      :title="child.title"
      color="primary"
    />
  </v-list-group>
</template>

<script setup lang="ts">
import type { MenuItem } from '@/core/types'
import { useMenuAccess } from '@/composables/useMenuAccess'

defineProps<{ item: MenuItem }>()

const { hasAccess } = useMenuAccess()
</script>
```

## Ngoài phạm vi

- Thêm routes mới (Products, Stores, Sales, Orders, Reports) — làm khi implement từng module
- Data filtering cho ORG_CASHIER trên trang Báo cáo ca — xử lý ở view/API layer
- `authStore.user.roles` format — giả định `string[]`, cần verify khi tích hợp backend
