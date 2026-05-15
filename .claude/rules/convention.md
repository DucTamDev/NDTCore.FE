# Frontend Convention — Vue 3 + TypeScript

## 1. Tech Stack

| Category | Technology |
|---|---|
| Framework | Vue 3 |
| Language | TypeScript |
| State Management | Pinia |
| Routing | Vue Router |
| HTTP Client | Axios |
| Validation | Zod |
| Form | VeeValidate |
| Linting | ESLint |
| Formatting | Prettier |
| Build Tool | Vite |

---

# 2. General Principles

- Feature-first architecture
- Strict typing
- Thin component
- Business logic outside component
- DTO synchronized with backend
- Reusable UI components
- No magic string
- No `any`

---

# 3. Folder Structure

```txt
src/
├── assets/
├── components/
│   ├── base/
│   └── common/
├── composables/
├── core/
├── layouts/
├── modules/
├── router/
├── stores/
├── styles/
├── types/
├── App.vue
└── main.ts
```

---

# 4. Core Structure

```txt
core/
├── auth/
├── config/
├── constants/
├── enums/
├── errors/
├── guards/
├── http/
├── interceptors/
├── localization/
├── permissions/
├── plugins/
├── services/
├── types/
└── utils/
```

---

# 5. Module Structure

```txt
modules/
└── user/
    ├── api/
    ├── components/
    ├── composables/
    ├── constants/
    ├── enums/
    ├── pages/
    ├── services/
    ├── stores/
    ├── types/
    └── routes/
```

---

# 6. Naming Convention

| Item | Convention | Example |
|---|---|---|
| Component | PascalCase | `UserTable.vue` |
| Page | PascalCase | `UserListPage.vue` |
| DTO | PascalCase | `UserDto.ts` |
| Interface | PascalCase | `UserProfile` |
| Enum | PascalCase | `OrderStatus` |
| Function | camelCase verb | `fetchUsers` |
| Variable | camelCase | `selectedUser` |
| Boolean | is/has/can | `isLoading` |
| Constant | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE` |
| Composable | useXxx | `useAuth.ts` |
| Store | useXxxStore | `useUserStore.ts` |

---

# 7. Vue SFC Convention

```vue
<template>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
```

---

# 8. Script Order Convention

```ts
// imports

// types/interfaces

// props

// emits

// composables

// refs/reactive

// computed

// watchers

// methods/functions

// lifecycle
```

---

# 9. DTO Convention

DTO must follow backend contract naming.

Example (.NET backend):

```csharp
public class UserDto
{
    public string FullName { get; set; }
}
```

Frontend:

```ts
export interface UserDto {
  FullName: string
}
```

Rules:
- Do not rename DTO fields
- DTO = API contract
- Match Swagger/OpenAPI

---

# 10. UI Model Convention

Frontend state/model uses camelCase.

```ts
export interface UserModel {
  fullName: string
}
```

---

# 11. API Convention

Do not call HTTP directly inside component.

```txt
modules/user/api/userApi.ts
```

```ts
export async function getUsers() {
  return httpClient.get<UserDto[]>('/users')
}
```

---

# 12. Service Convention

Business logic belongs to services/composables.

```ts
export async function loadUsers() {
  const response = await getUsers()

  return response.data
}
```

---

# 13. Composable Convention

```ts
export function useUsers() {
  const users = ref<UserDto[]>([])
  const isLoading = ref(false)

  async function fetchUsers() {}

  return {
    users,
    isLoading,
    fetchUsers
  }
}
```

Rules:
- reusable logic
- stateful logic
- orchestration logic

---

# 14. Store Convention

```ts
export const useUserStore = defineStore('user', () => {
  const profile = ref<UserDto | null>(null)

  async function fetchProfile() {}

  return {
    profile,
    fetchProfile
  }
})
```

Rules:
- state = noun
- action = verb

---

# 15. Component Convention

## Base Components

```txt
components/base/
```

Examples:
- BaseButton
- BaseInput
- BaseModal

Rules:
- generic
- reusable
- no business logic

---

## Common Components

```txt
components/common/
```

Examples:
- UserAvatar
- AppHeader

---

## Feature Components

```txt
modules/user/components/
```

Rules:
- domain specific
- not globally reusable

---

# 16. Props Convention

```ts
interface Props {
  userId: string
  disabled?: boolean
}

const props = defineProps<Props>()
```

---

# 17. Emit Convention

```ts
const emit = defineEmits<{
  save: [id: string]
  cancel: []
}>()
```

---

# 18. Enum Convention

```ts
export enum OrderStatus {
  Pending = 'PENDING',
  Completed = 'COMPLETED'
}
```

Rules:
- no hardcoded string
- centralized enums

---

# 19. Import Convention

Use alias path.

```json
{
  "@/*": ["src/*"]
}
```

Example:

```ts
import BaseButton from '@/components/base/BaseButton.vue'
```

---

# 20. Async/Error Handling Convention

```ts
try {
  isLoading.value = true

  await fetchUsers()
} catch (error) {
  handleApiError(error)
} finally {
  isLoading.value = false
}
```

Rules:
- always use finally for loading
- do not swallow exception

---

# 21. TypeScript Rules

Required:

```json
{
  "strict": true,
  "noImplicitAny": true
}
```

Avoid:

```ts
const data: any
```

Prefer:
- proper interface
- generic
- unknown

---

# 22. Styling Convention

- Use scoped style by default
- Prefer utility-first with Tailwind CSS
- Avoid inline style

---

# 23. Dependency Direction

```txt
modules     -> core
components  -> core
stores      -> core

core X-> modules
```

Rules:
- core must not depend on modules
- avoid circular dependency

---

# 24. Absolute Rules

Do not:
- write large business logic in `.vue`
- call API directly in template lifecycle
- use magic string
- use `any`

Do not create folders:
```txt
misc/
temp/
helpers2/
common2/
```

---

# 25. Golden Rule

| Layer | Responsibility |
|---|---|
| DTO | Backend contract |
| Model | Frontend state |
| Component | UI |
| Composable | Reusable logic |
| Service | Business logic |
| Store | Global state |
| API | HTTP communication |
| Core | Infrastructure/shared system |