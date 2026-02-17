import { HexColorPicker, HexColorInput } from 'react-colorful'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useHighlightStore } from '@/stores'
import { COLOR_KEY_LABELS } from '@/constants'
import type { ThemeColorKey } from '@/types'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const setHoveredKey = useHighlightStore((s) => s.setHoveredKey)
  const displayName = COLOR_KEY_LABELS[label as ThemeColorKey] || label

  return (
    <div
      className="flex items-center gap-2"
      onMouseEnter={() => setHoveredKey(label)}
      onMouseLeave={() => setHoveredKey(null)}
    >
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="h-6 w-6 shrink-0 rounded border border-border transition-shadow hover:ring-2 hover:ring-ring"
            style={{ backgroundColor: value }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" side="right" align="start">
          <HexColorPicker color={value} onChange={onChange} />
        </PopoverContent>
      </Popover>
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs" title={label}>{displayName}</div>
        <HexColorInput
          color={value}
          onChange={onChange}
          prefixed
          className="w-full bg-transparent text-xs text-muted-foreground outline-none"
        />
      </div>
    </div>
  )
}
