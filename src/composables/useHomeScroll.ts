import { ref, onMounted, onUnmounted } from 'vue'

export function useHomeScroll() {
    const scrolled = ref(false)

    function onScroll() {
        scrolled.value = window.scrollY > 50
    }

    onMounted(() => window.addEventListener('scroll', onScroll))
    onUnmounted(() => window.removeEventListener('scroll', onScroll))

    return { scrolled }
}
