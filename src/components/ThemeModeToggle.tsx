import { Moon, Sun, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSettingsStore } from '@/stores'

export function ThemeModeToggle() {
  const { themeMode, setThemeMode } = useSettingsStore()

  const modes = [
    { value: 'system' as const, icon: Monitor, label: 'システム' },
    { value: 'light' as const, icon: Sun, label: 'ライト' },
    { value: 'dark' as const, icon: Moon, label: 'ダーク' },
  ]

  const currentIndex = modes.findIndex((m) => m.value === themeMode)
  const nextMode = modes[(currentIndex + 1) % modes.length]
  const CurrentIcon = modes[currentIndex].icon

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => setThemeMode(nextMode.value)}
      title={`現在: ${modes[currentIndex].label} / クリックで${nextMode.label}に切り替え`}
    >
      <CurrentIcon className="h-4 w-4" />
    </Button>
  )
}
