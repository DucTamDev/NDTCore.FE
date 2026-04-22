// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'

import App from './App.vue'
import router from './app/routes'
import { vuetify } from './app/plugins/vuetify'
import { toastOptions } from './app/plugins/toast'

import '@/assets/styles/main.scss'
import 'vue-toastification/dist/index.css'
// import '@/assets/styles/tailwind.css';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(Toast, toastOptions)

app.mount('#app')
