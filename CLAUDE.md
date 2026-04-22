# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**NDTCore.Pro** is an enterprise-grade Vue 3 dashboard application built with a modular architecture. The project follows a utility-first design system approach combining Vuetify for component structure/accessibility with Tailwind CSS design philosophy for theming and styling.

### Technology Stack

- **Framework**: Vue 3.5+ (Composition API with `<script setup>`)
- **Build Tool**: Vite 7+
- **Language**: TypeScript 5.9+
- **UI Framework**: Vuetify 3.11+
- **Styling**: Tailwind CSS 4.1+ + SCSS
- **State Management**: Pinia 3.0+
- **Routing**: Vue Router 4.6+
- **Testing**: Vitest 4.0+
- **Code Quality**: ESLint, Prettier, OxLint

### Node Version Requirement

Requires Node.js: `^20.19.0 || >=22.12.0`

## Development Commands

### Essential Commands

```bash
# Install dependencies
npm install

# Development server with hot-reload
npm run dev

# Build for production
npm run build

# Type-check without building
npm run type-check

# Run unit tests
npm run test:unit

# Lint and fix code
npm run lint              # Run all linters
npm run lint:eslint       # ESLint only
npm run lint:oxlint       # OxLint only

# Format code
npm run format

# Generate design tokens
npm run tokens:generate
```

### Development Workflow

1. Run `npm run dev` to start development server (usually http://localhost:5173)
2. Code changes trigger automatic hot-reload
3. Run `npm run type-check` periodically to catch TypeScript errors
4. Before committing, run `npm run lint` and `npm run format`

## Project Architecture

### Module-Based Organization

The project follows a **feature module pattern** where each business domain is self-contained:

```
src/
├── app/                    # Application configuration
│   ├── plugins/           # Plugin configurations (Vuetify, etc.)
│   ├── providers/         # App-level providers (Theme, etc.)
│   └── routes.ts          # Main router configuration
│
├── core/                  # Core infrastructure
│   ├── api/              # API client & interceptors
│   ├── ui-system/        # Design tokens & theme system
│   ├── guards/           # Route guards
│   ├── logger/           # Logging utilities
│   └── types/            # Global type definitions
│
├── modules/              # Feature modules (business domains)
│   ├── auth/            # Authentication module
│   │   ├── api/         # Auth API calls
│   │   ├── components/  # Auth-specific components
│   │   ├── composables/ # Auth composables
│   │   ├── guards/      # Auth route guards
│   │   ├── services/    # Auth business logic
│   │   ├── stores/      # Auth state (Pinia)
│   │   ├── types/       # Auth type definitions
│   │   └── routes.ts    # Auth routes
│   │
│   └── user/            # User module (similar structure)
│
├── shared/              # Shared across modules
│   ├── components/     # Reusable components
│   │   ├── base/       # Base components (BaseButton, BaseCard)
│   │   ├── common/     # Common components (AppFooter, etc.)
│   │   ├── navigation/ # Navigation components
│   │   ├── ui/         # UI components (DataTable, etc.)
│   │   ├── layouts/    # Layout components
│   ├── composables/    # Shared composables
│   ├── types/          # Shared types
│   └── utils/          # Utility functions
│
├── views/              # Page components
├── assets/             # Static assets
│   ├── locales/       # i18n translation files
│   └── styles/        # Global styles
│
├── App.vue            # Root component
└── main.ts            # Application entry point
```

### Creating a New Module

When adding a new feature module, follow this structure:

```
src/modules/[module-name]/
├── api/                # API endpoints for this module
│   └── [module].api.ts
├── components/         # Module-specific components
├── composables/        # Module-specific composables
│   └── use[Module].ts
├── guards/            # Module-specific guards (if needed)
├── services/          # Business logic services
├── stores/            # Pinia stores
│   └── [module].store.ts
├── types/             # TypeScript types
│   └── [module].types.ts
├── __test__/          # Tests (currently not prioritized)
└── routes.ts          # Module routes
```

## Design System & Theming

### Core Philosophy

This project uses **Vuetify for component structure/accessibility** and **Tailwind CSS philosophy for theming**:

- **Vuetify**: Provides components, layout system, accessibility features
- **Tailwind CSS**: Provides utility-first design tokens and styling approach
- **Design Tokens**: Centralized in `src/core/design-system/tokens/`

### Design Token System

Tokens are defined in TypeScript and generated into CSS variables:

```typescript
// src/core/design-system/tokens/colors.ts
export const colors = {
  primary: '#667eea',
  secondary: '#764ba2',
  // ...
}
```

Run `npm run tokens:generate` to regenerate CSS variables from tokens.

### Color Usage Rules

**CRITICAL**: Always use semantic theme colors, never hardcode colors.

```vue
<!-- CORRECT: Use Vuetify color prop -->
<v-btn color="primary">Submit</v-btn>
<v-alert color="error">Error message</v-alert>

<!-- CORRECT: Use theme classes -->
<div class="bg-surface text-on-surface">Content</div>

<!-- WRONG: Never hardcode colors -->
<div style="background: #667eea">Content</div>
<div class="tw:bg-blue-500">Content</div>
```

#### Available Semantic Colors

**Brand Colors**: `primary`, `secondary`, `accent`
**Status Colors**: `success`, `error`, `warning`, `info`
**Surface Colors**: `background`, `surface`, `surface-variant`, `surface-bright`
**Text Colors**: `on-primary`, `on-secondary`, `on-surface`, `on-background`
**Border Colors**: `outline`, `outline-variant`

#### Using Colors in SCSS

```scss
// Use CSS variables from theme
.custom-component {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  border: 1px solid rgb(var(--v-theme-outline));

  // With opacity
  background: rgba(var(--v-theme-primary), 0.1);
}
```

### Component Color Guidelines

```vue
<!-- Buttons -->
<v-btn color="primary">Primary Action</v-btn>
<v-btn color="error">Delete</v-btn>
<v-btn variant="outlined">Secondary</v-btn>

<!-- Form Inputs -->
<v-text-field color="primary" />

<!-- Alerts -->
<v-alert color="success">Success message</v-alert>
<v-alert color="error">Error message</v-alert>

<!-- Cards -->
<v-card class="bg-surface">
  <v-card-text class="text-on-surface">Content</v-card-text>
</v-card>

<!-- Links -->
<a class="text-primary text-decoration-none">Link</a>
```

## Vue Component Structure

### Composition API Best Practices

All components use `<script setup>` with TypeScript:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { User } from '@/modules/user/types/user.types'

// Props with TypeScript interface
interface Props {
  userId: string
  initialData?: User
}

const props = withDefaults(defineProps<Props>(), {
  initialData: undefined
})

// Emits
const emit = defineEmits<{
  update: [user: User]
  cancel: []
}>()

// Refs
const loading = ref(false)
const user = ref<User | null>(null)

// Computed
const fullName = computed(() =>
  user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
)

// Methods
const saveUser = async () => {
  loading.value = true
  try {
    // API call
    emit('update', user.value!)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-card>
    <v-card-text>
      <div class="text-on-surface">{{ fullName }}</div>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" :loading="loading" @click="saveUser">
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
```

### Component Naming Conventions

- **Base Components**: `Base[ComponentName].vue` (e.g., `BaseButton.vue`, `BaseCard.vue`)
- **Feature Components**: `[FeatureName][ComponentType].vue` (e.g., `LoginForm.vue`, `UserProfile.vue`)
- **Layout Components**: `[LayoutName]Layout.vue` (e.g., `DashboardLayout.vue`)

## State Management with Pinia

### Store Structure

Each module has its own Pinia store:

```typescript
// src/modules/auth/stores/auth.store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, AuthResponse } from '../types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = computed(() => !!token.value)

  // Actions
  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password })
    user.value = response.user
    token.value = response.token
    localStorage.setItem('token', response.token)
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  return {
    // State
    user,
    token,
    isAuthenticated,
    // Actions
    login,
    logout
  }
})
```

### Using Stores in Components

```vue
<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/stores/auth.store'

const authStore = useAuthStore()

const handleLogin = async () => {
  await authStore.login(email.value, password.value)
}
</script>

<template>
  <div v-if="authStore.isAuthenticated">
    Welcome, {{ authStore.user?.firstName }}
  </div>
</template>
```

## API Integration

### API Client Setup

The base API client is configured in `src/core/api/client.ts` with interceptors:

```typescript
// src/core/api/client.ts
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptors are registered in:
// - src/core/api/interceptors/auth.interceptor.ts
// - src/core/api/interceptors/error.interceptor.ts
```

### Module API Layer

Each module defines its API functions:

```typescript
// src/modules/auth/api/auth.api.ts
import { apiClient } from '@/core/api/client'
import type { LoginRequest, AuthResponse } from '../types/auth.types'

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', data),

  logout: () =>
    apiClient.post('/auth/logout'),

  refreshToken: (refreshToken: string) =>
    apiClient.post<AuthResponse>('/auth/refresh', { refreshToken })
}
```

## Routing

### Route Definition

Routes are defined per module and imported into main router:

```typescript
// src/modules/auth/routes.ts
import type { RouteRecordRaw } from 'vue-router'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('./views/LoginView.vue'),
    meta: { requiresAuth: false, layout: 'auth' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('./views/RegisterView.vue'),
    meta: { requiresAuth: false, layout: 'auth' }
  }
]
```

### Route Guards

```typescript
// src/core/guards/auth.guard.ts
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/modules/auth/stores/auth.store'

export const authGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
}
```

## TypeScript Guidelines

### Type Organization

- **Global types**: `src/core/types/`
- **Module types**: `src/modules/[module]/types/`
- **Component types**: Defined inline in component `<script setup>`

### Type Naming Conventions

```typescript
// Interfaces for data structures
interface User {
  id: string
  firstName: string
  lastName: string
}

// Types for unions/primitives
type UserRole = 'admin' | 'user' | 'guest'

// API request/response types
interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  user: User
  token: string
}
```

### Import Type Annotations

```typescript
// Use 'type' keyword for type-only imports
import type { User } from '@/modules/user/types/user.types'
import type { RouteRecordRaw } from 'vue-router'
```

## Styling Guidelines

### Style Organization

1. **Global styles**: `src/assets/styles/`
2. **Component styles**: `<style scoped>` in `.vue` files
3. **Vuetify overrides**: `src/assets/styles/vuetify/`

### SCSS Usage

```vue
<style scoped lang="scss">
// Use theme variables
.custom-container {
  background: rgb(var(--v-theme-surface));
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
}

// SCSS nesting
.user-card {
  &__header {
    color: rgb(var(--v-theme-primary));
  }

  &__body {
    color: rgb(var(--v-theme-on-surface));
  }
}
</style>
```

### Utility Classes

Prefer Vuetify utility classes over custom CSS:

```vue
<!-- Spacing -->
<div class="pa-4 ma-2">           <!-- padding: 16px, margin: 8px -->
<div class="mt-4 mb-2">           <!-- margin-top: 16px, margin-bottom: 8px -->

<!-- Display -->
<div class="d-flex justify-center align-center">

<!-- Typography -->
<div class="text-h5 font-weight-bold text-primary">

<!-- Sizing -->
<div class="w-100 h-100">
```

## Environment Variables

Environment variables are defined in `.env.development`:

```env
VITE_APP_NAME=NDTCore
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=http://localhost:3000/api
```

Access in code:

```typescript
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const appName = import.meta.env.VITE_APP_NAME
```

## Important Architecture Principles

### 1. Module Isolation

Each module should be self-contained with minimal dependencies on other modules. Inter-module communication should go through:
- Shared composables
- Event bus (if needed)
- Pinia stores with well-defined interfaces

### 2. Component Composition

Favor composition over inheritance:
- Use composables for shared logic
- Keep components focused on presentation
- Extract complex logic into separate services

### 3. Type Safety

Maintain strict TypeScript:
- All props/emits must be typed
- No `any` types unless absolutely necessary
- Use type inference where possible

### 4. Performance Considerations

- Use `defineAsyncComponent` for code-splitting large components
- Lazy-load routes with dynamic imports
- Use `v-memo` for expensive list rendering
- Avoid deep watchers unless necessary

## Common Patterns

### Async Data Fetching

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userApi } from '@/modules/user/api/user.api'
import type { User } from '@/modules/user/types/user.types'

const loading = ref(false)
const error = ref<Error | null>(null)
const users = ref<User[]>([])

const fetchUsers = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await userApi.getUsers()
    users.value = response.data
  } catch (e) {
    error.value = e as Error
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <v-card>
    <v-card-text>
      <v-progress-circular v-if="loading" indeterminate color="primary" />
      <v-alert v-else-if="error" color="error">{{ error.message }}</v-alert>
      <div v-else>
        <!-- User list -->
      </div>
    </v-card-text>
  </v-card>
</template>
```

### Form Handling

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue'

interface FormData {
  email: string
  password: string
}

const form = ref<HTMLFormElement>()
const formData = reactive<FormData>({
  email: '',
  password: ''
})

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 8 || 'Password must be at least 8 characters'
]

const handleSubmit = async () => {
  const { valid } = await form.value!.validate()
  if (valid) {
    // Submit form
  }
}
</script>

<template>
  <v-form ref="form" @submit.prevent="handleSubmit">
    <v-text-field
      v-model="formData.email"
      label="Email"
      :rules="emailRules"
      color="primary"
    />
    <v-text-field
      v-model="formData.password"
      label="Password"
      type="password"
      :rules="passwordRules"
      color="primary"
    />
    <v-btn type="submit" color="primary">Submit</v-btn>
  </v-form>
</template>
```

## Key Files Reference

- **Main entry**: [src/main.ts](src/main.ts)
- **App root**: [src/App.vue](src/App.vue)
- **Router**: [src/app/routes.ts](src/app/routes.ts)
- **Vuetify config**: [src/app/plugins/vuetify.ts](src/app/plugins/vuetify.ts)
- **API client**: [src/core/api/client.ts](src/core/api/client.ts)
- **Design tokens**: [src/core/design-system/tokens/](src/core/design-system/tokens/)

## Testing

Testing is currently not prioritized. When implementing tests:
- Use Vitest for unit tests
- Run with `npm run test:unit`
- Place tests in `__test__/` directories within modules

## Additional Notes

- **No test focus**: This project deprioritizes testing in favor of rapid development
- **Enterprise-ready**: Architecture designed for scale and maintainability
- **Modular approach**: Business domains are isolated for team scalability
- **Design system**: Centralized theming ensures consistency across the application
