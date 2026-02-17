import { useState, useRef, useEffect } from 'react'
import { Sparkles, ArrowRight, Loader2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useThemeStore } from '@/stores'
import { useCredits } from '@/hooks'
import { THEME_TEMPLATES } from '@/constants'
import type { ThemeTemplate } from '@/constants'

const SUGGESTION_CHIPS = [
  '桜をイメージしたピンク系ダークテーマ',
  'サイバーパンク風ネオンカラー',
  '海と空のブルー系ライトテーマ',
  '紅葉をイメージした暖色系',
  'ミニマルなモノクロテーマ',
  'レトロゲーム風ドット絵カラー',
  '森の中にいるような落ち着いたグリーン系',
  '宇宙をテーマにしたダークテーマ',
]

interface PromptLandingProps {
  onAISubmit: (description: string) => void
  onCreateFromTemplate: (template: ThemeTemplate) => void
  onSelectTheme: (id: string) => void
  onViewAllThemes: () => void
  aiLoading: boolean
}

export function PromptLanding({
  onAISubmit,
  onCreateFromTemplate,
  onSelectTheme,
  onViewAllThemes,
  aiLoading,
}: PromptLandingProps) {
  const [prompt, setPrompt] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const themes = useThemeStore((s) => s.themes)
  const recentThemes = themes.slice(0, 4)
  const { credits } = useCredits()

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const handleSubmit = () => {
    if (!prompt.trim() || aiLoading) return
    onAISubmit(prompt.trim())
    setPrompt('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-57px)] flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-8">
        {/* Hero */}
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            どんなテーマを作りますか？
          </h2>
          <p className="text-base text-muted-foreground">
            イメージを伝えるだけで、AIがVS Codeテーマを生成します
          </p>
        </div>

        {/* Prompt Input */}
        <div className="w-full max-w-2xl">
          <div className="relative rounded-xl border border-border bg-card shadow-lg transition-shadow focus-within:shadow-xl focus-within:ring-2 focus-within:ring-primary/20">
            <textarea
              ref={textareaRef}
              className="w-full resize-none rounded-xl bg-transparent px-5 pt-4 pb-14 text-base placeholder:text-muted-foreground/60 focus:outline-none"
              placeholder="例: 夜空をイメージした深いブルーのダークテーマ..."
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, 200))}
              onKeyDown={handleKeyDown}
              disabled={aiLoading}
            />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              <span className={`text-xs tabular-nums ${prompt.length > 180 ? 'text-destructive' : 'text-muted-foreground/50'}`}>
                {prompt.length > 0 && `${prompt.length}/200`}
              </span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1 px-2 text-[10px]">
                  <Sparkles className="h-2.5 w-2.5" />
                  残り{credits.remaining}回
                </Badge>
                <span className="hidden text-xs text-muted-foreground/50 sm:inline">
                  {navigator.userAgent.includes('Mac') ? '⌘' : 'Ctrl'} + Enter
                </span>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={!prompt.trim() || aiLoading}
                  className="gap-1.5 rounded-lg"
                >
                  {aiLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {aiLoading ? '生成中...' : '生成する'}
                </Button>
              </div>
            </div>
          </div>

          {/* Suggestion Chips */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {SUGGESTION_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                disabled={aiLoading}
                className="rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-foreground disabled:opacity-50"
                onClick={() => setPrompt(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Template Section */}
        <div className="mt-12 w-full max-w-2xl">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">または テンプレートから始める</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {THEME_TEMPLATES.slice(0, 6).map((template) => (
              <button
                key={template.id}
                type="button"
                className="group flex flex-col items-center gap-1.5 rounded-lg border border-border/60 bg-card p-3 text-center transition-all hover:border-primary/40 hover:shadow-md"
                onClick={() => onCreateFromTemplate(template)}
              >
                <div className="flex h-8 w-full overflow-hidden rounded-md">
                  <div className="flex-1" style={{ backgroundColor: template.colors['editor.background'] }} />
                  <div className="w-1" style={{ backgroundColor: template.colors['activityBar.background'] }} />
                  <div className="flex-[2]" style={{ backgroundColor: template.colors['editor.background'] }}>
                    <div className="mx-auto mt-1.5 h-0.5 w-3/4 rounded-full" style={{ backgroundColor: template.colors['statusBar.background'] }} />
                  </div>
                </div>
                <span className="text-[11px] font-medium leading-tight">{template.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Themes */}
        {recentThemes.length > 0 && (
          <div className="mt-10 w-full max-w-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">最近のテーマ</h3>
              <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground" onClick={onViewAllThemes}>
                すべて表示
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {recentThemes.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  className="group flex items-center gap-2.5 rounded-lg border border-border/60 bg-card p-2.5 text-left transition-all hover:border-primary/40 hover:shadow-md"
                  onClick={() => onSelectTheme(theme.id)}
                >
                  <div
                    className="h-8 w-8 shrink-0 rounded-md"
                    style={{ backgroundColor: theme.colors['editor.background'] }}
                  >
                    <div className="flex h-full items-center justify-center">
                      <div className="h-1 w-3 rounded-full" style={{ backgroundColor: theme.colors['statusBar.background'] }} />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium">{theme.name}</p>
                    <p className="text-[10px] text-muted-foreground">{theme.type === 'dark' ? 'Dark' : 'Light'}</p>
                  </div>
                  <ArrowRight className="ml-auto h-3 w-3 shrink-0 text-muted-foreground/0 transition-colors group-hover:text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
