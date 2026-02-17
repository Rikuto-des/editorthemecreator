# 作業ログ — 2026/02/10

## 1. 使い方ガイドページの追加

### 新規ファイル
- `src/components/guide/GuidePage.tsx` — ガイドページ本体
- `src/components/guide/index.ts` — エクスポート用

### 変更ファイル
- `src/App.tsx` — `guide` ビューと「使い方」ナビゲーションボタンを追加

### 内容
- 基本的な使い方（テーマ作成・編集・エクスポート・インポート）
- VS Code へのテーマ反映手順（拡張機能フォルダ作成 → package.json 作成 → 配置 → 適用）
- Windsurf への反映手順
- VSIX パッケージとして配布する方法（上級）
- コードブロックにコピーボタン付き

---

## 2. エクスポート機能の強化（VSIX 生成 + エディタ起動）

### 新規ファイル
- `src/utils/vsix-builder.ts` — ブラウザ内で VSIX パッケージを生成するユーティリティ
- `src/components/theme-editor/ExportDialog.tsx` — エクスポート形式選択ダイアログ

### 変更ファイル
- `src/utils/index.ts` — VSIX 関連のエクスポート追加
- `src/components/theme-editor/ThemeEditor.tsx` — 旧エクスポートボタンを `ExportDialog` に置き換え

### 追加パッケージ
- `jszip` — ブラウザ内 ZIP（VSIX）生成用

### エクスポートフロー
1. エクスポートボタン → ダイアログ表示
2. **JSON ファイル** — 従来通りの .json ダウンロード
3. **VSIX パッケージ（おすすめ）** — .vsix を生成しダウンロード → インストール手順を表示
4. **「VS Code を開く」/「Windsurf を開く」** ボタンで `vscode://` / `windsurf://` プロトコルでエディタ起動

---

## 3. テンプレートテーマ名のリネーム（著作権対策）

### 変更ファイル
- `src/constants/theme-templates.ts`

### 変更一覧

| 旧名（著作権リスクあり） | 新名（オリジナル） | 説明 |
|---|---|---|
| VS Code Dark+ | Classic Dark | シンプルで使いやすい定番ダークテーマ |
| VS Code Light+ | Classic Light | シンプルで使いやすい定番ライトテーマ |
| Monokai | Vivid Jungle | 鮮やかなグリーンとピンクが映えるダークテーマ |
| Dracula | Twilight Purple | 紫を基調としたモダンなダークテーマ |
| Nord | Frost Blue | 落ち着いた寒色系の静かなダークテーマ |
| Solarized Dark | Warm Teal Dark | ティールと暖色が調和した目に優しいダークテーマ |
| GitHub Dark | Midnight Ink | 深い漆黒にクリアな色彩が映えるモダンテーマ |
| One Dark | Dusk Harmony | 調和のとれた配色で長時間でも疲れにくいダークテーマ |
| Solarized Light | Warm Teal Light | ティールと暖色が調和した目に優しいライトテーマ |

※ カラー値はそのまま、名前・ID・説明文のみ変更

---

## デプロイ情報

- **フレームワーク**: Vite + React (SPA)
- **ビルドコマンド**: `npm run build`
- **出力ディレクトリ**: `dist`
- **バックエンド不要**: 完全静的ホスティング対応
- **対応ホスティング**: Netlify / Vercel / GitHub Pages / Cloudflare Pages 等
- **SPA ルーティング**: なし（state ベースの画面切り替え）→ リダイレクトルール不要
