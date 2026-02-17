import { useEffect, useCallback } from 'react'

interface ShortcutHandlers {
  onSave?: () => void
  onUndo?: () => void
  onRedo?: () => void
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const modifier = isMac ? e.metaKey : e.ctrlKey

      if (modifier && e.key === 's') {
        e.preventDefault()
        handlers.onSave?.()
      }

      if (modifier && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        handlers.onUndo?.()
      }

      if (modifier && e.shiftKey && e.key === 'z') {
        e.preventDefault()
        handlers.onRedo?.()
      }

      // Windows/Linux: Ctrl+Y for redo
      if (!isMac && modifier && e.key === 'y') {
        e.preventDefault()
        handlers.onRedo?.()
      }
    },
    [handlers]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
