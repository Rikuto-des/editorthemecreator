import { create } from 'zustand'

interface HighlightState {
  /** 現在ホバー中のカラーキー (例: 'editor.background') */
  hoveredKey: string | null
  /** 現在ホバー中のトークンスコープ (例: 'keyword') */
  hoveredScope: string | null
  setHoveredKey: (key: string | null) => void
  setHoveredScope: (scope: string | null) => void
}

export const useHighlightStore = create<HighlightState>((set) => ({
  hoveredKey: null,
  hoveredScope: null,
  setHoveredKey: (key) => set({ hoveredKey: key }),
  setHoveredScope: (scope) => set({ hoveredScope: scope }),
}))
