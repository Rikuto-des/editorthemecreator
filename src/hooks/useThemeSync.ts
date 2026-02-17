import { useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useThemeStore } from '@/stores'
import type { Theme } from '@/types'

/**
 * ログイン時にテーマをSupabase DBと同期するフック
 * - ログイン時: localStorageテーマをDBにマイグレーション + DB既存テーマとマージ
 * - テーマ変更時: デバウンスしてDBに同期
 * - ログアウト時: ストアをそのままlocalStorageに保持
 */
export function useThemeSync() {
  const { user } = useAuth()
  const prevUserRef = useRef<string | null>(null)
  const syncingRef = useRef(false)

  // Supabaseからテーマを取得
  const fetchCloudThemes = useCallback(async (userId: string): Promise<Theme[]> => {
    const { data } = await supabase
      .from('themes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (!data) return []
    return data.map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type as 'dark' | 'light',
      colors: row.colors,
      tokenColors: row.token_colors,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))
  }, [])

  // テーマをSupabaseにアップサート
  const upsertCloudTheme = useCallback(async (userId: string, theme: Theme) => {
    await supabase.from('themes').upsert({
      id: theme.id,
      user_id: userId,
      name: theme.name,
      type: theme.type,
      colors: theme.colors,
      token_colors: theme.tokenColors,
      created_at: theme.createdAt,
      updated_at: theme.updatedAt,
    })
  }, [])

  // テーマをSupabaseから削除
  const deleteCloudTheme = useCallback(async (themeId: string) => {
    await supabase.from('themes').delete().eq('id', themeId)
  }, [])

  // ログイン時のマイグレーション: localStorage → Supabase
  const migrateOnLogin = useCallback(async (userId: string) => {
    if (syncingRef.current) return
    syncingRef.current = true

    try {
      const localThemes = useThemeStore.getState().themes
      const cloudThemes = await fetchCloudThemes(userId)

      // IDベースでマージ（クラウド優先、ローカルのみのテーマはアップロード）
      const cloudIds = new Set(cloudThemes.map((t) => t.id))
      const localOnly = localThemes.filter((t) => !cloudIds.has(t.id))

      // ローカルのみのテーマをクラウドにアップロード
      for (const theme of localOnly) {
        await upsertCloudTheme(userId, theme)
      }

      // マージ結果をストアに反映
      const merged = [...cloudThemes, ...localOnly]
      useThemeStore.setState({ themes: merged })
    } finally {
      syncingRef.current = false
    }
  }, [fetchCloudThemes, upsertCloudTheme])

  // ログイン/ログアウト検知
  useEffect(() => {
    const currentUserId = user?.id ?? null
    const prevUserId = prevUserRef.current

    if (currentUserId && !prevUserId) {
      // ログインした
      migrateOnLogin(currentUserId)
    } else if (!currentUserId && prevUserId) {
      // ログアウトした → ストアをクリアしてlocalStorageのみに
      // (Zustand persistが自動的にlocalStorageに保存する)
    }

    prevUserRef.current = currentUserId
  }, [user, migrateOnLogin])

  // テーマ変更時のクラウド同期（ログイン中のみ）
  useEffect(() => {
    if (!user) return

    const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>()

    const unsub = useThemeStore.subscribe((state, prevState) => {
      if (syncingRef.current || !user) return

      const currentThemes = state.themes
      const prevThemes = prevState.themes

      // 削除されたテーマを検出
      const currentIds = new Set(currentThemes.map((t) => t.id))
      for (const prev of prevThemes) {
        if (!currentIds.has(prev.id)) {
          deleteCloudTheme(prev.id)
        }
      }

      // 変更・追加されたテーマを検出してデバウンス同期
      for (const theme of currentThemes) {
        const prev = prevThemes.find((t) => t.id === theme.id)
        if (!prev || prev.updatedAt !== theme.updatedAt || !prev) {
          const existing = debounceTimers.get(theme.id)
          if (existing) clearTimeout(existing)

          debounceTimers.set(
            theme.id,
            setTimeout(() => {
              upsertCloudTheme(user.id, theme)
              debounceTimers.delete(theme.id)
            }, 1000)
          )
        }
      }
    })

    return () => {
      unsub()
      debounceTimers.forEach((timer) => clearTimeout(timer))
    }
  }, [user, upsertCloudTheme, deleteCloudTheme])
}
