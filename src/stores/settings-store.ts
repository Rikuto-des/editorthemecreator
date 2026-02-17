import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ThemeMode = 'system' | 'light' | 'dark'

interface SettingsState {
  themeMode: ThemeMode
  setThemeMode: (mode: ThemeMode) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themeMode: 'system',
      setThemeMode: (mode) => set({ themeMode: mode }),
    }),
    {
      name: 'settings-storage',
    }
  )
)
