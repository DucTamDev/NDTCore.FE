import { computed } from 'vue'
import { useDisplay } from 'vuetify'

export function useBreakpoint() {
  const { name, xs, sm, md, lg, xl } = useDisplay()

  const isMobile = computed(() => xs.value)
  const isTablet = computed(() => sm.value || md.value)
  const isDesktop = computed(() => lg.value || xl.value)

  return { isMobile, isTablet, isDesktop, current: name }
}
