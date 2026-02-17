import { useState } from 'react'
import { Plus, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { THEME_TEMPLATES } from '@/constants'
import type { ThemeTemplate } from '@/constants'

interface TemplatePickerProps {
  onSelect: (template: ThemeTemplate) => void
}

export function TemplatePicker({ onSelect }: TemplatePickerProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (template: ThemeTemplate) => {
    onSelect(template)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" />
          新規作成
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            テンプレートを選択
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto pr-2 -mr-2">
          <div className="grid grid-cols-2 gap-3">
            {THEME_TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                className="group rounded-lg border border-border p-3 text-left transition-all hover:border-primary hover:shadow-md hover:ring-1 hover:ring-primary/30"
                onClick={() => handleSelect(template)}
              >
                <div className="mb-2 flex h-10 overflow-hidden rounded-md">
                  <div className="flex-[2]" style={{ backgroundColor: template.colors['editor.background'] }} />
                  <div className="flex-1" style={{ backgroundColor: template.colors['sideBar.background'] }} />
                  <div className="w-3" style={{ backgroundColor: template.colors['activityBar.background'] }} />
                  <div className="flex-[3] relative" style={{ backgroundColor: template.colors['editor.background'] }}>
                    <div className="absolute inset-x-1 top-1 h-1 rounded-sm" style={{ backgroundColor: template.colors['tab.activeBorder'] || template.colors['statusBar.background'] }} />
                    <div className="absolute left-2 top-3 text-[5px] font-mono leading-tight">
                      <span style={{ color: template.colors['editor.foreground'] }}>fn </span>
                      <span style={{ color: template.tokenColors.find(t => t.name === 'Function')?.settings.foreground || template.colors['editor.foreground'] }}>hello</span>
                      <span style={{ color: template.colors['editor.foreground'] }}>()</span>
                    </div>
                  </div>
                </div>
                <div className="h-1.5 rounded-full" style={{ backgroundColor: template.colors['statusBar.background'] }} />
                <div className="mt-2 font-medium text-sm">{template.name}</div>
                <div className="text-xs text-muted-foreground">{template.description}</div>
                <span className="mt-1 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium" style={{
                  backgroundColor: template.type === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                  color: template.type === 'dark' ? '#aaa' : '#666',
                }}>
                  {template.type === 'dark' ? 'Dark' : 'Light'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
