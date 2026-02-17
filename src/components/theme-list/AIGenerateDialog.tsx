import { useState, useRef, useEffect } from 'react'
import { Sparkles, AlertCircle, Command } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const SUGGESTION_CHIPS = [
  '桜をイメージしたピンク系ダークテーマ',
  'サイバーパンク風ネオンカラー',
  '海と空のブルー系ライトテーマ',
  '紅葉をイメージした暖色系',
  'ミニマルなモノクロテーマ',
  'レトロゲーム風ドット絵カラー',
]

interface AIGenerateDialogProps {
  onSubmit: (description: string) => void
  triggerLabel?: string
  triggerVariant?: 'outline' | 'ghost' | 'default'
  triggerSize?: 'sm' | 'icon' | 'default'
  title?: string
  descriptionText?: string
  initialPrompt?: string
}

export function AIGenerateDialog({
  onSubmit,
  triggerLabel = 'AIで生成',
  triggerVariant = 'outline',
  triggerSize = 'sm',
  title = 'AIテーマ生成',
  descriptionText = '作りたいテーマのイメージを日本語で入力してください。AIがカラーテーマを自動生成します。',
  initialPrompt = '',
}: AIGenerateDialogProps) {
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const el = textareaRef.current
        if (el) {
          el.focus()
          el.selectionStart = el.selectionEnd = el.value.length
        }
      }, 100)
    }
  }, [open])

  const handleSubmit = () => {
    if (!description.trim()) return
    setError(null)
    onSubmit(description.trim())
    setOpen(false)
    setDescription('')
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (nextOpen && initialPrompt && !description) {
      setDescription(initialPrompt)
    }
    if (!nextOpen) {
      setError(null)
    }
  }

  const isMac = typeof navigator !== 'undefined' && navigator.userAgent.includes('Mac')

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size={triggerSize} variant={triggerVariant}>
          <Sparkles className="mr-1 h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            {title}
          </DialogTitle>
          <DialogDescription>
            {descriptionText}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium" htmlFor="ai-description">
                テーマの説明
              </label>
              <span className={`text-xs tabular-nums ${description.length > 200 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {description.length}/200
              </span>
            </div>
            <textarea
              ref={textareaRef}
              id="ai-description"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              placeholder="どんなテーマを作りたいですか？"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 200))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSubmit()
                }
              }}
            />
          </div>

          {initialPrompt && (
            <div className="rounded-md border border-border/50 bg-muted/30 px-3 py-2">
              <p className="text-[11px] font-medium text-muted-foreground">前回のプロンプト:</p>
              <p className="mt-0.5 text-xs text-foreground/80">{initialPrompt}</p>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">アイデア:</p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTION_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => setDescription(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="flex-row items-center justify-between sm:justify-between">
          <Badge variant="outline" className="hidden gap-1 text-[10px] text-muted-foreground sm:flex">
            {isMac ? <><Command className="h-2.5 w-2.5" /> + Enter</> : 'Ctrl + Enter'}
            で送信
          </Badge>
          <Button
            onClick={handleSubmit}
            disabled={!description.trim()}
          >
            <Sparkles className="mr-1 h-4 w-4" />
            テーマを生成
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
