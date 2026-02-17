import { useEffect, useCallback, useRef } from 'react'
import { ArrowLeft, Undo2, Redo2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useThemeStore, useHistoryStore } from '@/stores'
import { useKeyboardShortcuts } from '@/hooks'
import { AIGenerateDialog } from '@/components/theme-list/AIGenerateDialog'
import { EditorPanel } from './EditorPanel'
import { PreviewPanel } from './PreviewPanel'
import { ThemeNameEditor } from './ThemeNameEditor'
import { ExportDialog } from './ExportDialog'

interface ThemeEditorProps {
  themeId: string
  onBack: () => void
  aiLoading?: boolean
  onAIRegenerate?: (themeId: string, description: string) => void
  lastPrompt?: string
  creditsRemaining?: number
}

export function ThemeEditor({ themeId, onBack, aiLoading = false, onAIRegenerate, lastPrompt = '', creditsRemaining }: ThemeEditorProps) {
  const theme = useThemeStore((state) => state.themes.find((t) => t.id === themeId))
  const updateTheme = useThemeStore((state) => state.updateTheme)
  const { pushHistory, undo, redo, canUndo, canRedo, clearHistory } = useHistoryStore()
  const prevThemeRef = useRef<string | null>(null)

  // テーマ切り替え時に履歴をクリアして初期状態を保存
  useEffect(() => {
    clearHistory()
    if (theme) {
      pushHistory(theme)
    }
  }, [themeId]) // eslint-disable-line react-hooks/exhaustive-deps

  // AI生成完了時にテーマが変わったら履歴に保存
  useEffect(() => {
    if (!theme || aiLoading) return
    const themeJson = JSON.stringify({ colors: theme.colors, tokenColors: theme.tokenColors })
    if (prevThemeRef.current !== null && prevThemeRef.current !== themeJson) {
      pushHistory(theme)
    }
    prevThemeRef.current = themeJson
  }, [theme, aiLoading]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleUndo = useCallback(() => {
    const snapshot = undo()
    if (snapshot) {
      updateTheme(snapshot.id, snapshot)
    }
  }, [undo, updateTheme])

  const handleRedo = useCallback(() => {
    const snapshot = redo()
    if (snapshot) {
      updateTheme(snapshot.id, snapshot)
    }
  }, [redo, updateTheme])

  const handleSave = useCallback(() => {
    toast.success('保存済み', { duration: 1500 })
  }, [])

  const handleAIRegenerate = useCallback((description: string) => {
    if (onAIRegenerate && theme) {
      pushHistory(theme)
      onAIRegenerate(theme.id, description)
    }
  }, [onAIRegenerate, theme, pushHistory])

  useKeyboardShortcuts({
    onSave: handleSave,
    onUndo: handleUndo,
    onRedo: handleRedo,
  })

  if (!theme) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        テーマが見つかりません
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-73px)] flex-col">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            戻る
          </Button>
          <ThemeNameEditor themeId={theme.id} name={theme.name} />
        </div>
        <div className="flex items-center gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={handleUndo}
                disabled={!canUndo() || aiLoading}
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>元に戻す (Ctrl+Z)</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={handleRedo}
                disabled={!canRedo() || aiLoading}
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>やり直し (Ctrl+Shift+Z)</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="mx-1 h-5" />
          {onAIRegenerate && (
            <AIGenerateDialog
              onSubmit={handleAIRegenerate}
              triggerLabel="AIで再生成"
              triggerVariant="outline"
              triggerSize="sm"
              title="AIでテーマを再生成"
              descriptionText="新しいイメージを入力してください。現在のテーマはAI生成前の状態にUndoで戻せます。"
              initialPrompt={lastPrompt}
              creditsRemaining={creditsRemaining}
            />
          )}
          <span className="hidden text-xs text-muted-foreground sm:inline">自動保存済み</span>
          <ExportDialog theme={theme} />
        </div>
      </div>
      <div className="relative flex flex-1 overflow-hidden">
        {aiLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">AIがテーマを生成中...</p>
            <p className="mt-1 text-sm text-muted-foreground">しばらくお待ちください</p>
          </div>
        )}
        <div className="w-80 shrink-0 overflow-y-auto border-r border-border">
          <EditorPanel theme={theme} />
        </div>
        <div className="flex-1 overflow-hidden">
          <PreviewPanel theme={theme} />
        </div>
      </div>
    </div>
  )
}
