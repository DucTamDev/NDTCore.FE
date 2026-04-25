import { createApp } from 'vue'
import App from './App.vue'
import { registerPlugins } from './plugins'
import { authService } from './services/auth.service'

import 'vuetify/styles'
import 'vue-toastification/dist/index.css'
import '@/styles/main.scss'

const app = createApp(App)

registerPlugins(app)

authService.initialize()

app.mount('#app')
