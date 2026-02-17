import type { Theme, VSCodeTheme } from '@/types'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * 16進数カラーコードの検証
 */
function isValidHexColor(color: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(color)
}

/**
 * テーマの検証
 */
export function validateTheme(theme: Theme): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // 基本フィールドの検証
  if (!theme.id) {
    errors.push('テーマIDが設定されていません')
  }

  if (!theme.name || theme.name.trim() === '') {
    errors.push('テーマ名が設定されていません')
  }

  if (theme.type !== 'dark' && theme.type !== 'light') {
    errors.push('テーマタイプは "dark" または "light" である必要があります')
  }

  // カラーの検証
  if (!theme.colors) {
    errors.push('カラー設定がありません')
  } else {
    for (const [key, value] of Object.entries(theme.colors)) {
      if (!isValidHexColor(value)) {
        warnings.push(`無効なカラー値: ${key} = "${value}"`)
      }
    }
  }

  // トークンカラーの検証
  if (!theme.tokenColors || !Array.isArray(theme.tokenColors)) {
    warnings.push('トークンカラーが設定されていません')
  } else {
    theme.tokenColors.forEach((tc, index) => {
      if (!tc.name) {
        warnings.push(`トークンカラー[${index}]: 名前が設定されていません`)
      }
      if (!tc.scope) {
        warnings.push(`トークンカラー[${index}]: スコープが設定されていません`)
      }
      if (tc.settings.foreground && !isValidHexColor(tc.settings.foreground)) {
        warnings.push(`トークンカラー[${index}]: 無効な前景色 "${tc.settings.foreground}"`)
      }
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * VSCodeテーマJSONの検証
 */
export function validateVSCodeTheme(json: unknown): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!json || typeof json !== 'object') {
    errors.push('無効なJSON形式です')
    return { isValid: false, errors, warnings }
  }

  const theme = json as Partial<VSCodeTheme>

  // 必須フィールドの検証
  if (!theme.name) {
    warnings.push('テーマ名が設定されていません（デフォルト名が使用されます）')
  }

  if (theme.type && theme.type !== 'dark' && theme.type !== 'light') {
    errors.push('テーマタイプは "dark" または "light" である必要があります')
  }

  // カラーの検証
  if (theme.colors && typeof theme.colors === 'object') {
    for (const [key, value] of Object.entries(theme.colors)) {
      if (typeof value === 'string' && !isValidHexColor(value)) {
        warnings.push(`無効なカラー値: ${key} = "${value}"`)
      }
    }
  }

  // トークンカラーの検証
  if (theme.tokenColors && Array.isArray(theme.tokenColors)) {
    theme.tokenColors.forEach((tc, index) => {
      if (tc.settings?.foreground && !isValidHexColor(tc.settings.foreground)) {
        warnings.push(`トークンカラー[${index}]: 無効な前景色`)
      }
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}
