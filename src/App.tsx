import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { BookOpen, Palette, FolderOpen } from 'lucide-react'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { AuthProvider } from '@/contexts/AuthContext'
import { UserMenu, UpgradeModal } from '@/components/auth'
import { PromptLanding } from '@/components/home'
import { ThemeList } from '@/components/theme-list'
import { ThemeEditor } from '@/components/theme-editor'
import { GuidePage } from '@/components/guide'
import { ThemeModeToggle } from '@/components/ThemeModeToggle'
import { useThemeMode, useCredits, useThemeSync } from '@/hooks'
import { useThemeStore } from '@/stores'
import { createDefaultTheme } from '@/constants'
import type { ThemeTemplate } from '@/constants'
import { generateThemeFromDescription } from '@/utils/ai-theme-generator'
import './App.css'

type View = 'home' | 'themes' | 'editor' | 'guide'

function AppContent() {
  const [view, setView] = useState<View>('home')
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [lastPrompt, setLastPrompt] = useState('')
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const { credits, consumeCredit } = useCredits()
  const themes = useThemeStore((s) => s.themes)
  const addTheme = useThemeStore((s) => s.addTheme)
  const updateTheme = useThemeStore((s) => s.updateTheme)
  const setCurrentTheme = useThemeStore((s) => s.setCurrentTheme)
  const abortRef = useRef<AbortController | null>(null)

  useThemeMode()
  useThemeSync()

  // Stripe決済結果のURLパラメータを検知
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const payment = params.get('payment')
    if (payment === 'success') {
      toast.success('クレジットの購入が完了しました！', { description: '20回分のAI生成クレジットが追加されました。' })
      window.history.replaceState({}, '', window.location.pathname)
    } else if (payment === 'cancel') {
      toast.info('購入がキャンセルされました。')
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  const themeExists = useMemo(
    () => selectedThemeId != null && themes.some((t) => t.id === selectedThemeId),
    [themes, selectedThemeId],
  )
  const showEditor = view === 'editor' && selectedThemeId != null && themeExists

  const handleAIGenerate = useCallback(async (themeId: string, description: string) => {
    // クレジットチェック
    const ok = await consumeCredit()
    if (!ok) {
      setUpgradeOpen(true)
      return
    }

    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    setLastPrompt(description)
    setAiLoading(true)
    try {
      const generated = await generateThemeFromDescription(description)
      updateTheme(themeId, {
        name: generated.name,
        type: generated.type,
        colors: generated.colors,
        tokenColors: generated.tokenColors,
      })
      toast.success('テーマを生成しました')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'テーマの生成に失敗しました')
    } finally {
      setAiLoading(false)
    }
  }, [updateTheme, consumeCredit])

  const handleAISubmitFromHome = useCallback((description: string) => {
    if (!credits.canGenerate) {
      setUpgradeOpen(true)
      return
    }
    const placeholder = addTheme(createDefaultTheme('AI生成中...'))
    setSelectedThemeId(placeholder.id)
    setView('editor')
    handleAIGenerate(placeholder.id, description)
  }, [addTheme, handleAIGenerate, credits.canGenerate])

  const handleCreateFromTemplate = useCallback((template: ThemeTemplate) => {
    const now = new Date().toISOString()
    const newTheme = addTheme({
      id: crypto.randomUUID(),
      name: template.name,
      type: template.type,
      colors: { ...template.colors },
      tokenColors: template.tokenColors.map((tc) => ({
        ...tc,
        settings: { ...tc.settings },
      })),
      createdAt: now,
      updatedAt: now,
    })
    setSelectedThemeId(newTheme.id)
    setView('editor')
  }, [addTheme])

  const handleSelectTheme = (id: string) => {
    setCurrentTheme(id)
    setSelectedThemeId(id)
    setView('editor')
  }

  const handleGoHome = () => {
    setView('home')
  }

  const isHomeOrThemes = view === 'home' || view === 'themes'

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <div
              className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-80"
              onClick={handleGoHome}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleGoHome()}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Palette className="h-4.5 w-4.5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight tracking-tight">Themeleon</h1>
                <p className="hidden text-[10px] leading-none text-muted-foreground sm:block">AI Theme Creator for VS Code</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {themes.length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={view === 'themes' ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setView('themes')}
                      className="gap-1.5 text-muted-foreground hover:text-foreground"
                    >
                      <FolderOpen className="h-4 w-4" />
                      <span className="hidden sm:inline">マイテーマ</span>
                      <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                        {themes.length}
                      </Badge>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>保存済みテーマを表示</TooltipContent>
                </Tooltip>
              )}
              <Button variant="ghost" size="sm" onClick={() => setView('guide')} className="text-muted-foreground hover:text-foreground">
                <BookOpen className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">使い方</span>
              </Button>
              <UserMenu />
              <ThemeModeToggle />
            </div>
          </div>
        </header>
        <main className={showEditor ? '' : 'mx-auto max-w-7xl p-4 sm:p-6'}>
          {view === 'home' && (
            <PromptLanding
              onAISubmit={handleAISubmitFromHome}
              onCreateFromTemplate={handleCreateFromTemplate}
              onSelectTheme={handleSelectTheme}
              onViewAllThemes={() => setView('themes')}
              aiLoading={aiLoading}
            />
          )}
          {view === 'guide' && <GuidePage onBack={handleGoHome} />}
          {view === 'themes' && <ThemeList onSelectTheme={handleSelectTheme} onAIGenerate={handleAIGenerate} />}
          {showEditor && (
            <ThemeEditor themeId={selectedThemeId!} onBack={handleGoHome} aiLoading={aiLoading} onAIRegenerate={handleAIGenerate} lastPrompt={lastPrompt} creditsRemaining={credits.remaining} />
          )}
        </main>
        {isHomeOrThemes && (
          <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
            <div className="mx-auto max-w-3xl space-y-3 px-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider">Credits &amp; Acknowledgments</p>
              <p>
                テンプレートテーマの配色は以下のテーマにインスパイアされています:
              </p>
              <p className="leading-relaxed">
                <a href="https://monokai.pro/" target="_blank" rel="noopener noreferrer" className="underline decoration-muted-foreground/30 underline-offset-2 transition-colors hover:text-foreground hover:decoration-foreground/50">Monokai</a> by Wimer Hazenberg
                {' / '}
                <a href="https://draculatheme.com/" target="_blank" rel="noopener noreferrer" className="underline decoration-muted-foreground/30 underline-offset-2 transition-colors hover:text-foreground hover:decoration-foreground/50">Dracula</a> by Zeno Rocha
                {' / '}
                <a href="https://www.nordtheme.com/" target="_blank" rel="noopener noreferrer" className="underline decoration-muted-foreground/30 underline-offset-2 transition-colors hover:text-foreground hover:decoration-foreground/50">Nord</a> by Arctic Ice Studio
                {' / '}
                <a href="https://ethanschoonover.com/solarized/" target="_blank" rel="noopener noreferrer" className="underline decoration-muted-foreground/30 underline-offset-2 transition-colors hover:text-foreground hover:decoration-foreground/50">Solarized</a> by Ethan Schoonover
                {' / '}
                <a href="https://github.com/primer/github-vscode-theme" target="_blank" rel="noopener noreferrer" className="underline decoration-muted-foreground/30 underline-offset-2 transition-colors hover:text-foreground hover:decoration-foreground/50">GitHub Theme</a> by GitHub
                {' / '}
                <a href="https://github.com/atom/one-dark-syntax" target="_blank" rel="noopener noreferrer" className="underline decoration-muted-foreground/30 underline-offset-2 transition-colors hover:text-foreground hover:decoration-foreground/50">One Dark</a> by Atom
              </p>
              <p className="pt-1 text-muted-foreground/70">
                Built with React, Tailwind CSS, shadcn/ui, Zustand, Lucide Icons, react-colorful, JSZip
              </p>
              <p className="text-muted-foreground/50">&copy; {new Date().getFullYear()} Themeleon</p>
            </div>
          </footer>
        )}
        <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
        <Toaster richColors position="bottom-right" />
      </div>
    </TooltipProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
