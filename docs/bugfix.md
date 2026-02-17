# バグ修正タスク一覧

## 概要

Editor Theme Creatorアプリケーションで発見されたバグと改善点の一覧です。

---

## BUG-001: プレビューでシンタックスハイライトが反映されない

### 重要度: 高

### 説明
PreviewPanelコンポーネントでサンプルコードを表示しているが、tokenColors（シンタックスハイライト色）が全く適用されていない。テーマのシンタックスカラーを変更してもプレビューに反映されない。

### 該当ファイル
- `src/components/theme-editor/PreviewPanel.tsx`

### 現状
```tsx
<pre className="whitespace-pre-wrap">{SAMPLE_CODE}</pre>
```
単純なテキストとして表示しており、tokenColorsを使用していない。

### 修正方針
1. サンプルコードをトークンごとに分割
2. 各トークンにtokenColorsの色を適用
3. シンプルなシンタックスハイライトを実装

---

## BUG-002: Undo/Redo履歴が過剰に作成される

### 重要度: 中

### 説明
カラーピッカーをドラッグして色を変更すると、マウス移動ごとにpushHistoryが呼ばれ、大量の履歴エントリが作成される。これにより履歴が汚染され、Undoが使いにくくなる。

### 該当ファイル
- `src/components/theme-editor/EditorPanel.tsx`
- `src/stores/history-store.ts`

### 現状
```tsx
const handleColorChange = (key: string, value: string) => {
  pushHistory(theme)  // 毎回呼ばれる
  updateThemeColor(theme.id, key as keyof typeof theme.colors, value)
}
```

### 修正方針
1. デバウンス処理を追加（300ms程度）
2. または、カラーピッカーを閉じたときのみ履歴を保存

---

## BUG-003: カラーピッカーのポップアップが画面外に出る

### 重要度: 低

### 説明
画面下部のカラーピッカーを開くと、ポップアップが画面外に表示されて操作できない場合がある。

### 該当ファイル
- `src/components/theme-editor/ColorPicker.tsx`
- `src/components/theme-editor/TokenColorEditor.tsx`

### 現状
```tsx
<div className="absolute left-0 top-full z-50 mt-2 ...">
```
常に下方向に展開される。

### 修正方針
1. ポップアップの位置を動的に計算
2. 画面下部では上方向に展開するように変更
3. または、Portalを使用してbody直下にレンダリング

---

## BUG-004: Undo実行時の状態復元ロジックの問題

### 重要度: 中

### 説明
Undo機能で、最初の状態に戻ろうとするとnullが返され、テーマが消えてしまう可能性がある。また、Undoボタンの無効化条件が`past.length > 1`となっているが、初期状態の保存タイミングによっては期待通りに動作しない。

### 該当ファイル
- `src/stores/history-store.ts`
- `src/components/theme-editor/ThemeEditor.tsx`

### 現状
```tsx
undo: () => {
  // ...
  const newPast = state.past.slice(0, -1)
  return newPast.length > 0 ? newPast[newPast.length - 1].snapshot : null
}
```

### 修正方針
1. 初期状態を確実に履歴に保存
2. Undoで最初の状態に戻れるようにロジックを修正
3. nullが返された場合のハンドリングを追加

---

## BUG-005: テーマ切り替え時に履歴がクリアされない

### 重要度: 低

### 説明
別のテーマを編集し始めても、前のテーマの履歴が残っている。異なるテーマの履歴が混在する可能性がある。

### 該当ファイル
- `src/components/theme-editor/ThemeEditor.tsx`
- `src/stores/history-store.ts`

### 修正方針
1. テーマ切り替え時にclearHistoryを呼び出す
2. 履歴にthemeIdを含めて、現在のテーマの履歴のみを使用

---

## BUG-006: ESLintエラー（shadcn/uiコンポーネント）

### 重要度: 低

### 説明
shadcn/uiのコンポーネントでreact-refresh関連のESLintエラーが発生している。

### 該当ファイル
- `src/components/ui/button.tsx`
- `src/components/ui/tabs.tsx`

### 現状
```
error  Fast refresh only works when a file only exports components
```

### 修正方針
1. ESLint設定でshadcn/uiコンポーネントを除外
2. または、定数を別ファイルに分離

---

## 修正優先順位

| 優先度 | バグID | 説明 |
|--------|--------|------|
| 1 | BUG-001 | シンタックスハイライトがプレビューに反映されない |
| 2 | BUG-002 | Undo/Redo履歴が過剰に作成される |
| 3 | BUG-004 | Undo実行時の状態復元ロジックの問題 |
| 4 | BUG-005 | テーマ切り替え時に履歴がクリアされない |
| 5 | BUG-003 | カラーピッカーのポップアップが画面外に出る |
| 6 | BUG-006 | ESLintエラー（shadcn/uiコンポーネント） |

---

## 修正完了チェックリスト

- [x] BUG-001: シンタックスハイライトプレビュー
- [x] BUG-002: 履歴デバウンス
- [x] BUG-003: ポップアップ位置調整
- [x] BUG-004: Undoロジック修正
- [x] BUG-005: テーマ切り替え時の履歴クリア
- [x] BUG-006: ESLint設定修正
- [x] BUG-007: ResizablePanelによるエディタパネル表示崩壊

---

## BUG-007: ResizablePanelによるエディタパネルが表示されない

### 重要度: 高

### 説明
ResizablePanelGroupを導入した際、左側のEditorPanel（カラー編集UI）の幅がflex: 1.954（約50px）に潰れ、右側のPreviewPanelがflex: 98.046（約2509px）を占有し、エディタパネルが実質的に見えなくなった。

### 原因
`react-resizable-panels`のflex値が初期化時に正しくdefaultSizeを反映せず、パネルが極端に偏ったサイズで描画された。

### 修正内容
ResizablePanelGroupを削除し、`flex` + `w-80 shrink-0` による安定したレイアウトに戻した。
