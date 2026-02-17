import { useEffect } from 'react'
import { useSettingsStore } from '@/stores'

export function useThemeMode() {
  const themeMode = useSettingsStore((state) => state.themeMode)

  useEffect(() => {
    const rootElement = document.documentElement

    const setDarkMode = (isDark: boolean) => {
      if (isDark) {
        rootElement.classList.add('dark')
      } else {
        rootElement.classList.remove('dark')
      }
    }

    if (themeMode === 'system') {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
      setDarkMode(darkModeQuery.matches)

      const handleChange = (event: MediaQueryListEvent) => setDarkMode(event.matches)
      darkModeQuery.addEventListener('change', handleChange)
      return () => darkModeQuery.removeEventListener('change', handleChange)
    }

    setDarkMode(themeMode === 'dark')
  }, [themeMode])
}
