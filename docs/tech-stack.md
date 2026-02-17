# 技術スタック

## 推奨構成

| 項目 | 技術 | バージョン |
|------|------|------------|
| フレームワーク | React | 18.x |
| 言語 | TypeScript | 5.x |
| ビルドツール | Vite | 5.x |
| スタイリング | TailwindCSS | 3.x |
| UIコンポーネント | shadcn/ui | latest |
| アイコン | Lucide React | latest |
| 状態管理 | Zustand | 4.x |
| カラーピッカー | react-colorful | 5.x |

---

## ディレクトリ構造（推奨）

```
src/
├── components/
│   ├── ui/              # shadcn/uiコンポーネント
│   ├── theme-list/      # テーマ一覧関連
│   ├── theme-editor/    # テーマ編集関連
│   └── preview/         # プレビュー関連
├── hooks/               # カスタムフック
├── stores/              # Zustandストア
├── types/               # TypeScript型定義
├── utils/               # ユーティリティ関数
├── constants/           # 定数定義
└── App.tsx
```
