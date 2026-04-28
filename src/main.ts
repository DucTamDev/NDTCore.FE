import { createApp } from 'vue'
import App from './App.vue'
import { registerPlugins } from './plugins'

import 'vuetify/styles'
import '@/assets/styles/main.scss'
import { API_EVENT, apiEvents } from './core/events/api.events'
import { useAuthStore } from './stores/auth.store'
import { router } from './router'
import { APP_ROUTES } from './core/constants/app-routes.constants'

const app = createApp(App)
registerPlugins(app)

apiEvents.on(API_EVENT.SESSION_EXPIRED, () => {
    const authStore = useAuthStore()
    authStore.reset()
    router.push({ name: APP_ROUTES.HOME.NAME })
})


app.mount('#app')
