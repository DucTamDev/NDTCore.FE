# Layer Details — Cây thư mục đầy đủ

Đọc file này khi cần tra cứu cấu trúc chi tiết của từng layer.

---

## `app/` — Application Shell

Khởi tạo ứng dụng, cấu hình router, theme, i18n, providers.

```
src/app/
  routes.ts                   # Toàn bộ routes → trỏ vào views/*
  config/
    i18n.config.ts
    vuetify.config.ts
  providers/
    AppProvider.vue
    ThemeProvider.vue
```

**Ví dụ `routes.ts`:**

```typescript
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomeView, meta: { layout: 'BlankLayout', public: true } },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { layout: 'AuthLayout', public: true },
  },
]
```

---

## `core/` — Infrastructure

HTTP client, interceptors, auth guard, logger, base types. Không import bất kỳ layer nào khác.

```
src/core/
  api/
    client.ts                 # axios instance, base config
    types.ts
    interceptors/
      auth.interceptor.ts     # đính token vào header
      error.interceptor.ts    # xử lý 401, 403, 500…
  guards/
    auth.guard.ts             # Vue Router navigation guard
  logger/
  types/
    api.types.ts              # ApiResponse<T>, PaginatedResponse<T>
    common.types.ts           # ID, Nullable, Maybe…
    router.types.ts           # RouteMeta
```

---

## `design/` & `assets/`

```
src/design/
  tokens/
    colors.ts
    spacing.ts
    radius.ts
    typography.ts
    index.ts                  # re-export tất cả tokens
  themes/
    light.theme.ts
    dark.theme.ts
    index.ts
  styles/
    index.scss
    utilities.scss

src/assets/
  logo.png
  locales/
    en.lang.json
    vi.lang.json
  styles/
    base.scss
    theme.scss
    _index.scss
    _variables.scss
    vuetify/
      _index.scss
      v-button.scss
```

---

## `shared/` — Shared UI & Generic Logic

Components, layouts, composables và utils không thuộc riêng feature nào. Được import bởi `views/`, `modules/`, `app/`.

```
src/shared/
  components/
    base/
      BaseButton.vue          # wrapper Vuetify button, thêm variant riêng
      BaseCard.vue
    common/
      AppFooter.vue           # footer dùng chung nhiều layout
      NotificationMenu.vue
    navigation/
      AppBar.vue
      Breadcrumbs.vue
      NavigationDrawer.vue
      NavigationMenu.vue
    ui/
      DataTable/
        DataTable.vue
        types.ts
      EmptyState/
        EmptyState.vue
      Pagination/
        Pagination.vue
  composables/
    useAsyncState.ts          # loading / error / data wrapper
    useBreakpoint.ts          # sm/md/lg reactive
    usePagination.ts          # page, pageSize, total
  layouts/
    AuthLayout.vue            # login, register
    BlankLayout.vue           # landing page
    DashboardLayout.vue       # admin / dashboard
  types/
    breadcrumb.types.ts
    menu.types.ts
  utils/
    index.ts                  # formatDate, formatCurrency, debounce…
```

---

## `modules/` — Ví dụ cụ thể

### Module `auth`

```
src/modules/auth/
  api/
    auth.api.ts               # login(), logout(), refreshToken(), getMe()
  stores/
    auth.store.ts             # state: user, token, isAuthenticated, permissions
  components/
    LoginForm.vue
    AuthGuard.vue             # route guard component
  composables/
    useAuth.ts                # expose: login, logout, user, isAuthenticated
  types/
    auth.types.ts             # User, LoginPayload, TokenPayload, Permission
  index.ts
```

### Module `home` (landing page)

```
src/modules/home/
  components/
    HomeNav.vue               # sticky nav, scroll-aware glassmorphism
    HomeHero.vue              # hero section + animated stats
    HomeAbout.vue             # brand story + value cards
    HomeMenu.vue              # menu tabs + product grid
    HomeFranchise.vue         # fee card, timeline, invest table
    HomeFaq.vue               # custom accordion
    HomeContact.vue           # contact form + info
    HomeFooter.vue            # links, socials, copyright
  composables/
    useHomeScroll.ts          # scrolled: ref<boolean>, dùng cho nav effect
  data/
    home.constants.ts         # MENU_TABS, ALL_MENU, BENEFITS, STEPS, FAQS…
    home.images.ts            # IMG: Record<string, string> (base64)
  types/
    home.types.ts             # MenuItem, MenuTab, Benefit, ProcessStep, FaqItem, ContactForm
  index.ts
```

### Module `user`

```
src/modules/user/
  api/
    user.api.ts               # getUsers(), getUserById(), updateUser()
  stores/
    user.store.ts
  components/
    UserTable.vue
    UserDetailCard.vue
    UserForm.vue
  composables/
    useUserList.ts
    useUserDetail.ts
  types/
    user.types.ts
  index.ts
```
