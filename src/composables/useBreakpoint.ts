import { computed } from 'vue'
import { useDisplay } from 'vuetify'

export function useBreakpoint() {
    const display = useDisplay()

    const isMobile = computed(() => display.xs.value || display.sm.value)
    const isTablet = computed(() => display.md.value)
    const isDesktop = computed(() => display.lg.value || display.xl.value || display.xxl.value)

    return {
        ...display,

        // Alias rõ nghĩa
        breakpoint: display.name,

        // Shortcuts tổng hợp
        isMobile,
        isTablet,
        isDesktop,

        // Export tường minh để dùng trong template và composable khác
        xs: display.xs,
        sm: display.sm,
        md: display.md,
        lg: display.lg,
        xl: display.xl,
    }
}
