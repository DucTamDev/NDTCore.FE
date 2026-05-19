import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

type Theme = 'light' | 'dark' | 'system'
type Locale = 'vi' | 'en'
type SidebarState = 'expanded' | 'collapsed'

interface AppPrefs {
  theme: Theme
  locale: Locale
  sidebar: SidebarState
}

const STORAGE_KEY = 'app_prefs'
const DEFAULT_PREFS: AppPrefs = { theme: 'system', locale: 'vi', sidebar: 'expanded' }

function loadPrefs(): AppPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : { ...DEFAULT_PREFS }
  } catch {
    return { ...DEFAULT_PREFS }
  }
}

function savePrefs(prefs: AppPrefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
}

export const useAppStore = defineStore('app', () => {
  const prefs = loadPrefs()

  const isAppReady = ref(false)
  
  const theme   = ref<Theme>(prefs.theme)
  const locale  = ref<Locale>(prefs.locale)
  const sidebar = ref<SidebarState>(prefs.sidebar)

  const isSidebarOpen = computed(() => sidebar.value === 'expanded')

  function persist() {
    savePrefs({ theme: theme.value, locale: locale.value, sidebar: sidebar.value })
  }

  function setAppReady(v: boolean) {
    isAppReady.value = v
  }

  function setTheme(value: Theme) {
    theme.value = value
    persist()
  }

  function setLocale(value: Locale) {
    locale.value = value
    persist()
  }

  function setSidebar(value: SidebarState) {
    sidebar.value = value
    persist()
  }

  function toggleSidebar() {
    sidebar.value = sidebar.value === 'expanded' ? 'collapsed' : 'expanded'
    persist()
  }

  return {
    isAppReady,
    setAppReady,
    theme,
    locale,
    sidebar,
    isSidebarOpen,
    setTheme,
    setLocale,
    setSidebar,
    toggleSidebar,
  }
})