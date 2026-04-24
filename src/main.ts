import { createApp } from 'vue'
import Toast from 'vue-toastification'

import App from './App.vue'
import { pinia } from './plugins/pinia'
import { router } from './router'
import { vuetify } from './plugins/vuetify'
import { toastOptions } from './plugins/toast'
import { authService } from './services/auth.service'

import 'vuetify/styles'
import 'vue-toastification/dist/index.css'
import '@/styles/main.scss'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(vuetify)
app.use(Toast, toastOptions)

authService.initialize()

app.mount('#app')
