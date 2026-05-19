import { createApp } from 'vue'
import App from './App.vue'
import { registerPlugins } from './plugins'

import 'vuetify/styles'
import '@/assets/styles/main.scss'
import { API_EVENT, apiEvents } from './core/events/api.events'
import { router } from './router'
import { APP_ROUTES } from './core/constants/app-routes.constants'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { useUserStore } from './modules/user/stores/user.store'
import { useUIStore } from './core/stores/ui.store'
import { useAppStore } from './core/stores/app.store'

const app = createApp(App)
registerPlugins(app)

apiEvents.on(API_EVENT.SESSION_EXPIRED, () => {
    authStore.reset()
    router.push({ name: APP_ROUTES.HOME.NAME })
})

const appStore = useAppStore()
const uiStore = useUIStore()
const authStore = useAuthStore()
const userStore = useUserStore()

app.mount('#app')

await uiStore.withLoading(async () => {
    try {
        await authStore.initialize()

        if (authStore.isLoggedIn) {
            await userStore.fetchProfile()
        }
    } catch (err) {
        console.error('[Bootstrap] Khởi tạo thất bại:', err)
    }
    finally{
        appStore.setAppReady(true)
    }
})
