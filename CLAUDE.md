# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Dev server
npm run build         # Type-check + build
npm run type-check    # vue-tsc only
npm run test:unit     # Vitest (watch mode)
npx vitest run        # Single test run (no watch)
npx vitest run src/path/to/file.test.ts  # Run a single test file
npm run lint          # oxlint then eslint (both with --fix)
npm run format        # Prettier over src/
npm run generate:tokens  # Regenerate CSS design token files from TS token definitions
```

Node version: `^20.19.0 || >=22.12.0`. Alias `@` maps to `src/`.

## Architecture

### Tech Stack

Vue 3 (Composition API) + TypeScript + Vite. UI: **Vuetify 3** (Material Design 3 blueprint) + **Tailwind CSS v4** for utilities. State: **Pinia**. Routing: **Vue Router 4**. HTTP: **Axios** via a custom `ApiClient` class. Toast notifications: **vue-toastification**.

### Layered Source Structure

```
src/
  infrastructure/   # Framework-agnostic plumbing (HTTP client, types, error handling, logger)
  services/         # Business-logic wrappers over API clients (auth, token, storage, user)
  stores/           # Pinia stores (auth.store, ui.store)
  composables/      # Vue composable hooks consumed by components
  plugins/          # Vue plugin registrations + full Vuetify design-system setup
  router/           # Routes, guards
  constants/        # App-wide constants (routes, API endpoints, storage keys, etc.)
  models/           # Lean domain models (TS interfaces/types)
  components/       # UI components, split into sub-folders:
    ui/             # Dumb/base wrappers (BaseButton, DataTable, Pagination, etc.)
    common/         # Shared app chrome (AppBar, AppFooter, AppLoadingOverlay, etc.)
    layout/         # Structural providers (AppProvider, ThemeProvider, Breadcrumbs, NavigationDrawer/Menu)
    home/           # Public landing-page sections
    auth/           # Login/Register forms
    theme/          # ThemeSelector, ThemeToggle, ThemeConfiguration
  layouts/          # Route-level layout shells (DefaultLayout, AuthLayout, AdminLayout, BlankLayout)
  views/            # Page-level components mounted by the router
  data/             # Static data / image lists (not API-backed)
```

### HTTP / API Client

`src/infrastructure/http/api.client.ts` — base `ApiClient` class wrapping Axios. Handles:
- Auth header injection from `tokenService`
- Automatic silent token refresh on 401 (queues concurrent requests during refresh)
- Exponential-backoff retry on 5xx (up to 3 retries, configurable via `API_CONFIG`)
- `skipRefreshToken` / `skipErrorNotification` per-request flags on the Axios config

Each API domain gets its own subclass. Currently only `src/infrastructure/clients/identity.client.ts` exists (`IdentityClient extends ApiClient` with `VITE_IDENTITY_API_URL` as `baseURL`). New domain clients follow the same pattern.

`API_CONFIG` is driven by env vars (`VITE_API_BASE_URL`, `VITE_API_TIMEOUT`). The default `apiClient` instance uses `VITE_API_BASE_URL`.

### Auth Flow

1. `tokenService` (`src/services/token.service.ts`) reads/writes tokens from `localStorage` or `sessionStorage` via `storageService`.
2. `authStore.initSession()` is called at app boot — refreshes the user profile if an access token exists but the in-memory user is absent; clears the session if the refresh token is expired.
3. `authGuard` (`src/router/guards/auth.guard.ts`) is applied per-route via `meta.requiresAuth`. Routes default to requiring auth unless `meta.requiresAuth = false`. Unauthenticated users are redirected to login with a `?redirect=` query param.
4. On 401, `ApiClient.handle401()` attempts a token refresh, then replays the failed request. If refresh fails, it fires `window.location.href = '/'` and emits `auth:session-expired` (caught by `authStore` to clear state).

### Pinia Stores

- **`auth.store`** — authentication state (`user`, `isAuthenticated`, `isAdmin`), session lifecycle (`initSession`, `clearSession`).
- **`ui.store`** — navigation drawer state (`drawer`, `rail`), global loading counter (`isGlobalLoading`, `withLoading`), confirm-dialog promise pattern (`openConfirmDialog` / `resolveConfirmDialog`).

### Theme System

Located entirely in `src/plugins/vuetify/`. Four named Vuetify themes: `light`, `dark`, `soli-light`, `soli-dark`. Each theme is built from typed **design tokens** in `src/plugins/vuetify/tokens/` (color, spacing, typography, radius, shadow, z-index, breakpoint, transition).

`ThemeProvider.vue` (`src/components/layout/`) is the root provider; it orchestrates five composables:
- `useThemeState` — reactive theme ref + `setTheme` / `toggleTheme`
- `useThemeStorage` — persist/restore theme to `localStorage` (key: `app_theme`)
- `useThemeDOM` — applies resolved theme as a `data-theme` attribute on `<html>`
- `useSystemTheme` — watches `prefers-color-scheme` media query
- `useVuetifyThemeSync` — calls Vuetify's `useTheme().global.name` setter

The `ThemeContext` is provided via `inject(THEME_INJECTION_KEY)` to all descendants. Components needing the theme use this injection instead of importing stores.

Running `npm run generate:tokens` re-runs `src/plugins/vuetify/generator/index.ts` (via `tsx`) to regenerate CSS custom-property files from the TS token definitions.

### Design Token Color Conventions

Semantic color names map directly to Vuetify theme color keys (`primary`, `secondary`, `error`, etc.) plus extended tokens like `primaryHover`, `borderFocus`, `textSecondary`. Always use semantic names — never raw palette values — in components.

### Routing Conventions

All route names and paths are defined in `src/constants/app-routes.constants.ts` (`APP_ROUTES` const). Routes are structured by layout: `DefaultLayout` (public), `AuthLayout` (login/register), `AdminLayout` (dashboard, users), `BlankLayout` (404). Route meta supports `requiresAuth`, `permissions` (array of `{resource, action}`), `breadcrumb`, and `title`.

### Key Composables

| Composable | Purpose |
|---|---|
| `useAuth` | Thin wrapper over `authStore`; exposes `login`, `register`, `logout`, `canAny` (permission check) |
| `useAsyncState` | Generic `{data, loading, error, execute}` wrapper for async functions |
| `useLoading` | Module-scoped loading counter (separate from `ui.store` global loading) |
| `useToastNotification` | Wrapper over `vue-toastification` (`success`, `error`, `warning`, `info`) |
| `useConfirmDialog` | Triggers the promise-based confirm dialog via `ui.store` |
| `useFormValidation` | Form validation helpers |
| `useLogger` | Returns a named `Logger` instance (colored console output, disabled when `API_CONFIG.enableLogging = false`) |

### API Response Shape

All backend responses follow `ApiResponse<T>` from `src/infrastructure/types/api.types.ts`:

```ts
{ IsSuccess, IsFailure, Data: T | null, Message, Error: { ErrorCode, Message, Meta }, Metadata }
```

Paged responses extend this with `PageNumber`, `PageSize`, `TotalCount`, etc. `handleApiError` in `src/infrastructure/errors/api-error-handler.ts` extracts `Error.Message` or falls back to HTTP status messages (in Vietnamese).

### Environment Variables

Copy `.env.development` for local dev. Key vars:

| Variable | Purpose |
|---|---|
| `VITE_APP_NAME` | App title |
| `VITE_API_BASE_URL` | Default `ApiClient` base URL |
| `VITE_IDENTITY_API_URL` | `IdentityClient` base URL |
| `VITE_API_TIMEOUT` | Request timeout ms (default 30 000) |
