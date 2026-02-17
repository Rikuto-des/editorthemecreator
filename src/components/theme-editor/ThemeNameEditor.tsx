import { useState, useRef, useEffect } from 'react'
import { Pencil, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useThemeStore } from '@/stores'

interface ThemeNameEditorProps {
  themeId: string
  name: string
}

export function ThemeNameEditor({ themeId, name }: ThemeNameEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(name)
  const inputRef = useRef<HTMLInputElement>(null)
  const updateTheme = useThemeStore((state) => state.updateTheme)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = () => {
    const trimmed = editValue.trim()
    if (trimmed) {
      updateTheme(themeId, { name: trimmed })
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditValue(name)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-8 w-48"
        />
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSave}>
          <Check className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <h2 className="text-lg font-semibold">{name}</h2>
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8"
        onClick={() => setIsEditing(true)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  )
}
