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
  undo: () => Theme | null
  redo: () => Theme | null
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
      future: [], // Clear future on new action
    }))
  },

  undo: () => {
    const state = get()
    if (state.past.length === 0) return null

    const previous = state.past[state.past.length - 1]
    set((s) => ({
      past: s.past.slice(0, -1),
      future: [previous, ...s.future],
    }))

    // Return the snapshot before the last one (or null if only one entry)
    const newPast = state.past.slice(0, -1)
    return newPast.length > 0 ? newPast[newPast.length - 1].snapshot : null
  },

  redo: () => {
    const state = get()
    if (state.future.length === 0) return null

    const next = state.future[0]
    set((s) => ({
      past: [...s.past, next],
      future: s.future.slice(1),
    }))

    return next.snapshot
  },

  canUndo: () => get().past.length > 1,
  canRedo: () => get().future.length > 0,

  clearHistory: () => {
    set({ past: [], future: [] })
  },
}))
