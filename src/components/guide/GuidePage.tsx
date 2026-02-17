import { ArrowLeft, Download, Palette, Sparkles, FolderOpen, Copy, Check, Undo2, Redo2, Keyboard } from 'lucide-react'
import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'

interface GuidePageProps {
  onBack: () => void
}

function CodeBlock({ children, language = '' }: { children: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [children])

  return (
    <div className="group relative my-3 rounded-lg border border-border bg-muted/50">
      {language && (
        <div className="flex items-center justify-between border-b border-border px-4 py-1.5 text-xs text-muted-foreground">
          <span>{language}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded px-2 py-0.5 text-xs hover:bg-accent"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  )
}

function StepCard({
  step,
  title,
  children,
  icon,
}: {
  step: number
  title: string
  children: React.ReactNode
  icon: React.ReactNode
}) {
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-card p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
        {step}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-2">
          {icon}
          <h3 className="text-base font-semibold">{title}</h3>
        </div>
        <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
      </div>
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 mt-10 border-b border-border pb-2 text-xl font-bold first:mt-0">
      {children}
    </h2>
  )
}

export function GuidePage({ onBack }: GuidePageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-6">
        <ArrowLeft className="mr-1 h-4 w-4" />
        戻る
      </Button>

      <h1 className="mb-2 text-3xl font-bold">使い方ガイド</h1>
      <p className="mb-8 text-muted-foreground">
        Editor Theme Creator でテーマを作成し、VS Code / Windsurf に反映するまでの手順を解説します。
      </p>

      {/* ===== セクション1: テーマを作成する ===== */}
      <SectionHeading>テーマを作成する</SectionHeading>

      <p className="mb-4 text-sm text-muted-foreground">
        テーマの作成方法は2つあります。AIに自然言語で指示する方法と、テンプレートから選ぶ方法です。
      </p>

      <div className="space-y-4">
        <StepCard step={1} title="AIでテーマを生成する" icon={<Sparkles className="h-4 w-4 text-primary" />}>
          <p>
            トップページまたはテーマ編集画面の <strong>「AIで生成」</strong> ボタンをクリックします。
            ダイアログが開いたら、作りたいテーマのイメージを日本語で入力してください。
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>例: 「桜をイメージしたピンク系のダークテーマ」</li>
            <li>例: 「サイバーパンク風のネオンカラー」</li>
            <li>サジェストチップからワンクリックで入力することもできます</li>
            <li><strong>Cmd+Enter / Ctrl+Enter</strong> で送信</li>
          </ul>
        </StepCard>

        <StepCard step={2} title="テンプレートから作成する" icon={<Palette className="h-4 w-4 text-primary" />}>
          <p>
            <strong>「テンプレートから作成」</strong> ボタンをクリックすると、
            Monokai / Dracula / Nord などの人気テーマをベースにしたテンプレートが選べます。
            テンプレートを選択すると、すぐに編集画面に移動します。
          </p>
        </StepCard>
      </div>

      {/* ===== セクション2: テーマを編集する ===== */}
      <SectionHeading>テーマを編集する</SectionHeading>

      <div className="space-y-4">
        <StepCard step={1} title="カラーを編集する" icon={<Palette className="h-4 w-4 text-primary" />}>
          <p>
            テーマ編集画面では、左パネルに <strong>「UIカラー」</strong> と <strong>「シンタックス」</strong> の2つのタブがあります。
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li><strong>UIカラー</strong> — エディタ背景、サイドバー、タブ、ステータスバーなどのUI要素</li>
            <li><strong>シンタックス</strong> — コメント、文字列、キーワードなどのシンタックスハイライト</li>
          </ul>
          <p className="mt-2">
            カラーピッカーで色を変更すると、右側のプレビューに <strong>リアルタイム</strong> で反映されます。
          </p>
        </StepCard>

        <StepCard step={2} title="AIで再生成する" icon={<Sparkles className="h-4 w-4 text-primary" />}>
          <p>
            編集画面のツールバーにある <strong>「AIで再生成」</strong> ボタンで、
            現在のテーマを新しいイメージで上書きできます。
            再生成前の状態は履歴に保存されるので、いつでも元に戻せます。
          </p>
        </StepCard>

        <StepCard step={3} title="Undo / Redo で履歴を操作する" icon={<Undo2 className="h-4 w-4 text-primary" />}>
          <p>
            すべての変更（手動の色変更・AI再生成）は履歴に保存されます。
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li><strong>Ctrl+Z / Cmd+Z</strong> — 元に戻す（Undo）</li>
            <li><strong>Ctrl+Shift+Z / Cmd+Shift+Z</strong> — やり直し（Redo）</li>
            <li>変更は <strong>自動保存</strong> されます</li>
          </ul>
        </StepCard>
      </div>

      {/* ===== セクション3: エクスポート ===== */}
      <SectionHeading>テーマをエクスポートする</SectionHeading>

      <div className="space-y-4">
        <StepCard step={1} title="JSON / VSIX をエクスポートする" icon={<Download className="h-4 w-4 text-primary" />}>
          <p>
            編集画面右上の <strong>「エクスポート」</strong> ボタンをクリックすると、
            以下の形式でダウンロードできます。
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li><strong>JSON</strong> — VS Code テーマファイル単体</li>
            <li><strong>VSIX</strong> — VS Code 拡張機能パッケージ（そのままインストール可能）</li>
          </ul>
        </StepCard>
      </div>

      {/* ===== セクション4: VS Code への反映方法 ===== */}
      <SectionHeading>VS Code にテーマを反映する</SectionHeading>

      <div className="space-y-4">
        <StepCard step={1} title="VSIX からインストールする（推奨）" icon={<Download className="h-4 w-4 text-primary" />}>
          <p>
            エクスポートした <strong>.vsix</strong> ファイルを使う方法が最も簡単です。
          </p>
          <ol className="mt-2 list-inside list-decimal space-y-1">
            <li>VS Code を開く</li>
            <li>拡張機能パネル（<strong>Ctrl+Shift+X / Cmd+Shift+X</strong>）を開く</li>
            <li>右上の <strong>「...」</strong> → <strong>「VSIX からインストール」</strong> を選択</li>
            <li>ダウンロードした .vsix ファイルを選択</li>
          </ol>
        </StepCard>

        <StepCard step={2} title="手動で配置する場合" icon={<FolderOpen className="h-4 w-4 text-primary" />}>
          <p>JSON ファイルで手動配置する場合は、以下のフォルダ構成を作成します。</p>
          <CodeBlock language="plaintext">{`my-custom-theme/
├── package.json
└── themes/
    └── my-theme.json   ← エクスポートしたファイル`}</CodeBlock>
          <p className="mt-2"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">package.json</code> の内容:</p>
          <CodeBlock language="json">{`{
  "name": "my-custom-theme",
  "displayName": "My Custom Theme",
  "version": "1.0.0",
  "engines": { "vscode": "^1.60.0" },
  "categories": ["Themes"],
  "contributes": {
    "themes": [{
      "label": "My Custom Theme",
      "uiTheme": "vs-dark",
      "path": "./themes/my-theme.json"
    }]
  }
}`}</CodeBlock>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li><code className="rounded bg-muted px-1.5 py-0.5 text-xs">"vs-dark"</code> — ダークテーマの場合</li>
            <li><code className="rounded bg-muted px-1.5 py-0.5 text-xs">"vs"</code> — ライトテーマの場合</li>
          </ul>
          <p className="mt-2">作成したフォルダを拡張機能ディレクトリにコピーします:</p>
          <CodeBlock language="bash">{`# macOS / Linux
~/.vscode/extensions/my-custom-theme

# Windows
%USERPROFILE%\\.vscode\\extensions\\my-custom-theme`}</CodeBlock>
        </StepCard>

        <StepCard step={3} title="テーマを適用する" icon={<Palette className="h-4 w-4 text-primary" />}>
          <p>VS Code を再起動（またはリロード）した後:</p>
          <ol className="mt-2 list-inside list-decimal space-y-1">
            <li><strong>Ctrl+Shift+P</strong>（macOS: <strong>Cmd+Shift+P</strong>）でコマンドパレットを開く</li>
            <li><strong>「Preferences: Color Theme」</strong> と入力</li>
            <li>一覧から作成したテーマ名を選択</li>
          </ol>
        </StepCard>
      </div>

      {/* ===== セクション5: Windsurf への反映方法 ===== */}
      <SectionHeading>Windsurf にテーマを反映する</SectionHeading>

      <p className="mb-4 text-sm text-muted-foreground">
        Windsurf は VS Code ベースのエディタなので、基本的に同じ手順で反映できます。
        VSIX からのインストール方法も同じです。
      </p>

      <div className="space-y-4">
        <StepCard step={1} title="手動配置の場合のパス" icon={<FolderOpen className="h-4 w-4 text-primary" />}>
          <p>手動で配置する場合は、Windsurf の拡張機能ディレクトリにコピーします。</p>
          <CodeBlock language="bash">{`# macOS / Linux
~/.windsurf/extensions/my-custom-theme

# Windows
%USERPROFILE%\\.windsurf\\extensions\\my-custom-theme`}</CodeBlock>
        </StepCard>

        <StepCard step={2} title="Windsurf でテーマを適用する" icon={<Palette className="h-4 w-4 text-primary" />}>
          <p>Windsurf を再起動後、コマンドパレット（<strong>Ctrl+Shift+P / Cmd+Shift+P</strong>）から <strong>「Preferences: Color Theme」</strong> を検索して適用します。</p>
        </StepCard>
      </div>

      {/* ===== セクション6: キーボードショートカット ===== */}
      <SectionHeading>キーボードショートカット</SectionHeading>

      <div className="space-y-4">
        <StepCard step={1} title="ショートカット一覧" icon={<Keyboard className="h-4 w-4 text-primary" />}>
          <div className="mt-1 space-y-2">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              <div className="flex items-center gap-2">
                <Undo2 className="h-3.5 w-3.5" />
                <span>元に戻す</span>
              </div>
              <div><strong>Ctrl+Z / Cmd+Z</strong></div>
              <div className="flex items-center gap-2">
                <Redo2 className="h-3.5 w-3.5" />
                <span>やり直し</span>
              </div>
              <div><strong>Ctrl+Shift+Z / Cmd+Shift+Z</strong></div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI生成を送信</span>
              </div>
              <div><strong>Ctrl+Enter / Cmd+Enter</strong></div>
            </div>
          </div>
        </StepCard>
      </div>

      <div className="mt-12 mb-8 rounded-xl border border-border bg-muted/30 p-5 text-center text-sm text-muted-foreground">
        ご質問やフィードバックがありましたら、リポジトリの Issue にてお気軽にお知らせください。
      </div>
    </div>
  )
}
