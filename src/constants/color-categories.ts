import type { ColorCategory, ThemeColorKey } from '@/types'

/**
 * カラーキーの日本語表示名
 */
export const COLOR_KEY_LABELS: Record<ThemeColorKey, string> = {
  'editor.background': 'エディタ 背景',
  'editor.foreground': 'エディタ 文字色',
  'editor.lineHighlightBackground': '現在行 ハイライト',
  'editor.selectionBackground': '選択範囲 背景',
  'editor.selectionHighlightBackground': '選択一致 ハイライト',
  'editor.wordHighlightBackground': '単語ハイライト',
  'editor.findMatchBackground': '検索マッチ（現在）',
  'editor.findMatchHighlightBackground': '検索マッチ（他）',

  'editorGutter.background': 'ガター 背景',
  'editorLineNumber.foreground': '行番号 文字色',
  'editorLineNumber.activeForeground': '行番号 アクティブ',

  'sideBar.background': 'サイドバー 背景',
  'sideBar.foreground': 'サイドバー 文字色',
  'sideBar.border': 'サイドバー 境界線',
  'sideBarTitle.foreground': 'サイドバー タイトル',
  'sideBarSectionHeader.background': 'セクション見出し 背景',
  'sideBarSectionHeader.foreground': 'セクション見出し 文字色',

  'activityBar.background': 'アクティビティバー 背景',
  'activityBar.foreground': 'アクティビティバー 文字色',
  'activityBar.inactiveForeground': 'アクティビティバー 非アクティブ',
  'activityBarBadge.background': 'バッジ 背景',
  'activityBarBadge.foreground': 'バッジ 文字色',

  'tab.activeBackground': 'タブ（アクティブ）背景',
  'tab.activeForeground': 'タブ（アクティブ）文字色',
  'tab.inactiveBackground': 'タブ（非アクティブ）背景',
  'tab.inactiveForeground': 'タブ（非アクティブ）文字色',
  'tab.border': 'タブ 境界線',
  'tab.activeBorder': 'タブ アクティブ境界線',

  'titleBar.activeBackground': 'タイトルバー 背景',
  'titleBar.activeForeground': 'タイトルバー 文字色',
  'titleBar.inactiveBackground': 'タイトルバー（非アクティブ）背景',
  'titleBar.inactiveForeground': 'タイトルバー（非アクティブ）文字色',

  'statusBar.background': 'ステータスバー 背景',
  'statusBar.foreground': 'ステータスバー 文字色',
  'statusBar.border': 'ステータスバー 境界線',
  'statusBar.debuggingBackground': 'デバッグ中 背景',
  'statusBar.noFolderBackground': 'フォルダなし 背景',

  'panel.background': 'パネル 背景',
  'panel.border': 'パネル 境界線',
  'panelTitle.activeBorder': 'パネルタブ アクティブ境界線',
  'panelTitle.activeForeground': 'パネルタブ アクティブ文字色',
  'panelTitle.inactiveForeground': 'パネルタブ 非アクティブ文字色',

  'input.background': '入力欄 背景',
  'input.foreground': '入力欄 文字色',
  'input.border': '入力欄 境界線',
  'input.placeholderForeground': 'プレースホルダー文字色',
  'inputOption.activeBorder': '入力オプション アクティブ境界線',

  'dropdown.background': 'ドロップダウン 背景',
  'dropdown.foreground': 'ドロップダウン 文字色',
  'dropdown.border': 'ドロップダウン 境界線',

  'button.background': 'ボタン 背景',
  'button.foreground': 'ボタン 文字色',
  'button.hoverBackground': 'ボタン ホバー背景',

  'list.activeSelectionBackground': 'リスト 選択中 背景',
  'list.activeSelectionForeground': 'リスト 選択中 文字色',
  'list.hoverBackground': 'リスト ホバー背景',
  'list.hoverForeground': 'リスト ホバー文字色',
  'list.inactiveSelectionBackground': 'リスト 非アクティブ選択 背景',
  'list.highlightForeground': 'リスト 検索一致文字色',

  'scrollbar.shadow': 'スクロールバー 影',
  'scrollbarSlider.background': 'スライダー 通常',
  'scrollbarSlider.hoverBackground': 'スライダー ホバー',
  'scrollbarSlider.activeBackground': 'スライダー アクティブ',

  'minimap.background': 'ミニマップ 背景',
  'minimap.selectionHighlight': 'ミニマップ 選択ハイライト',

  'breadcrumb.foreground': 'パンくず 文字色',
  'breadcrumb.focusForeground': 'パンくず フォーカス文字色',
  'breadcrumb.activeSelectionForeground': 'パンくず 選択中文字色',

  focusBorder: 'フォーカス境界線',
  foreground: '全体 文字色',
  'widget.shadow': 'ウィジェット 影',
  'selection.background': '全体 選択背景',
  errorForeground: 'エラー文字色',
}

/**
 * カラーカテゴリ定義（UI表示用）
 */
export const COLOR_CATEGORIES: ColorCategory[] = [
  {
    id: 'editor',
    name: 'エディタ',
    keys: [
      'editor.background',
      'editor.foreground',
      'editor.lineHighlightBackground',
      'editor.selectionBackground',
      'editor.selectionHighlightBackground',
      'editor.wordHighlightBackground',
      'editor.findMatchBackground',
      'editor.findMatchHighlightBackground',
    ],
  },
  {
    id: 'editorGutter',
    name: 'エディタガター',
    keys: [
      'editorGutter.background',
      'editorLineNumber.foreground',
      'editorLineNumber.activeForeground',
    ],
  },
  {
    id: 'sideBar',
    name: 'サイドバー',
    keys: [
      'sideBar.background',
      'sideBar.foreground',
      'sideBar.border',
      'sideBarTitle.foreground',
      'sideBarSectionHeader.background',
      'sideBarSectionHeader.foreground',
    ],
  },
  {
    id: 'activityBar',
    name: 'アクティビティバー',
    keys: [
      'activityBar.background',
      'activityBar.foreground',
      'activityBar.inactiveForeground',
      'activityBarBadge.background',
      'activityBarBadge.foreground',
    ],
  },
  {
    id: 'tab',
    name: 'タブ',
    keys: [
      'tab.activeBackground',
      'tab.activeForeground',
      'tab.inactiveBackground',
      'tab.inactiveForeground',
      'tab.border',
      'tab.activeBorder',
    ],
  },
  {
    id: 'titleBar',
    name: 'タイトルバー',
    keys: [
      'titleBar.activeBackground',
      'titleBar.activeForeground',
      'titleBar.inactiveBackground',
      'titleBar.inactiveForeground',
    ],
  },
  {
    id: 'statusBar',
    name: 'ステータスバー',
    keys: [
      'statusBar.background',
      'statusBar.foreground',
      'statusBar.border',
      'statusBar.debuggingBackground',
      'statusBar.noFolderBackground',
    ],
  },
  {
    id: 'panel',
    name: 'パネル',
    keys: [
      'panel.background',
      'panel.border',
      'panelTitle.activeBorder',
      'panelTitle.activeForeground',
      'panelTitle.inactiveForeground',
    ],
  },
  {
    id: 'input',
    name: '入力フィールド',
    keys: [
      'input.background',
      'input.foreground',
      'input.border',
      'input.placeholderForeground',
      'inputOption.activeBorder',
    ],
  },
  {
    id: 'dropdown',
    name: 'ドロップダウン',
    keys: ['dropdown.background', 'dropdown.foreground', 'dropdown.border'],
  },
  {
    id: 'button',
    name: 'ボタン',
    keys: ['button.background', 'button.foreground', 'button.hoverBackground'],
  },
  {
    id: 'list',
    name: 'リスト',
    keys: [
      'list.activeSelectionBackground',
      'list.activeSelectionForeground',
      'list.hoverBackground',
      'list.hoverForeground',
      'list.inactiveSelectionBackground',
      'list.highlightForeground',
    ],
  },
  {
    id: 'scrollbar',
    name: 'スクロールバー',
    keys: [
      'scrollbar.shadow',
      'scrollbarSlider.background',
      'scrollbarSlider.hoverBackground',
      'scrollbarSlider.activeBackground',
    ],
  },
  {
    id: 'minimap',
    name: 'ミニマップ',
    keys: ['minimap.background', 'minimap.selectionHighlight'],
  },
  {
    id: 'breadcrumb',
    name: 'ブレッドクラム',
    keys: [
      'breadcrumb.foreground',
      'breadcrumb.focusForeground',
      'breadcrumb.activeSelectionForeground',
    ],
  },
  {
    id: 'other',
    name: 'その他',
    keys: ['focusBorder', 'foreground', 'widget.shadow', 'selection.background', 'errorForeground'],
  },
]
