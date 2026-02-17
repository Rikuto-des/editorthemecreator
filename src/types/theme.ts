/**
 * テーマオブジェクト
 */
export interface Theme {
  id: string
  name: string
  type: 'dark' | 'light'
  colors: ThemeColors
  tokenColors: TokenColor[]
  createdAt: string
  updatedAt: string
}

/**
 * テーマカラー定義（VSCode互換）
 */
export interface ThemeColors {
  // エディタ
  'editor.background': string
  'editor.foreground': string
  'editor.lineHighlightBackground': string
  'editor.selectionBackground': string
  'editor.selectionHighlightBackground': string
  'editor.wordHighlightBackground': string
  'editor.findMatchBackground': string
  'editor.findMatchHighlightBackground': string

  // エディタガター
  'editorGutter.background': string
  'editorLineNumber.foreground': string
  'editorLineNumber.activeForeground': string

  // サイドバー
  'sideBar.background': string
  'sideBar.foreground': string
  'sideBar.border': string
  'sideBarTitle.foreground': string
  'sideBarSectionHeader.background': string
  'sideBarSectionHeader.foreground': string

  // アクティビティバー
  'activityBar.background': string
  'activityBar.foreground': string
  'activityBar.inactiveForeground': string
  'activityBarBadge.background': string
  'activityBarBadge.foreground': string

  // タブ
  'tab.activeBackground': string
  'tab.activeForeground': string
  'tab.inactiveBackground': string
  'tab.inactiveForeground': string
  'tab.border': string
  'tab.activeBorder': string

  // タイトルバー
  'titleBar.activeBackground': string
  'titleBar.activeForeground': string
  'titleBar.inactiveBackground': string
  'titleBar.inactiveForeground': string

  // ステータスバー
  'statusBar.background': string
  'statusBar.foreground': string
  'statusBar.border': string
  'statusBar.debuggingBackground': string
  'statusBar.noFolderBackground': string

  // パネル
  'panel.background': string
  'panel.border': string
  'panelTitle.activeBorder': string
  'panelTitle.activeForeground': string
  'panelTitle.inactiveForeground': string

  // 入力フィールド
  'input.background': string
  'input.foreground': string
  'input.border': string
  'input.placeholderForeground': string
  'inputOption.activeBorder': string

  // ドロップダウン
  'dropdown.background': string
  'dropdown.foreground': string
  'dropdown.border': string

  // ボタン
  'button.background': string
  'button.foreground': string
  'button.hoverBackground': string

  // リスト
  'list.activeSelectionBackground': string
  'list.activeSelectionForeground': string
  'list.hoverBackground': string
  'list.hoverForeground': string
  'list.inactiveSelectionBackground': string
  'list.highlightForeground': string

  // スクロールバー
  'scrollbar.shadow': string
  'scrollbarSlider.background': string
  'scrollbarSlider.hoverBackground': string
  'scrollbarSlider.activeBackground': string

  // ミニマップ
  'minimap.background': string
  'minimap.selectionHighlight': string

  // ブレッドクラム
  'breadcrumb.foreground': string
  'breadcrumb.focusForeground': string
  'breadcrumb.activeSelectionForeground': string

  // その他
  focusBorder: string
  foreground: string
  'widget.shadow': string
  'selection.background': string
  errorForeground: string
}

/**
 * トークンカラー定義（シンタックスハイライト）
 */
export interface TokenColor {
  name: string
  scope: string | string[]
  settings: TokenColorSettings
}

export interface TokenColorSettings {
  foreground?: string
  background?: string
  fontStyle?:
    | 'italic'
    | 'bold'
    | 'underline'
    | 'italic bold'
    | 'bold underline'
    | 'italic underline'
    | 'italic bold underline'
    | ''
}

/**
 * VSCodeエクスポート形式
 */
export interface VSCodeTheme {
  $schema?: string
  name: string
  type: 'dark' | 'light'
  colors: Record<string, string>
  tokenColors: TokenColor[]
}

/**
 * アプリケーション設定
 */
export interface AppSettings {
  darkMode: 'system' | 'light' | 'dark'
  autoSaveInterval: number
  previewLanguage: 'javascript' | 'typescript' | 'python' | 'html' | 'css'
}

/**
 * ThemeColorsのキー一覧（型安全なアクセス用）
 */
export type ThemeColorKey = keyof ThemeColors

/**
 * カラーカテゴリ（UI表示用）
 */
export interface ColorCategory {
  id: string
  name: string
  keys: ThemeColorKey[]
}
