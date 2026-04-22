src/
|   App.vue
|   main.ts
|   
+---app
|   |   routes.ts
|   |   
|   +---config
|   |       i18n.config.ts
|   |       vuetify.config.ts
|   |       
|   \---providers
|           AppProvider.vue
|           ThemeProvider.vue
|
+---assets
|   |   logo.png
|   |
|   +---locales
|   |       en.lang.json
|   |       vi.lang.json
|   |
|   \---styles
|       |   base.scss
|       |   theme.scss
|       |   _index.scss
|       |   _variables.scss
|       |
|       \---vuetify
|               v-button.scss
|               _index.scss
|
+---core
|   +---api
|   |   |   client.ts
|   |   |   types.ts
|   |   |
|   |   \---interceptors
|   |           auth.interceptor.ts
|   |           error.interceptor.ts
|   |
|   +---guards
|   |       auth.guard.ts
|   |
|   +---logger
|   \---types
|           api.types.ts
|           common.types.ts
|           router.types.ts
|
+---design
|   +---styles
|   |       index.scss
|   |       utilities.scss
|   |
|   +---themes
|   |       dark.theme.ts
|   |       index.ts
|   |       light.theme.ts
|   |
|   \---tokens
|           colors.ts
|           index.ts
|           radius.ts
|           spacing.ts
|           typography.ts
|
+---modules
|   +---auth
|   |   |   routes.ts
|   |   |
|   |   +---api
|   |   |       auth.api.ts
|   |   |
|   |   +---components
|   |   |       AuthGuard.vue
|   |   |       LoginForm.vue
|   |   |
|   |   +---composables
|   |   |       useAuth.ts
|   |   |
|   |   +---stores
|   |   |       auth.store.ts
|   |   |
|   |   +---types
|   |   |       auth.types.ts
|   |   |
|   |   \---__test__
|   \---user
|       +---components
|       +---stores
|       \---types
+---shared
|   +---components
|   |   +---base
|   |   |       BaseButton.vue
|   |   |       BaseCard.vue
|   |   |
|   |   +---common
|   |   |       AppFooter.vue
|   |   |       NotificationMenu.vue
|   |   |
|   |   +---navigation
|   |   |       AppBar.vue
|   |   |       Breadcrumbs.vue
|   |   |       NavigationDrawer.vue
|   |   |       NavigationMenu.vue
|   |   |
|   |   \---ui
|   |       +---DataTable
|   |       |       DataTable.vue
|   |       |       types.ts
|   |       |
|   |       +---EmptyState
|   |       \---Pagination
|   +---composables
|   |       useAsyncState.ts
|   |       useBreakpoint.ts
|   |       usePagination.ts
|   |
|   +---layouts
|   |       AuthLayout.vue
|   |       BlankLayout.vue
|   |       DashboardLayout.vue
|   |
|   +---types
|   |       breadcrumb.types.ts
|   |       menu.config.ts
|   |       menu.types.ts
|   |
|   \---utils
\---views