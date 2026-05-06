# Menu Config Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the admin sidebar menu to support grouped sections, expandable sub-items, and real role-based access control — replacing the current flat, unenforced config.

**Architecture:** Introduce `MenuSection` type alongside `MenuItem` so the config can express grouped sections with headers. A `useMenuAccess` composable centralises role-checking logic (reading from `authStore.user.Roles: RoleDto[]`). `NavigationDrawer` delegates all rendering to `NavigationMenu`, which in turn renders each entry via `NavigationMenuItem`.

**Tech Stack:** Vue 3 (Composition API), TypeScript, Vuetify 3 (`v-list`, `v-list-group`, `v-list-subheader`), Pinia (`useAuthStore`), Vitest + jsdom

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Modify | `src/core/types/nav.types.ts` | Add `MenuSection`, `MenuEntry`, `isMenuSection` |
| Modify | `src/core/types/index.ts` | Re-export new types |
| Create | `src/composables/useMenuAccess.ts` | `hasAccess`, `hasAccessToSection` |
| Create | `src/composables/__tests__/useMenuAccess.test.ts` | Unit tests for access logic |
| Modify | `src/core/constants/menu-config.constants.ts` | Full rewrite with new structure |
| Create | `src/components/layout/NavigationMenuItem.vue` | Render one item: leaf or expandable group |
| Modify | `src/components/layout/NavigationMenu.vue` | Iterate `MenuEntry[]`, render sections + items |
| Modify | `src/components/layout/NavigationDrawer.vue` | Delegate to `NavigationMenu`, remove own list |

---

## Task 1: Extend nav types

**Files:**
- Modify: `src/core/types/nav.types.ts`
- Modify: `src/core/types/index.ts`

- [ ] **Step 1: Replace `nav.types.ts`**

```ts
// src/core/types/nav.types.ts
export interface MenuItemBadge {
    text: string
    color: string
}

export interface MenuItem {
    title: string
    icon?: string
    to?: string
    roles?: string[]
    badge?: MenuItemBadge
    children?: MenuItem[]
}

export interface MenuSection {
    section: string
    items: MenuItem[]
}

export type MenuEntry = MenuItem | MenuSection

export function isMenuSection(entry: MenuEntry): entry is MenuSection {
    return 'section' in entry
}
```

- [ ] **Step 2: Add new exports to the barrel**

Open `src/core/types/index.ts`. Replace the existing `MenuItem` export line with:

```ts
export type { MenuItem, MenuItemBadge, MenuSection, MenuEntry } from './nav.types'
export { isMenuSection } from './nav.types'
```

- [ ] **Step 3: Type-check**

```bash
npm run type-check
```

Expected: no errors related to `nav.types.ts`.

- [ ] **Step 4: Commit**

```bash
git add src/core/types/nav.types.ts src/core/types/index.ts
git commit -m "feat(types): add MenuSection, MenuEntry, isMenuSection to nav types"
```

---

## Task 2: Create `useMenuAccess` composable

**Files:**
- Create: `src/composables/useMenuAccess.ts`
- Create: `src/composables/__tests__/useMenuAccess.test.ts`

> **Key fact:** `authStore.user` is `UserProfileResponse | null` where `UserProfileResponse.Roles` is `RoleDto[]` and `RoleDto = { Name: string }`. It is NOT a flat `string[]`.

- [ ] **Step 1: Write the failing tests**

Create `src/composables/__tests__/useMenuAccess.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMenuAccess } from '../useMenuAccess'
import { useAuthStore } from '@/stores/auth.store'
import type { MenuItem, MenuSection } from '@/core/types'

function makeUser(...roleNames: string[]) {
    return {
        Email: 'test@test.com',
        Roles: roleNames.map(Name => ({ Name })),
    }
}

describe('useMenuAccess', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    describe('hasAccess', () => {
        it('returns true for item with no roles restriction', () => {
            const authStore = useAuthStore()
            authStore.user = makeUser('orgadmin')
            const { hasAccess } = useMenuAccess()
            const item: MenuItem = { title: 'Dashboard' }
            expect(hasAccess(item)).toBe(true)
        })

        it('returns true when user has a matching role', () => {
            const authStore = useAuthStore()
            authStore.user = makeUser('orgadmin')
            const { hasAccess } = useMenuAccess()
            const item: MenuItem = { title: 'Users', roles: ['superadmin', 'orgadmin'] }
            expect(hasAccess(item)).toBe(true)
        })

        it('returns false when user has no matching role', () => {
            const authStore = useAuthStore()
            authStore.user = makeUser('orgcashier')
            const { hasAccess } = useMenuAccess()
            const item: MenuItem = { title: 'Users', roles: ['superadmin', 'orgadmin'] }
            expect(hasAccess(item)).toBe(false)
        })

        it('returns false when user is not logged in', () => {
            const authStore = useAuthStore()
            authStore.user = null
            const { hasAccess } = useMenuAccess()
            const item: MenuItem = { title: 'Users', roles: ['orgadmin'] }
            expect(hasAccess(item)).toBe(false)
        })

        it('returns true for group with no roles if at least one child is accessible', () => {
            const authStore = useAuthStore()
            authStore.user = makeUser('orgcashier')
            const { hasAccess } = useMenuAccess()
            const item: MenuItem = {
                title: 'Báo cáo',
                children: [
                    { title: 'Tạo báo cáo ca', to: 'admin:reports-shift', roles: ['orgadmin', 'orgcashier'] },
                    { title: 'Doanh thu', to: 'admin:reports-revenue', roles: ['orgadmin'] },
                ],
            }
            expect(hasAccess(item)).toBe(true)
        })

        it('returns false for group when no children are accessible', () => {
            const authStore = useAuthStore()
            authStore.user = makeUser('orgcashier')
            const { hasAccess } = useMenuAccess()
            const item: MenuItem = {
                title: 'Báo cáo',
                children: [
                    { title: 'Doanh thu', to: 'admin:reports-revenue', roles: ['orgadmin'] },
                ],
            }
            expect(hasAccess(item)).toBe(false)
        })
    })

    describe('hasAccessToSection', () => {
        it('returns true when at least one section item is accessible', () => {
            const authStore = useAuthStore()
            authStore.user = makeUser('orgcashier')
            const { hasAccessToSection } = useMenuAccess()
            const section: MenuSection = {
                section: 'Nghiệp vụ',
                items: [
                    { title: 'Bán hàng', to: 'admin:sales', roles: ['orgcashier'] },
                    { title: 'Cái gì đó', roles: ['orgadmin'] },
                ],
            }
            expect(hasAccessToSection(section)).toBe(true)
        })

        it('returns false when no section items are accessible', () => {
            const authStore = useAuthStore()
            authStore.user = makeUser('orgcashier')
            const { hasAccessToSection } = useMenuAccess()
            const section: MenuSection = {
                section: 'Quản lý',
                items: [
                    { title: 'Người dùng', roles: ['orgadmin'] },
                    { title: 'Cửa hàng', roles: ['orgadmin'] },
                ],
            }
            expect(hasAccessToSection(section)).toBe(false)
        })
    })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx vitest run src/composables/__tests__/useMenuAccess.test.ts
```

Expected: FAIL — `useMenuAccess` not found.

- [ ] **Step 3: Create `useMenuAccess.ts`**

```ts
// src/composables/useMenuAccess.ts
import { useAuthStore } from '@/stores/auth.store'
import type { MenuItem, MenuSection } from '@/core/types'

export function useMenuAccess() {
    const authStore = useAuthStore()

    function hasAccess(item: MenuItem): boolean {
        const roleOk =
            !item.roles?.length ||
            item.roles.some(r => authStore.user?.Roles?.some(role => role.Name === r))

        if (!roleOk) return false

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

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npx vitest run src/composables/__tests__/useMenuAccess.test.ts
```

Expected: all 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/composables/useMenuAccess.ts src/composables/__tests__/useMenuAccess.test.ts
git commit -m "feat(composables): add useMenuAccess with role-based access control"
```

---

## Task 3: Rewrite menu config

**Files:**
- Modify: `src/core/constants/menu-config.constants.ts`

- [ ] **Step 1: Replace the entire file**

```ts
// src/core/constants/menu-config.constants.ts
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
                    { title: 'Danh mục', to: 'admin:product-categories' },
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

- [ ] **Step 2: Type-check**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/core/constants/menu-config.constants.ts
git commit -m "feat(menu): rewrite menu config with grouped sections and Vietnamese labels"
```

---

## Task 4: Create `NavigationMenuItem.vue`

**Files:**
- Create: `src/components/layout/NavigationMenuItem.vue`

This component renders one `MenuItem` — either a direct `v-list-item` (leaf) or a `v-list-group` with filtered children.

- [ ] **Step 1: Create the file**

```vue
<!-- src/components/layout/NavigationMenuItem.vue -->
<template>
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

- [ ] **Step 2: Type-check**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/NavigationMenuItem.vue
git commit -m "feat(layout): add NavigationMenuItem component for leaf and group rendering"
```

---

## Task 5: Rewrite `NavigationMenu.vue`

**Files:**
- Modify: `src/components/layout/NavigationMenu.vue`

- [ ] **Step 1: Replace the entire file**

```vue
<!-- src/components/layout/NavigationMenu.vue -->
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

<script setup lang="ts">
import { menuConfig } from '@/core/constants/menu-config.constants'
import { isMenuSection } from '@/core/types'
import { useMenuAccess } from '@/composables/useMenuAccess'
import NavigationMenuItem from './NavigationMenuItem.vue'

defineProps<{ rail?: boolean }>()

const { hasAccess, hasAccessToSection } = useMenuAccess()
</script>
```

- [ ] **Step 2: Type-check**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/NavigationMenu.vue
git commit -m "feat(layout): rewrite NavigationMenu to handle MenuEntry[], sections, and role-based access"
```

---

## Task 6: Simplify `NavigationDrawer.vue`

**Files:**
- Modify: `src/components/layout/NavigationDrawer.vue`

- [ ] **Step 1: Replace the entire file**

```vue
<!-- src/components/layout/NavigationDrawer.vue -->
<template>
    <v-navigation-drawer v-model="model" :rail="rail" @update:rail="emit('update:rail', $event)">
        <NavigationMenu :rail="rail" />
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import NavigationMenu from './NavigationMenu.vue'

const model = defineModel<boolean>({ required: true })

defineProps<{ rail: boolean }>()

const emit = defineEmits<{
    'update:rail': [value: boolean]
}>()
</script>
```

- [ ] **Step 2: Type-check**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Run all unit tests**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 4: Start dev server and verify manually**

```bash
npm run dev
```

Open http://localhost:5173/admin in a browser.

Manual checks:
- [ ] Sidebar shows: Dashboard, section "Quản lý" (Người dùng, Sản phẩm, Cửa hàng), section "Nghiệp vụ" (Bán hàng, Đơn hàng), section "Báo cáo" (Doanh thu, Báo cáo ca, Sản phẩm bán chạy)
- [ ] "Sản phẩm" expands to show "Danh sách sản phẩm" and "Danh mục"
- [ ] Section headers are hidden when `rail` mode is active
- [ ] Routes with placeholder names (`admin:sales`, etc.) show a Vue Router warning in console — this is expected until those modules are built

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/NavigationDrawer.vue
git commit -m "refactor(layout): simplify NavigationDrawer to delegate rendering to NavigationMenu"
```

---

## Notes for future modules

When adding a new module (e.g., Products), the steps are:
1. Add the route to `app-routes.constants.ts` and `routes.ts`
2. The `menu-config.constants.ts` placeholder `to: 'admin:products'` will automatically resolve — no menu changes needed
