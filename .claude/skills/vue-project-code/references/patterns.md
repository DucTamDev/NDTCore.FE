# Patterns & Anti-patterns — Vue 3 + Vuetify + Pinia + TypeScript

## ✅ ĐÚNG vs ❌ SAI

### 1. Destructure store — giữ reactivity

```typescript
// ❌ SAI — mất reactivity với state/getters
const { users, isLoading } = useUserStore()

// ✅ ĐÚNG
const store = useUserStore()
const { users, isLoading } = storeToRefs(store)   // state & getters
const { fetchUsers, deleteUser } = store            // actions (không cần storeToRefs)
```

### 2. Không gọi service trực tiếp trong component

```typescript
// ❌ SAI
import { userService } from '@/services/user.service'
const users = await userService.getAll(1, 10)

// ✅ ĐÚNG
import { useUser } from '@/composables/useUser'
const { users } = useUser()
```

### 3. Không hard-code endpoint hay route path

```typescript
// ❌ SAI
await httpService.get('/api/users')
router.push('/users/123')

// ✅ ĐÚNG
await httpService.get(API_ENDPOINTS.USERS.BASE)
router.push({ name: ROUTE_NAMES.USER_DETAIL, params: { id: 123 } })
```

### 4. Toast — composable, không store trực tiếp

```typescript
// ❌ SAI
import { useUiStore } from '@/stores/ui.store'
useUiStore().showSnackbar({ message: 'OK', color: 'success' })

// ✅ ĐÚNG
import { useToast } from '@/composables/useToast'
useToast().success('OK')
```

### 5. Confirm Dialog — await pattern

```typescript
// ❌ SAI — logic dialog rải rác trong view
const showConfirm = ref(false)

// ✅ ĐÚNG
import { useConfirmDialog } from '@/composables/useConfirmDialog'
const { confirm } = useConfirmDialog()

async function handleDelete(id: number) {
  const ok = await confirm({ title: 'Xóa?', message: 'Không thể hoàn tác.' })
  if (!ok) return
  await store.deleteUser(id)
}
```

### 6. Không dùng `any`

```typescript
// ❌ SAI
const response: any = await httpService.get('/users')

// ✅ ĐÚNG
const { data } = await httpService.get<PaginatedResponse<User>>(API_ENDPOINTS.USERS.BASE)
```

### 7. Validation rules — từ constants

```typescript
// ❌ SAI — inline trong template
<v-text-field :rules="[v => !!v || 'Bắt buộc']" />

// ✅ ĐÚNG
import { VALIDATION_RULES } from '@/constants/validation.constants'
const rules = { name: [VALIDATION_RULES.required('Họ tên'), VALIDATION_RULES.maxLength(100)] }
<v-text-field :rules="rules.name" />
```

### 8. Role check — constants

```typescript
// ❌ SAI
if (user.role === 'admin') { ... }

// ✅ ĐÚNG
import { USER_ROLES } from '@/constants/app.constants'
if (user.role === USER_ROLES.ADMIN) { ... }
```

### 9. LoadingState thay vì boolean

```typescript
// ❌ SAI
const isLoading = ref(false)
const hasError = ref(false)

// ✅ ĐÚNG
import type { LoadingState } from '@/types/common.types'
const loadingState = ref<LoadingState>('idle')
const isLoading = computed(() => loadingState.value === 'loading')
const isError = computed(() => loadingState.value === 'error')
```

### 10. Computed thay vì method cho derived state

```typescript
// ❌ SAI — recalculate không cache
function getAdminCount() { return users.value.filter(u => u.role === 'admin').length }

// ✅ ĐÚNG
const adminCount = computed(() =>
  users.value.filter(u => u.role === USER_ROLES.ADMIN).length
)
```

### 11. Props typing

```typescript
// ❌ SAI
const props = defineProps({ user: Object, count: Number })

// ✅ ĐÚNG
interface Props { user: User; count?: number; isSelected?: boolean }
const props = withDefaults(defineProps<Props>(), { count: 0, isSelected: false })
```

### 12. Emits typing

```typescript
// ❌ SAI
const emit = defineEmits(['select', 'delete'])

// ✅ ĐÚNG
interface Emits {
  (e: 'select', userId: number): void
  (e: 'delete', userId: number): void
  (e: 'update:modelValue', value: boolean): void
}
const emit = defineEmits<Emits>()
```

### 13. Vuetify màu sắc — theme, không hex

```vue
<!-- ❌ SAI -->
<v-btn style="background-color: #1976D2">Click</v-btn>

<!-- ✅ ĐÚNG -->
<v-btn color="primary">Click</v-btn>
<v-chip color="error">Error</v-chip>
```

### 14. Server-side pagination

```vue
<!-- ❌ SAI -->
<v-data-table :items="allUsers" />

<!-- ✅ ĐÚNG -->
<v-data-table-server
  :items="users"
  :items-length="total"
  :loading="isLoading"
  @update:page="changePage"
  @update:items-per-page="changeLimit"
/>
```

### 15. watchEffect cho multi-dependency

```typescript
// ❌ SAI — phải list rõ từng dependency
watch([page, limit, search], () => fetchUsers(page.value, limit.value, search.value))

// ✅ ĐÚNG — auto-track
watchEffect(() => fetchUsers(page.value, limit.value, search.value))
```

### 16. Setup Store, không Options Store

```typescript
// ❌ Tránh Options Store
export const useStore = defineStore('id', {
  state: () => ({ count: 0 }),
  actions: { increment() { this.count++ } },
})

// ✅ Setup Store
export const useStore = defineStore('id', () => {
  const count = ref(0)
  const double = computed(() => count.value * 2)
  function increment() { count.value++ }
  return { count, double, increment }
})
```

---

## File Naming Convention

| Loại | Convention | Ví dụ |
|------|-----------|-------|
| Component | PascalCase.vue | `UserCard.vue` |
| Composable | camelCase + `use` prefix | `useUser.ts` |
| Store | camelCase + `.store.ts` | `user.store.ts` |
| Service | camelCase + `.service.ts` | `user.service.ts` |
| Types | camelCase + `.types.ts` | `user.types.ts` |
| Constants | camelCase + `.constants.ts` | `api.constants.ts` |
| View | PascalCase + `View.vue` | `UserListView.vue` |
| Layout | PascalCase + `Layout.vue` | `DefaultLayout.vue` |
| Guard | camelCase + `.guard.ts` | `auth.guard.ts` |

---

## Store Responsibility Matrix

| Concern | Thuộc về |
|---------|---------|
| API call | `service` |
| State (data, loading, error) | `store` |
| Global UI (dialog, overlay) | `ui.store` |
| Toast notification | `useToast()` composable |
| Business logic + store wiring | `composable` |
| Render + user interaction | `component/view` |
| Route config + guards | `router` |
| Axios config + interceptors | `http.service` |