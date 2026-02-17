import type { ThemeColors, TokenColor } from '@/types'
import { supabase } from '@/lib/supabase'

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
  // ログイン中ならAuthorizationヘッダーを付与（サーバーサイドクレジットチェック用）
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }

  const response = await fetch('/api/generate-theme', {
    method: 'POST',
    headers,
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
