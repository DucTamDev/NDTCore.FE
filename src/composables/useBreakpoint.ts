import { computed } from 'vue'
import { useDisplay } from 'vuetify'

export function useBreakpoint() {
    const display = useDisplay()

    const isMobile = computed(() => ['xs', 'sm'].includes(display.name.value))

    const isTablet = computed(() => display.name.value === 'md')

    const isDesktop = computed(() => ['lg', 'xl', 'xxl'].includes(display.name.value))

    return {
        ...display,

        breakpoint: display.name,

        isMobile,
        isTablet,
        isDesktop,
    }
}
