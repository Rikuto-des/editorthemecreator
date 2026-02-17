import { Sparkles, Layers, ArrowRight } from 'lucide-react'
import type { ThemeTemplate } from '@/constants'
import { TemplatePicker } from './TemplatePicker'
import { AIGenerateDialog } from './AIGenerateDialog'

interface EmptyStateProps {
  onCreateFromTemplate: (template: ThemeTemplate) => void
  onAISubmit: (description: string) => void
}

export function EmptyState({ onCreateFromTemplate, onAISubmit }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
      </div>
      <h3 className="mb-2 text-xl font-semibold tracking-tight">テーマを作成しましょう</h3>
      <p className="mb-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
        AIに自然言語で指示するか、テンプレートから選んで<br />あなただけのVS Codeテーマを作成できます
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <AIGenerateDialog
          onSubmit={onAISubmit}
          triggerVariant="default"
          triggerSize="default"
          triggerLabel="AIで生成する"
        />
        <TemplatePicker onSelect={onCreateFromTemplate} />
      </div>

      <div className="mt-12 grid max-w-lg grid-cols-3 gap-6 text-center">
        <div className="space-y-2">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs font-medium">AIで生成</p>
          <p className="text-[11px] leading-snug text-muted-foreground">自然言語でイメージを伝える</p>
        </div>
        <div className="space-y-2">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <Layers className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs font-medium">カスタマイズ</p>
          <p className="text-[11px] leading-snug text-muted-foreground">全カラーを自由に編集</p>
        </div>
        <div className="space-y-2">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs font-medium">エクスポート</p>
          <p className="text-[11px] leading-snug text-muted-foreground">VS Code拡張として出力</p>
        </div>
      </div>
    </div>
  )
}
