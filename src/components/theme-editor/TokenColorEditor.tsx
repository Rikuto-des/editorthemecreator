import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { HexColorPicker, HexColorInput } from 'react-colorful'
import type { TokenColor } from '@/types'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useHighlightStore } from '@/stores'

interface TokenColorEditorProps {
  tokenColor: TokenColor
  onChange: (updated: TokenColor) => void
}

export function TokenColorEditor({ tokenColor, onChange }: TokenColorEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const setHoveredScope = useHighlightStore((s) => s.setHoveredScope)

  const handleColorChange = (color: string) => {
    onChange({
      ...tokenColor,
      settings: { ...tokenColor.settings, foreground: color },
    })
  }

  const foreground = tokenColor.settings.foreground || '#ffffff'

  return (
    <div
      className="rounded-md border border-border"
      onMouseEnter={() => {
        const scope = Array.isArray(tokenColor.scope) ? tokenColor.scope[0] : tokenColor.scope
        setHoveredScope(scope)
      }}
      onMouseLeave={() => setHoveredScope(null)}
    >
      <button
        type="button"
        className="flex w-full items-center gap-2 p-2 text-left hover:bg-muted/50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0" />
        )}
        <div
          className="h-4 w-4 shrink-0 rounded border border-border"
          style={{ backgroundColor: foreground }}
        />
        <span className="truncate text-sm font-medium">{tokenColor.name}</span>
      </button>
      {isExpanded && (
        <div className="border-t border-border p-3">
          <div className="mb-2 text-xs text-muted-foreground">
            Scope: {Array.isArray(tokenColor.scope) ? tokenColor.scope.join(', ') : tokenColor.scope}
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="h-8 w-8 shrink-0 rounded border border-border transition-shadow hover:ring-2 hover:ring-ring"
                  style={{ backgroundColor: foreground }}
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" side="right" align="start">
                <HexColorPicker color={foreground} onChange={handleColorChange} />
              </PopoverContent>
            </Popover>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">前景色</div>
              <HexColorInput
                color={foreground}
                onChange={handleColorChange}
                prefixed
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
