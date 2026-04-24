# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

**NDTCore.FE** is an enterprise-grade Vue 3 dashboard application built with a modular architecture. It combines Vuetify for component structure/accessibility with a custom design token system inspired by Tailwind CSS.

### Technology Stack

- **Framework**: Vue 3.5+ (Composition API with `<script setup>`)
- **Build Tool**: Vite 7+
- **Language**: TypeScript 5.9+
- **UI Framework**: Vuetify 3.11+
- **Styling**: Tailwind CSS 4.1+ + SCSS
- **State Management**: Pinia 3.0+
- **Routing**: Vue Router 4.6+
- **Testing**: Vitest 4.0+
- **HTTP Client**: Axios 1.13+
- **Code Quality**: ESLint 9, OxLint, Prettier

### Node Version Requirement

Requires Node.js: `^20.19.0 || >=22.12.0`

## Development Commands

```bash
npm install           # Install dependencies
npm run dev           # Start dev server (http://localhost:5173)
npm run build         # Type-check + build for production
npm run type-check    # TypeScript check without building
npm run test:unit     # Run Vitest
npm run lint          # Run ESLint + OxLint
npm run format        # Prettier formatting
npm run generate:tokens  # Regenerate CSS variables from design tokens
```

## Project Architecture

### Directory Structure

```
src/
├── app/                    # Bootstrapping: plugins, providers, routes.ts
├── core/                   # Infrastructure (no business logic)
│   ├── config/            # API config
│   ├── guards/            # Route guards
│   ├── services/          # Singleton services (api, auth, loading, toast)
│   ├── types/             # Global types (api.types.ts, router.types.ts)
│   ├── ui-system/         # Design token system and Vuetify theme
│   └── utils/             # error-handler, logger
├── modules/               # Feature modules (self-contained business domains)
│   ├── auth/              # Authentication
│   └── home/              # Landing page
├── shared/                # Cross-module reusables
│   ├── components/        # base/, common/, navigation/, layouts/, ui/
│   ├── composables/       # useAsyncState, useBreakpoint, useFormValidation, usePagination
│   ├── directives/        # permission.directive.ts
│   └── types/             # breadcrumb, menu types
└── views/                 # Page-level components (HomeView, DashboardView, NotFoundView)
```

### Module Structure

Each module is self-contained. The `auth` module is the reference implementation:

```
src/modules/[module]/
├── composables/    # use[Module].ts — primary interface for components
├── constants/      # Module constants
├── services/       # Business logic (calls apiService from core)
├── stores/         # Pinia store ([module].store.ts)
├── types/          # TypeScript types ([module].types.ts)
├── views/          # Page components for this module
└── routes.ts       # Module routes (imported into src/app/routes.ts)
```

Modules do **not** have their own API layer — they call `apiService` (from `@/core/services/api.service.ts`) directly from their services.

### Routing & Layouts

Routes are defined in `src/app/routes.ts` and grouped by layout:
- `/` → `DefaultLayout` (public home)
- `/admin` → `AdminLayout` + `authGuard` (protected)
- `/auth/*` → `AuthLayout` (login, register)
- `/*` → `BlankLayout` (404)

`authGuard` is applied via `beforeEnter` at the route group level. Route `meta` uses `title` and `breadcrumb` fields.

Module routes are defined in `[module]/routes.ts` and imported into the main router.

## API Integration

The API client is a singleton exported from `src/core/services/api.service.ts`:

```typescript
import { apiService } from '@/core/services/api.service'

// Methods: get, getPaged, post, put, patch, delete
const result = await apiService.get<UserDto>('/users/me')
// result is ApiResponse<UserDto>: { isSuccess, Data, Error, Metadata }
```

### Response Shape

All responses follow `ApiResponse<T>` from `src/core/types/api.types.ts`:

```typescript
interface ApiResponse<T = object> {
  isSuccess: boolean
  message: string | null
  Data: T | null
  Error: ApiErrorResponse | null
  Metadata: ApiResponseMetadata | null
}
```

Paginated endpoints use `PagedApiResponse<T>` (extends `ApiResponse<T[]>` with pagination fields).

### RequestConfig Options

Pass as the last argument to any `apiService` method:

```typescript
interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean              // Skip Authorization header
  skipErrorNotification?: boolean // Suppress toast on error
  showLoading?: boolean           // Default: true
  cache?: boolean                 // In-memory cache
  cacheTime?: number              // Cache TTL in ms (default: 300000)
}
```

### Automatic Behaviors

- **Token injection**: Bearer token added from `AuthService` on every request (unless `skipAuth: true`)
- **Token refresh**: On 401, automatically calls `/auth/refresh-token` and retries the original request
- **Retry**: Exponential backoff on 5xx errors, up to 3 retries (`API_CONFIG.maxRetries`)
- **Loading indicator**: Global loading shown/hidden automatically
- **Error toasts**: Centralized via `ErrorHandler.handle(error)` unless `skipErrorNotification: true`

## Authentication

The `useAuth()` composable (`src/modules/auth/composables/useAuth.ts`) is the primary interface for components:

```typescript
const { isAuthenticated, currentUser, can, canAny, canAll } = useAuth()
can({ resource: 'users', action: 'read' })
```

State lives in `useAuthStore` (Pinia). Token management (storage, refresh) is handled by `AuthService.getInstance()` (`src/core/services/auth.service.ts`).

## Design System

Design tokens live in `src/core/ui-system/tokens/`. Run `npm run generate:tokens` to regenerate CSS variables after editing tokens.

### Color Usage

Always use semantic theme colors — never hardcode.

```vue
<!-- Vuetify color prop -->
<v-btn color="primary">Submit</v-btn>
<v-alert color="error">Error</v-alert>

<!-- Theme classes -->
<div class="bg-surface text-on-surface">Content</div>
```

```scss
// In SCSS
.component {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  background: rgba(var(--v-theme-primary), 0.1); // with opacity
}
```

**Available semantic colors**: `primary`, `secondary`, `accent`, `success`, `error`, `warning`, `info`, `background`, `surface`, `surface-variant`, `surface-bright`, `on-primary`, `on-secondary`, `on-surface`, `on-background`, `outline`, `outline-variant`

## Vue Component Conventions

- `<script setup lang="ts">` for all components
- Naming: `Base[Name].vue` (primitives), `[Feature][Type].vue` (features), `[Name]Layout.vue` (layouts)
- Type-only imports: `import type { Foo } from '...'`
- No `any` unless absolutely necessary

### Pinia Store Pattern

```typescript
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  // Return all state and actions
  return { user, isAuthenticated, setUser, clearAuth }
})
```

## Key Files

- [src/main.ts](src/main.ts) — app entry, plugin registration
- [src/app/routes.ts](src/app/routes.ts) — router config
- [src/app/plugins/vuetify.ts](src/app/plugins/vuetify.ts) — Vuetify setup
- [src/core/services/api.service.ts](src/core/services/api.service.ts) — HTTP client singleton
- [src/core/config/api.config.ts](src/core/config/api.config.ts) — API base URL, timeouts, retry config
- [src/core/types/api.types.ts](src/core/types/api.types.ts) — `ApiResponse`, `RequestConfig`, `QueryParams`
- [src/core/ui-system/tokens/](src/core/ui-system/tokens/) — design tokens source

## Environment Variables

Defined in `.env.development`:

```env
VITE_APP_NAME=NDTCore
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=http://localhost:3000/api
```
