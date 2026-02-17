import { Trash2, Moon, Sun } from 'lucide-react'
import { toast } from 'sonner'
import type { Theme } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useThemeStore } from '@/stores'

interface ThemeCardProps {
  theme: Theme
  isSelected: boolean
  onClick: () => void
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'たった今'
  if (minutes < 60) return `${minutes}分前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}時間前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}日前`
  return new Date(dateStr).toLocaleDateString('ja-JP')
}

export function ThemeCard({ theme, isSelected, onClick }: ThemeCardProps) {
  const { themes, deleteTheme, restoreTheme } = useThemeStore()

  const syntaxColors = theme.tokenColors.slice(0, 7).map((tc) => tc.settings.foreground)

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()

    const index = themes.findIndex((t) => t.id === theme.id)
    const backup = { ...theme }

    deleteTheme(theme.id)

    toast(`「${theme.name}」を削除しました`, {
      action: {
        label: '元に戻す',
        onClick: () => {
          restoreTheme(backup, index)
        },
      },
      duration: 5000,
    })
  }

  return (
    <Card
      className={`group relative cursor-pointer transition-all duration-200 hover:shadow-lg hover:ring-2 hover:ring-primary/50 hover:-translate-y-0.5 ${
        isSelected ? 'ring-2 ring-primary shadow-lg' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Mini VS Code Layout Preview */}
        <div className="relative mb-3 overflow-hidden rounded-lg border border-border/50 shadow-sm" style={{ height: 100 }}>
          {/* Title Bar */}
          <div className="flex h-[14px] items-center px-1.5" style={{ backgroundColor: theme.colors['titleBar.activeBackground'] }}>
            <div className="flex gap-[3px]">
              <div className="h-[5px] w-[5px] rounded-full opacity-60" style={{ backgroundColor: '#ff5f57' }} />
              <div className="h-[5px] w-[5px] rounded-full opacity-60" style={{ backgroundColor: '#febc2e' }} />
              <div className="h-[5px] w-[5px] rounded-full opacity-60" style={{ backgroundColor: '#28c840' }} />
            </div>
          </div>
          <div className="flex" style={{ height: 'calc(100% - 14px - 12px)' }}>
            {/* Activity Bar */}
            <div className="flex w-[18px] shrink-0 flex-col items-center gap-[3px] pt-[4px]" style={{ backgroundColor: theme.colors['activityBar.background'] }}>
              <div className="h-[5px] w-[9px] rounded-[1px] opacity-40" style={{ backgroundColor: theme.colors['activityBar.foreground'] }} />
              <div className="h-[5px] w-[9px] rounded-[1px] opacity-25" style={{ backgroundColor: theme.colors['activityBar.inactiveForeground'] }} />
              <div className="h-[5px] w-[9px] rounded-[1px] opacity-25" style={{ backgroundColor: theme.colors['activityBar.inactiveForeground'] }} />
            </div>
            {/* Sidebar */}
            <div className="w-[42px] shrink-0 p-[3px]" style={{ backgroundColor: theme.colors['sideBar.background'] }}>
              <div className="mb-[2px] h-[4px] w-[70%] rounded-[1px] opacity-40" style={{ backgroundColor: theme.colors['sideBar.foreground'] }} />
              <div className="mb-[2px] ml-[4px] h-[3px] w-[55%] rounded-[1px] opacity-25" style={{ backgroundColor: theme.colors['sideBar.foreground'] }} />
              <div className="mb-[2px] ml-[4px] h-[3px] w-[65%] rounded-[1px] opacity-25" style={{ backgroundColor: theme.colors['sideBar.foreground'] }} />
              <div className="mb-[2px] ml-[4px] h-[3px] w-[45%] rounded-[1px] opacity-25" style={{ backgroundColor: theme.colors['sideBar.foreground'] }} />
              <div className="mb-[2px] h-[4px] w-[70%] rounded-[1px] opacity-40" style={{ backgroundColor: theme.colors['sideBar.foreground'] }} />
              <div className="mb-[2px] ml-[4px] h-[3px] w-[50%] rounded-[1px] opacity-25" style={{ backgroundColor: theme.colors['sideBar.foreground'] }} />
            </div>
            {/* Editor Area */}
            <div className="flex flex-1 flex-col overflow-hidden" style={{ backgroundColor: theme.colors['editor.background'] }}>
              {/* Tab Bar */}
              <div className="flex h-[12px] shrink-0">
                <div className="flex items-center px-[4px]" style={{ backgroundColor: theme.colors['tab.activeBackground'] }}>
                  <div className="h-[3px] w-[16px] rounded-[1px] opacity-50" style={{ backgroundColor: theme.colors['tab.activeForeground'] }} />
                </div>
                <div className="flex items-center px-[4px]" style={{ backgroundColor: theme.colors['tab.inactiveBackground'] }}>
                  <div className="h-[3px] w-[12px] rounded-[1px] opacity-30" style={{ backgroundColor: theme.colors['tab.inactiveForeground'] }} />
                </div>
              </div>
              {/* Code Lines */}
              <div className="flex-1 p-[4px] space-y-[3px]">
                <div className="flex items-center gap-[3px]">
                  <div className="h-[3px] w-[14px] rounded-[1px]" style={{ backgroundColor: syntaxColors[4], opacity: 0.8 }} />
                  <div className="h-[3px] w-[18px] rounded-[1px]" style={{ backgroundColor: syntaxColors[6], opacity: 0.8 }} />
                  <div className="h-[3px] w-[6px] rounded-[1px] opacity-40" style={{ backgroundColor: theme.colors['editor.foreground'] }} />
                </div>
                <div className="flex items-center gap-[3px]">
                  <div className="ml-[6px] h-[3px] w-[10px] rounded-[1px]" style={{ backgroundColor: syntaxColors[1], opacity: 0.8 }} />
                  <div className="h-[3px] w-[20px] rounded-[1px]" style={{ backgroundColor: syntaxColors[1], opacity: 0.8 }} />
                </div>
                <div className="flex items-center gap-[3px]">
                  <div className="ml-[6px] h-[3px] w-[16px] rounded-[1px]" style={{ backgroundColor: syntaxColors[3], opacity: 0.8 }} />
                  <div className="h-[3px] w-[6px] rounded-[1px]" style={{ backgroundColor: syntaxColors[5], opacity: 0.8 }} />
                  <div className="h-[3px] w-[10px] rounded-[1px]" style={{ backgroundColor: syntaxColors[2], opacity: 0.8 }} />
                </div>
                <div className="flex items-center gap-[3px]">
                  <div className="h-[3px] w-[12px] rounded-[1px] opacity-40" style={{ backgroundColor: syntaxColors[0] }} />
                  <div className="h-[3px] w-[24px] rounded-[1px] opacity-40" style={{ backgroundColor: syntaxColors[0] }} />
                </div>
                <div className="flex items-center gap-[3px]">
                  <div className="h-[3px] w-[10px] rounded-[1px]" style={{ backgroundColor: syntaxColors[4], opacity: 0.8 }} />
                  <div className="h-[3px] w-[14px] rounded-[1px]" style={{ backgroundColor: syntaxColors[6], opacity: 0.8 }} />
                </div>
              </div>
            </div>
          </div>
          {/* Status Bar */}
          <div className="h-[12px]" style={{ backgroundColor: theme.colors['statusBar.background'] }} />

          {/* Theme Type Badge */}
          <Badge
            variant="secondary"
            className="absolute bottom-1.5 right-1.5 h-5 gap-0.5 px-1.5 text-[10px] opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
          >
            {theme.type === 'dark' ? <Moon className="h-2.5 w-2.5" /> : <Sun className="h-2.5 w-2.5" />}
            {theme.type === 'dark' ? 'Dark' : 'Light'}
          </Badge>
        </div>

        {/* Syntax Color Dots */}
        <div className="mb-2.5 flex gap-1">
          {syntaxColors.map((color, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  className="h-3.5 w-3.5 rounded-full border border-border/30 transition-transform hover:scale-125"
                  style={{ backgroundColor: color }}
                />
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {theme.tokenColors[index]?.name}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold leading-tight">{theme.name}</h3>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {formatRelativeTime(theme.updatedAt)}
            </p>
          </div>
        </div>
      </CardContent>
      <div className="absolute right-2 top-2 opacity-0 transition-all group-hover:opacity-100">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="destructive"
              className="h-7 w-7 shadow-sm"
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>テーマを削除</TooltipContent>
        </Tooltip>
      </div>
    </Card>
  )
}
