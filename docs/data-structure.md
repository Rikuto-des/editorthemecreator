# データ構造

## 1. テーマオブジェクト

```typescript
interface Theme {
  id: string;
  name: string;
  type: 'dark' | 'light';
  colors: ThemeColors;
  tokenColors: TokenColor[];
  createdAt: string;
  updatedAt: string;
}
```

---

## 2. テーマカラー定義

```typescript
interface ThemeColors {
  // エディタ
  'editor.background': string;
  'editor.foreground': string;
  'editor.lineHighlightBackground': string;
  'editor.selectionBackground': string;
  'editor.selectionHighlightBackground': string;
  'editor.wordHighlightBackground': string;
  'editor.findMatchBackground': string;
  'editor.findMatchHighlightBackground': string;
  
  // エディタガター
  'editorGutter.background': string;
  'editorLineNumber.foreground': string;
  'editorLineNumber.activeForeground': string;
  
  // サイドバー
  'sideBar.background': string;
  'sideBar.foreground': string;
  'sideBar.border': string;
  'sideBarTitle.foreground': string;
  'sideBarSectionHeader.background': string;
  'sideBarSectionHeader.foreground': string;
  
  // アクティビティバー
  'activityBar.background': string;
  'activityBar.foreground': string;
  'activityBar.inactiveForeground': string;
  'activityBarBadge.background': string;
  'activityBarBadge.foreground': string;
  
  // タブ
  'tab.activeBackground': string;
  'tab.activeForeground': string;
  'tab.inactiveBackground': string;
  'tab.inactiveForeground': string;
  'tab.border': string;
  'tab.activeBorder': string;
  
  // タイトルバー
  'titleBar.activeBackground': string;
  'titleBar.activeForeground': string;
  'titleBar.inactiveBackground': string;
  'titleBar.inactiveForeground': string;
  
  // ステータスバー
  'statusBar.background': string;
  'statusBar.foreground': string;
  'statusBar.border': string;
  'statusBar.debuggingBackground': string;
  'statusBar.noFolderBackground': string;
  
  // パネル
  'panel.background': string;
  'panel.border': string;
  'panelTitle.activeBorder': string;
  'panelTitle.activeForeground': string;
  'panelTitle.inactiveForeground': string;
  
  // 入力フィールド
  'input.background': string;
  'input.foreground': string;
  'input.border': string;
  'input.placeholderForeground': string;
  'inputOption.activeBorder': string;
  
  // ドロップダウン
  'dropdown.background': string;
  'dropdown.foreground': string;
  'dropdown.border': string;
  
  // ボタン
  'button.background': string;
  'button.foreground': string;
  'button.hoverBackground': string;
  
  // リスト
  'list.activeSelectionBackground': string;
  'list.activeSelectionForeground': string;
  'list.hoverBackground': string;
  'list.hoverForeground': string;
  'list.inactiveSelectionBackground': string;
  'list.highlightForeground': string;
  
  // スクロールバー
  'scrollbar.shadow': string;
  'scrollbarSlider.background': string;
  'scrollbarSlider.hoverBackground': string;
  'scrollbarSlider.activeBackground': string;
  
  // ミニマップ
  'minimap.background': string;
  'minimap.selectionHighlight': string;
  
  // ブレッドクラム
  'breadcrumb.foreground': string;
  'breadcrumb.focusForeground': string;
  'breadcrumb.activeSelectionForeground': string;
  
  // その他
  'focusBorder': string;
  'foreground': string;
  'widget.shadow': string;
  'selection.background': string;
  'errorForeground': string;
}
```

---

## 3. トークンカラー定義

```typescript
interface TokenColor {
  name: string;
  scope: string | string[];
  settings: TokenColorSettings;
}

interface TokenColorSettings {
  foreground?: string;
  background?: string;
  fontStyle?: 'italic' | 'bold' | 'underline' | 'italic bold' | 'bold underline' | 'italic underline' | 'italic bold underline' | '';
}
```

---

## 4. 標準トークンスコープ

| カテゴリ | スコープ | 説明 |
|----------|----------|------|
| コメント | `comment`, `comment.line`, `comment.block` | コメント |
| 文字列 | `string`, `string.quoted` | 文字列リテラル |
| 数値 | `constant.numeric` | 数値リテラル |
| 定数 | `constant`, `constant.language` | 定数（true, false, null等） |
| キーワード | `keyword`, `keyword.control` | 予約語 |
| 演算子 | `keyword.operator` | 演算子 |
| 関数 | `entity.name.function` | 関数名 |
| クラス | `entity.name.class`, `entity.name.type` | クラス名・型名 |
| 変数 | `variable`, `variable.other` | 変数 |
| パラメータ | `variable.parameter` | 関数パラメータ |
| プロパティ | `variable.other.property` | プロパティ |
| タグ | `entity.name.tag` | HTMLタグ等 |
| 属性 | `entity.other.attribute-name` | HTML属性等 |
| 正規表現 | `string.regexp` | 正規表現 |
| エスケープ | `constant.character.escape` | エスケープ文字 |
| 無効 | `invalid`, `invalid.illegal` | 無効なコード |

---

## 5. VSCodeエクスポート形式

```json
{
  "$schema": "vscode://schemas/color-theme",
  "name": "テーマ名",
  "type": "dark",
  "colors": {
    "editor.background": "#1e1e1e",
    "editor.foreground": "#d4d4d4"
  },
  "tokenColors": [
    {
      "name": "Comment",
      "scope": ["comment", "comment.line", "comment.block"],
      "settings": {
        "foreground": "#6A9955",
        "fontStyle": "italic"
      }
    }
  ]
}
```

---

## 6. アプリケーション内部データ

### ストレージキー

| キー | 説明 |
|------|------|
| `themes` | テーマ一覧（JSON配列） |
| `currentThemeId` | 現在編集中のテーマID |
| `appSettings` | アプリケーション設定 |

### アプリケーション設定

```typescript
interface AppSettings {
  darkMode: 'system' | 'light' | 'dark';
  autoSaveInterval: number; // ミリ秒
  previewLanguage: 'javascript' | 'typescript' | 'python' | 'html' | 'css';
}
```
