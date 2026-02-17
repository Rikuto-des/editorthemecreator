import type { Theme, VSCodeTheme, ThemeColors } from '@/types'
import { createDefaultTheme } from '@/constants'

/**
 * 内部Theme形式をVSCodeエクスポート形式に変換
 */
export function themeToVSCode(theme: Theme): VSCodeTheme {
  return {
    $schema: 'vscode://schemas/color-theme',
    name: theme.name,
    type: theme.type,
    colors: theme.colors as unknown as Record<string, string>,
    tokenColors: theme.tokenColors,
  }
}

/**
 * VSCodeテーマJSONを内部Theme形式に変換
 */
export function vsCodeToTheme(vscodeTheme: VSCodeTheme, id?: string): Theme {
  const now = new Date().toISOString()
  const defaultTheme = createDefaultTheme()

  // VSCodeテーマのcolorsをThemeColorsにマージ
  const colors: ThemeColors = { ...defaultTheme.colors }
  if (vscodeTheme.colors) {
    for (const [key, value] of Object.entries(vscodeTheme.colors)) {
      if (key in colors) {
        ;(colors as unknown as Record<string, string>)[key] = value
      }
    }
  }

  return {
    id: id ?? crypto.randomUUID(),
    name: vscodeTheme.name || 'Imported Theme',
    type: vscodeTheme.type || 'dark',
    colors,
    tokenColors: vscodeTheme.tokenColors || defaultTheme.tokenColors,
    createdAt: now,
    updatedAt: now,
  }
}

/**
 * テーマをJSONファイルとしてダウンロード
 */
export function downloadThemeAsJson(theme: Theme): void {
  const vscodeTheme = themeToVSCode(theme)
  const json = JSON.stringify(vscodeTheme, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `${theme.name.replace(/[^a-zA-Z0-9-_]/g, '-')}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * JSONファイルからテーマを読み込み
 */
export async function importThemeFromFile(file: File): Promise<Theme> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const parsed = JSON.parse(content) as VSCodeTheme
        const theme = vsCodeToTheme(parsed)
        resolve(theme)
      } catch {
        reject(new Error('Invalid theme file format'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsText(file)
  })
}
