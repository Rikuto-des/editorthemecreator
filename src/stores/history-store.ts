import { create } from 'zustand'
import type { Theme } from '@/types'

interface HistoryEntry {
  themeId: string
  snapshot: Theme
  timestamp: number
}

interface HistoryState {
  past: HistoryEntry[]
  future: HistoryEntry[]
  maxHistory: number

  // Actions
  pushHistory: (theme: Theme) => void
  undo: (currentTheme: Theme) => Theme | null
  redo: (currentTheme: Theme) => Theme | null
  canUndo: () => boolean
  canRedo: () => boolean
  clearHistory: () => void
}

export const useHistoryStore = create<HistoryState>()((set, get) => ({
  past: [],
  future: [],
  maxHistory: 50,

  pushHistory: (theme) => {
    const entry: HistoryEntry = {
      themeId: theme.id,
      snapshot: JSON.parse(JSON.stringify(theme)),
      timestamp: Date.now(),
    }

    set((state) => ({
      past: [...state.past.slice(-state.maxHistory + 1), entry],
      future: [],
    }))
  },

  undo: (currentTheme) => {
    const state = get()
    if (state.past.length === 0) return null

    const currentEntry: HistoryEntry = {
      themeId: currentTheme.id,
      snapshot: JSON.parse(JSON.stringify(currentTheme)),
      timestamp: Date.now(),
    }

    const restoreTo = state.past[state.past.length - 1]
    set((s) => ({
      past: s.past.slice(0, -1),
      future: [currentEntry, ...s.future],
    }))

    return restoreTo.snapshot
  },

  redo: (currentTheme) => {
    const state = get()
    if (state.future.length === 0) return null

    const currentEntry: HistoryEntry = {
      themeId: currentTheme.id,
      snapshot: JSON.parse(JSON.stringify(currentTheme)),
      timestamp: Date.now(),
    }

    const restoreTo = state.future[0]
    set((s) => ({
      past: [...s.past, currentEntry],
      future: s.future.slice(1),
    }))

    return restoreTo.snapshot
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,

  clearHistory: () => {
    set({ past: [], future: [] })
  },
}))
