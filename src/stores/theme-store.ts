import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Theme, ThemeColorKey, TokenColor } from '@/types'
import { createDefaultTheme } from '@/constants'

interface ThemeState {
  themes: Theme[]
  currentThemeId: string | null

  // Actions
  addTheme: (theme?: Theme) => Theme
  updateTheme: (id: string, updates: Partial<Theme>) => void
  deleteTheme: (id: string) => void
  restoreTheme: (theme: Theme, index: number) => void
  setCurrentTheme: (id: string | null) => void
  updateThemeColor: (id: string, key: ThemeColorKey, value: string) => void
  updateTokenColor: (id: string, index: number, tokenColor: TokenColor) => void
  getCurrentTheme: () => Theme | null
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themes: [],
      currentThemeId: null,

      addTheme: (theme?: Theme) => {
        const newTheme = theme ?? createDefaultTheme()
        set((state) => ({
          themes: [...state.themes, newTheme],
          currentThemeId: newTheme.id,
        }))
        return newTheme
      },

      updateTheme: (id, updates) => {
        set((state) => ({
          themes: state.themes.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        }))
      },

      deleteTheme: (id) => {
        set((state) => ({
          themes: state.themes.filter((t) => t.id !== id),
          currentThemeId: state.currentThemeId === id ? null : state.currentThemeId,
        }))
      },

      restoreTheme: (theme, index) => {
        set((state) => {
          const themes = [...state.themes]
          themes.splice(Math.min(index, themes.length), 0, theme)
          return { themes, currentThemeId: state.currentThemeId ?? theme.id }
        })
      },

      setCurrentTheme: (id) => {
        set({ currentThemeId: id })
      },

      updateThemeColor: (id, key, value) => {
        set((state) => ({
          themes: state.themes.map((t) =>
            t.id === id
              ? {
                  ...t,
                  colors: { ...t.colors, [key]: value },
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }))
      },

      updateTokenColor: (id, index, tokenColor) => {
        set((state) => ({
          themes: state.themes.map((t) =>
            t.id === id
              ? {
                  ...t,
                  tokenColors: t.tokenColors.map((tc, i) => (i === index ? tokenColor : tc)),
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }))
      },

      getCurrentTheme: () => {
        const state = get()
        return state.themes.find((t) => t.id === state.currentThemeId) ?? null
      },
    }),
    {
      name: 'theme-storage',
    }
  )
)
