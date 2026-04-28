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

### Source Structure

```
src/
  core/               # Framework-agnostic plumbing — all shared infrastructure
    api/
      clients/        # ApiClient base class + domain subclasses (identity.client.ts)
      config/         # HTTP config (timeouts, base URLs)
      dtos/           # API request/response contracts (auth, user, common)
      policies/       # Retry policy
      types/          # Axios config extensions, query param types
    constants/        # App-wide constants (routes, API endpoints, HTTP headers, validation rules, menu config)
    events/           # Custom app events (api.events.ts)
    logger/           # Logger class
    storage/          # StorageService, TokenStorageService, storage keys
    types/            # Centralized UI + infrastructure types (barrel: @/core/types)
  models/             # Domain models — app-internal business entities only
                      # auth.model.ts (AuthTokenModel, AuthUserModel)
                      # user.model.ts (UserProfileModel)
  services/           # Business-logic wrappers (auth.service.ts)
  stores/             # Pinia stores (auth.store, ui.store, user.store)
  composables/        # Vue composable hooks consumed by components
  plugins/            # Vue plugin registrations + full Vuetify design-system setup
  router/             # Routes (routes.ts), auth guard (router.beforeEach in index.ts), route types
  components/         # UI components, split into sub-folders:
    ui/               # Dumb/base wrappers (BaseButton, DataTable, Pagination, etc.)
    common/           # Shared app chrome (AppBar, AppFooter, AppLoadingOverlay, etc.)
    layout/           # Structural providers (ThemeProvider, Breadcrumbs, NavigationDrawer/Menu)
    home/             # Public landing-page sections
    auth/             # Login/Register forms
    theme/            # ThemeSelector, ThemeToggle, ThemeConfiguration
  layouts/            # Route-level layout shells (DefaultLayout, AuthLayout, AdminLayout, BlankLayout)
  views/              # Page-level components mounted by the router
  data/               # Static data, image lists, home content types
```

### Type Organization

All shared types live in `src/core/types/` and are re-exported through a barrel at `@/core/types`:

| File | Types |
|---|---|
| `dialog.types.ts` | `ConfirmDialogOptions`, `ConfirmDialogState` |
| `loading.types.ts` | `LoadingState` |
| `data-table.types.ts` | `DataTableHeader` |
| `async-state.types.ts` | `AsyncStateOptions<T>` |
| `form.types.ts` | `ValidationRules` |
| `pagination.types.ts` | `PaginationOptions` |
| `breadcrumb.types.ts` | `BreadcrumbItem` |
| `nav.types.ts` | `MenuItem` (navigation) |

API contracts (request/response shapes matching backend PascalCase) go in `src/core/api/dtos/`. Domain models (app-internal, camelCase) go in `src/models/`. Home content types live in `src/data/home.types.ts`.

### HTTP / API Client

`src/core/api/clients/api.client.ts` — base `ApiClient` class wrapping Axios. Handles:
- Auth header injection from `tokenStorageService`
- Automatic silent token refresh on 401 (queues concurrent requests during refresh)
- Exponential-backoff retry on 5xx (up to 3 retries, configurable via `HTTP_CONFIG`)
- `skipRefreshToken` / `skipErrorNotification` per-request flags on the Axios config

Each API domain gets its own subclass. Currently only `src/core/api/clients/identity.client.ts` exists (`IdentityClient extends ApiClient` with `VITE_IDENTITY_API_URL` as `baseURL`). New domain clients follow the same pattern.

### Auth Flow

1. `tokenStorageService` (`src/core/storage/token-storage.service.ts`) reads/writes tokens from `localStorage` or `sessionStorage`.
2. `authStore.initialize()` is called on every navigation — refreshes the user profile if an access token exists but the in-memory user is absent.
3. Auth guard is inline `router.beforeEach` in `src/router/index.ts`. Routes with `meta.requiresAuth = true` redirect unauthenticated users to the home page. Authenticated users are redirected away from non-auth routes (login/register) to the dashboard.
4. On 401, `ApiClient` attempts a token refresh, then replays the failed request. If refresh fails, it emits `auth:session-expired` (caught by `authStore` to clear state).

### Pinia Stores

- **`auth.store`** — authentication state (`user`, `isLoggedIn`, `isAdmin`), session lifecycle (`initialize`, `clearSession`).
- **`ui.store`** — navigation drawer state (`drawer`, `rail`), global loading counter (`isGlobalLoading`, `withLoading`), confirm-dialog promise pattern (`openConfirmDialog` / `resolveConfirmDialog`).
- **`user.store`** — user list state (`total`, `loadingState`).

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

All route names and paths are defined in `src/core/constants/app-routes.constants.ts` (`APP_ROUTES` const). Routes are structured by layout: `DefaultLayout` (public), `AuthLayout` (login/register), `AdminLayout` (dashboard, users), `BlankLayout` (404). Route meta supports `requiresAuth`, `breadcrumb`, and `title`. Route meta types are declared via module augmentation in `src/router/types.ts`.

### Key Composables

| Composable | Purpose |
|---|---|
| `useAuth` | Thin wrapper over `authStore`; exposes `login`, `logout`, `canAny` (permission check) |
| `useAsyncState` | Generic `{data, loading, error, execute}` wrapper for async functions |
| `useLoading` | Module-scoped loading counter (separate from `ui.store` global loading) |
| `useToastNotification` | Wrapper over `vue-toastification` (`success`, `error`, `warning`, `info`) |
| `useConfirmDialog` | Triggers the promise-based confirm dialog via `ui.store` |
| `useFormValidation` | Returns `rules` object + helpers (`createPasswordRules`, `createEmailRules`) |
| `usePagination` | Page/pageSize/total state with navigation helpers |
| `useLogger` | Returns a named `Logger` instance (colored console output, disabled when logging is off) |

### API Response Shape

All backend responses follow `ApiResponse<T>` from `src/core/api/dtos/common.dtos.ts`:

```ts
{ IsSuccess, IsFailure, Data: T | null, Message, Error: { ErrorCode, Message, Meta }, Metadata }
```

Paged responses use `PagedApiResponse<T>` which extends this with `PageNumber`, `PageSize`, `TotalCount`, etc.

### Environment Variables

Copy `.env.development` for local dev. Key vars:

| Variable | Purpose |
|---|---|
| `VITE_APP_NAME` | App title |
| `VITE_API_BASE_URL` | Default `ApiClient` base URL |
| `VITE_IDENTITY_API_URL` | `IdentityClient` base URL |
| `VITE_API_TIMEOUT` | Request timeout ms (default 30 000) |
