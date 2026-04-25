# Plugin Setup — Vuetify + Toast + Pinia

## vite.config.ts

```typescript
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }), // tự import Vuetify components — không cần import * as components
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
```

## Vuetify Plugin

```typescript
// src/plugins/vuetify.ts
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { APP_THEME } from '@/constants/app.constants'

export const vuetify = createVuetify({
  icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
  theme: {
    defaultTheme: APP_THEME.DEFAULT,
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          error: '#FF5252',
          warning: '#FFC107',
          info: '#2196F3',
          success: '#4CAF50',
          surface: '#FFFFFF',
          background: '#F5F5F5',
        },
      },
      dark: {
        dark: true,
        colors: { primary: '#2196F3', secondary: '#616161' },
      },
    },
  },
})
```

> Màu hex ở đây là **định nghĩa theme**, không phải hard-code trong component.
> Component luôn dùng `color="primary"`, không dùng hex trực tiếp.

## Toast Plugin

```typescript
// src/plugins/toast.ts
import Toast, { type PluginOptions, POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { TOAST_CONFIG } from '@/constants/app.constants'

export const toastOptions: PluginOptions = {
  position: POSITION.BOTTOM_RIGHT,
  timeout: TOAST_CONFIG.TIMEOUT,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  hideProgressBar: false,
  icon: true,
}

export { Toast }
```

## Pinia Plugin

```typescript
// src/plugins/pinia.ts
import { createPinia } from 'pinia'
export const pinia = createPinia()
```

## Register All Plugins

```typescript
// src/plugins/index.ts
import type { App } from 'vue'
import { vuetify } from './vuetify'
import { Toast, toastOptions } from './toast'
import { pinia } from './pinia'
import router from '@/router'

export function registerPlugins(app: App) {
  app.use(pinia)    // pinia trước router (auth store dùng trong guard)
  app.use(router)
  app.use(vuetify)
  app.use(Toast, toastOptions)
}
```

```typescript
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { registerPlugins } from './plugins'

const app = createApp(App)
registerPlugins(app)
app.mount('#app')
```

## SCSS Global (nếu cần override Vuetify)

```scss
// src/styles/main.scss
// Không override màu ở đây — dùng Vuetify theme
// Chỉ dùng cho spacing, typography không có trong Vuetify utilities
```

> Không import Tailwind. `prettier-plugin-tailwindcss` và `@tailwindcss/vite`
> chỉ là devDeps không được dùng trong source code Vue/Vuetify.