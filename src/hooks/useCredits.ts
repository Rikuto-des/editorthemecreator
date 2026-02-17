import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

const LOCAL_STORAGE_KEY = 'etc_free_generations'
const FREE_LIMIT = 5

interface Credits {
  freeUsed: number
  paidBalance: number
  remaining: number
  canGenerate: boolean
  needsLogin: boolean
}

export function useCredits() {
  const { user } = useAuth()
  const [credits, setCredits] = useState<Credits>({
    freeUsed: 0,
    paidBalance: 0,
    remaining: FREE_LIMIT,
    canGenerate: true,
    needsLogin: false,
  })
  const [loading, setLoading] = useState(true)

  // ログイン済み: Supabase からクレジット取得
  // 未ログイン: localStorage から取得
  const fetchCredits = useCallback(async () => {
    if (user) {
      const { data } = await supabase
        .from('user_credits')
        .select('free_used, paid_balance')
        .eq('user_id', user.id)
        .single()

      if (data) {
        const freeRemaining = Math.max(0, FREE_LIMIT - data.free_used)
        const total = freeRemaining + data.paid_balance
        setCredits({
          freeUsed: data.free_used,
          paidBalance: data.paid_balance,
          remaining: total,
          canGenerate: total > 0,
          needsLogin: false,
        })
      }
    } else {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
      const freeUsed = stored ? parseInt(stored, 10) : 0
      const remaining = Math.max(0, FREE_LIMIT - freeUsed)
      setCredits({
        freeUsed,
        paidBalance: 0,
        remaining,
        canGenerate: remaining > 0,
        needsLogin: remaining <= 0,
      })
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchCredits()
  }, [fetchCredits])

  // AI生成時にクレジットを消費
  const consumeCredit = useCallback(async (): Promise<boolean> => {
    if (user) {
      // ログイン済み: Supabase で消費
      const { data } = await supabase
        .from('user_credits')
        .select('free_used, paid_balance')
        .eq('user_id', user.id)
        .single()

      if (!data) return false

      const freeRemaining = FREE_LIMIT - data.free_used
      if (freeRemaining > 0) {
        // 無料枠から消費
        await supabase
          .from('user_credits')
          .update({ free_used: data.free_used + 1 })
          .eq('user_id', user.id)
      } else if (data.paid_balance > 0) {
        // 有料クレジットから消費
        await supabase
          .from('user_credits')
          .update({ paid_balance: data.paid_balance - 1 })
          .eq('user_id', user.id)
      } else {
        return false
      }

      await fetchCredits()
      return true
    } else {
      // 未ログイン: localStorage で消費
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
      const freeUsed = stored ? parseInt(stored, 10) : 0
      if (freeUsed >= FREE_LIMIT) return false

      localStorage.setItem(LOCAL_STORAGE_KEY, String(freeUsed + 1))
      await fetchCredits()
      return true
    }
  }, [user, fetchCredits])

  return { credits, loading, consumeCredit, refetchCredits: fetchCredits }
}
