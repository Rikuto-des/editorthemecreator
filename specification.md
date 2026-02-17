# エディタテーマクリエイター 仕様書

## 概要

VSCode/Windsurf等のエディタ向けテーマを視覚的に作成・編集できるWebアプリケーション。

---

## ドキュメント構成

詳細な仕様は以下のファイルに分割されています：

| ファイル | 内容 |
|----------|------|
| [docs/functional-requirements.md](./docs/functional-requirements.md) | 機能要件 |
| [docs/non-functional-requirements.md](./docs/non-functional-requirements.md) | 非機能要件 |
| [docs/tasks.md](./docs/tasks.md) | タスク一覧（ユーザーストーリー/デザインストーリー単位） |
| [docs/data-structure.md](./docs/data-structure.md) | データ構造・型定義 |
| [docs/tech-stack.md](./docs/tech-stack.md) | 技術スタック |

---

## 主要機能

- **テーマ管理**: 作成、保存、読み込み、削除、一覧表示、検索
- **テーマ編集**: グラフィカル編集、色変更、名前変更、リアルタイムプレビュー
- **インポート/エクスポート**: VSCode互換JSON形式の入出力

---

## 開発フェーズ

| Phase | 内容 | タスク数 |
|-------|------|----------|
| Phase 1 | 基盤構築 | 2 |
| Phase 2 | テーマ一覧・管理機能 | 4 |
| Phase 3 | テーマ編集機能 | 8 |
| Phase 4 | 保存・読み込み機能 | 3 |
| Phase 5 | インポート/エクスポート機能 | 3 |
| Phase 6 | UX改善 | 3 |
