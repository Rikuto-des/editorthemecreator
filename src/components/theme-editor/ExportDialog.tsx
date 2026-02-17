import { useState } from 'react'
import { Download, ExternalLink, FileJson, Package, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { downloadThemeAsJson, buildVsix, downloadVsix, openVSCode, openWindsurf } from '@/utils'
import type { Theme } from '@/types'

interface ExportDialogProps {
  theme: Theme
}

type ExportStep = 'choose' | 'vsix-done'

export function ExportDialog({ theme }: ExportDialogProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<ExportStep>('choose')
  const [loading, setLoading] = useState(false)

  const handleReset = () => {
    setStep('choose')
    setLoading(false)
  }

  const handleOpenChange = (value: boolean) => {
    setOpen(value)
    if (!value) handleReset()
  }

  const handleJsonExport = () => {
    downloadThemeAsJson(theme)
    toast.success(`"${theme.name}" を JSON でエクスポートしました`)
    setOpen(false)
  }

  const handleVsixExport = async () => {
    setLoading(true)
    try {
      const blob = await buildVsix(theme)
      downloadVsix(blob, theme.name)
      setStep('vsix-done')
    } catch {
      toast.error('VSIX の生成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Download className="mr-1 h-4 w-4" />
          エクスポート
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {step === 'choose' && (
          <>
            <DialogHeader>
              <DialogTitle>テーマをエクスポート</DialogTitle>
              <DialogDescription>
                エクスポート形式を選択してください
              </DialogDescription>
            </DialogHeader>

            <div className="mt-2 space-y-3">
              <button
                onClick={handleJsonExport}
                className="flex w-full items-start gap-4 rounded-lg border border-border p-4 text-left transition-colors hover:bg-accent"
              >
                <FileJson className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                <div>
                  <div className="font-medium">JSON ファイル</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    VS Code 互換の .json テーマファイルをダウンロード。手動で拡張機能フォルダに配置して使用します。
                  </div>
                </div>
              </button>

              <button
                onClick={handleVsixExport}
                disabled={loading}
                className="flex w-full items-start gap-4 rounded-lg border border-primary/50 bg-primary/5 p-4 text-left transition-colors hover:bg-primary/10 disabled:opacity-50"
              >
                <Package className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <div className="font-medium">
                    VSIX パッケージ
                    <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-normal text-primary">
                      おすすめ
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    VS Code / Windsurf にそのままインストールできる .vsix ファイルを生成。ダウンロード後すぐに適用できます。
                  </div>
                </div>
              </button>
            </div>
          </>
        )}

        {step === 'vsix-done' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                VSIX をダウンロードしました
              </DialogTitle>
              <DialogDescription>
                以下のいずれかの方法でテーマをインストールできます
              </DialogDescription>
            </DialogHeader>

            <div className="mt-2 space-y-4">
              <div className="space-y-3 text-sm">
                <div className="rounded-lg border border-border p-3">
                  <div className="mb-1 font-medium">方法 1: ドラッグ&ドロップ</div>
                  <div className="text-xs text-muted-foreground">
                    ダウンロードした .vsix ファイルを VS Code の拡張機能パネルにドラッグ&ドロップ
                  </div>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <div className="mb-1 font-medium">方法 2: コマンドパレットから</div>
                  <div className="text-xs text-muted-foreground">
                    <strong>Ctrl+Shift+P</strong> →「Extensions: Install from VSIX...」→ ダウンロードしたファイルを選択
                  </div>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <div className="mb-1 font-medium">方法 3: ターミナルから</div>
                  <div className="rounded bg-muted px-2 py-1 font-mono text-xs">
                    code --install-extension {theme.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'custom-theme'}.vsix
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => {
                    openVSCode()
                    toast.success('VS Code を起動しています...')
                  }}
                >
                  <ExternalLink className="mr-1 h-4 w-4" />
                  VS Code を開く
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    openWindsurf()
                    toast.success('Windsurf を起動しています...')
                  }}
                >
                  <ExternalLink className="mr-1 h-4 w-4" />
                  Windsurf を開く
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
