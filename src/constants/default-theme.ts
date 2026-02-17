import type { Theme, ThemeColors, TokenColor } from '@/types'

/**
 * デフォルトのダークテーマカラー
 */
export const DEFAULT_DARK_COLORS: ThemeColors = {
  // エディタ
  'editor.background': '#1e1e1e',
  'editor.foreground': '#d4d4d4',
  'editor.lineHighlightBackground': '#2a2a2a',
  'editor.selectionBackground': '#264f78',
  'editor.selectionHighlightBackground': '#add6ff26',
  'editor.wordHighlightBackground': '#575757',
  'editor.findMatchBackground': '#515c6a',
  'editor.findMatchHighlightBackground': '#ea5c0055',

  // エディタガター
  'editorGutter.background': '#1e1e1e',
  'editorLineNumber.foreground': '#858585',
  'editorLineNumber.activeForeground': '#c6c6c6',

  // サイドバー
  'sideBar.background': '#252526',
  'sideBar.foreground': '#cccccc',
  'sideBar.border': '#00000000',
  'sideBarTitle.foreground': '#bbbbbb',
  'sideBarSectionHeader.background': '#00000000',
  'sideBarSectionHeader.foreground': '#bbbbbb',

  // アクティビティバー
  'activityBar.background': '#333333',
  'activityBar.foreground': '#ffffff',
  'activityBar.inactiveForeground': '#ffffff66',
  'activityBarBadge.background': '#007acc',
  'activityBarBadge.foreground': '#ffffff',

  // タブ
  'tab.activeBackground': '#1e1e1e',
  'tab.activeForeground': '#ffffff',
  'tab.inactiveBackground': '#2d2d2d',
  'tab.inactiveForeground': '#ffffff80',
  'tab.border': '#252526',
  'tab.activeBorder': '#00000000',

  // タイトルバー
  'titleBar.activeBackground': '#3c3c3c',
  'titleBar.activeForeground': '#cccccc',
  'titleBar.inactiveBackground': '#3c3c3c99',
  'titleBar.inactiveForeground': '#cccccc99',

  // ステータスバー
  'statusBar.background': '#007acc',
  'statusBar.foreground': '#ffffff',
  'statusBar.border': '#00000000',
  'statusBar.debuggingBackground': '#cc6633',
  'statusBar.noFolderBackground': '#68217a',

  // パネル
  'panel.background': '#1e1e1e',
  'panel.border': '#80808059',
  'panelTitle.activeBorder': '#e7e7e7',
  'panelTitle.activeForeground': '#e7e7e7',
  'panelTitle.inactiveForeground': '#e7e7e799',

  // 入力フィールド
  'input.background': '#3c3c3c',
  'input.foreground': '#cccccc',
  'input.border': '#00000000',
  'input.placeholderForeground': '#a6a6a6',
  'inputOption.activeBorder': '#007acc00',

  // ドロップダウン
  'dropdown.background': '#3c3c3c',
  'dropdown.foreground': '#f0f0f0',
  'dropdown.border': '#3c3c3c',

  // ボタン
  'button.background': '#0e639c',
  'button.foreground': '#ffffff',
  'button.hoverBackground': '#1177bb',

  // リスト
  'list.activeSelectionBackground': '#04395e',
  'list.activeSelectionForeground': '#ffffff',
  'list.hoverBackground': '#2a2d2e',
  'list.hoverForeground': '#ffffff',
  'list.inactiveSelectionBackground': '#37373d',
  'list.highlightForeground': '#18a3ff',

  // スクロールバー
  'scrollbar.shadow': '#000000',
  'scrollbarSlider.background': '#79797966',
  'scrollbarSlider.hoverBackground': '#646464b3',
  'scrollbarSlider.activeBackground': '#bfbfbf66',

  // ミニマップ
  'minimap.background': '#1e1e1e',
  'minimap.selectionHighlight': '#264f78',

  // ブレッドクラム
  'breadcrumb.foreground': '#cccccccc',
  'breadcrumb.focusForeground': '#e0e0e0',
  'breadcrumb.activeSelectionForeground': '#e0e0e0',

  // その他
  focusBorder: '#007fd4',
  foreground: '#cccccc',
  'widget.shadow': '#00000029',
  'selection.background': '#264f78',
  errorForeground: '#f48771',
}

/**
 * デフォルトのトークンカラー（シンタックスハイライト）
 */
export const DEFAULT_TOKEN_COLORS: TokenColor[] = [
  {
    name: 'Comment',
    scope: ['comment', 'comment.line', 'comment.block'],
    settings: {
      foreground: '#6A9955',
      fontStyle: 'italic',
    },
  },
  {
    name: 'String',
    scope: ['string', 'string.quoted'],
    settings: {
      foreground: '#ce9178',
    },
  },
  {
    name: 'Number',
    scope: ['constant.numeric'],
    settings: {
      foreground: '#b5cea8',
    },
  },
  {
    name: 'Constant',
    scope: ['constant', 'constant.language'],
    settings: {
      foreground: '#569cd6',
    },
  },
  {
    name: 'Keyword',
    scope: ['keyword', 'keyword.control'],
    settings: {
      foreground: '#569cd6',
    },
  },
  {
    name: 'Operator',
    scope: ['keyword.operator'],
    settings: {
      foreground: '#d4d4d4',
    },
  },
  {
    name: 'Function',
    scope: ['entity.name.function'],
    settings: {
      foreground: '#dcdcaa',
    },
  },
  {
    name: 'Class',
    scope: ['entity.name.class', 'entity.name.type'],
    settings: {
      foreground: '#4ec9b0',
    },
  },
  {
    name: 'Variable',
    scope: ['variable', 'variable.other'],
    settings: {
      foreground: '#9cdcfe',
    },
  },
  {
    name: 'Parameter',
    scope: ['variable.parameter'],
    settings: {
      foreground: '#9cdcfe',
    },
  },
  {
    name: 'Property',
    scope: ['variable.other.property'],
    settings: {
      foreground: '#9cdcfe',
    },
  },
  {
    name: 'Tag',
    scope: ['entity.name.tag'],
    settings: {
      foreground: '#569cd6',
    },
  },
  {
    name: 'Attribute',
    scope: ['entity.other.attribute-name'],
    settings: {
      foreground: '#9cdcfe',
    },
  },
  {
    name: 'Regexp',
    scope: ['string.regexp'],
    settings: {
      foreground: '#d16969',
    },
  },
  {
    name: 'Escape',
    scope: ['constant.character.escape'],
    settings: {
      foreground: '#d7ba7d',
    },
  },
]

/**
 * 新規テーマ作成用のデフォルトテーマを生成
 */
export function createDefaultTheme(name: string = 'New Theme'): Theme {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    name,
    type: 'dark',
    colors: { ...DEFAULT_DARK_COLORS },
    tokenColors: DEFAULT_TOKEN_COLORS.map((tc) => ({
      ...tc,
      settings: { ...tc.settings },
    })),
    createdAt: now,
    updatedAt: now,
  }
}
