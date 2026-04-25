import Toast, { POSITION, type PluginOptions } from 'vue-toastification'
import { TOAST_CONFIG } from '@/constants/app.constants'

export const toastOptions: PluginOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: TOAST_CONFIG.TIMEOUT,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  transition: 'Vue-Toastification__bounce',
  maxToasts: 5,
  newestOnTop: true,
}

export { Toast }
