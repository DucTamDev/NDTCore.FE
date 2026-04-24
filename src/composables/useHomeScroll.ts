import { ref, onMounted, onUnmounted } from 'vue'

export function useHomeScroll() {
  const scrolled = ref(false)

  const handleScroll = () => {
    scrolled.value = window.scrollY > 60
  }

  onMounted(() => window.addEventListener('scroll', handleScroll))
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))

  return { scrolled }
}
