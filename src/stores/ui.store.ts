import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const drawer = ref(true)
  const rail = ref(false)

  function toggleDrawer() {
    drawer.value = !drawer.value
  }

  function toggleRail() {
    rail.value = !rail.value
  }

  function setRail(value: boolean) {
    rail.value = value
  }

  return {
    drawer,
    rail,
    toggleDrawer,
    toggleRail,
    setRail,
  }
})
