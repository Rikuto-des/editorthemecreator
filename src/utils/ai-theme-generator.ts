import type { ThemeColors, TokenColor } from '@/types'

interface GeneratedTheme {
  name: string
  type: 'dark' | 'light'
  colors: ThemeColors
  tokenColors: TokenColor[]
}

interface ApiErrorResponse {
  error: string
}

export async function generateThemeFromDescription(
  description: string,
): Promise<GeneratedTheme> {
  const response = await fetch('/api/generate-theme', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description }),
  })

  if (!response.ok) {
    const errorData = (await response.json().catch(() => null)) as ApiErrorResponse | null
    throw new Error(errorData?.error || `テーマの生成に失敗しました (${response.status})`)
  }

  const parsed = (await response.json()) as GeneratedTheme

  if (!parsed.name || !parsed.type || !parsed.colors || !parsed.tokenColors) {
    throw new Error('AIの応答が不完全でした。再試行してください。')
  }

  return parsed
}
