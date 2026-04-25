import type { App } from 'vue'
import { pinia } from './pinia'
import { Toast, toastOptions } from './toast'
import { vuetify } from './vuetify'
import { router } from '@/router'

export function registerPlugins(app: App) {
  app.use(pinia)
  app.use(router)
  app.use(vuetify)
  app.use(Toast, toastOptions)
}
