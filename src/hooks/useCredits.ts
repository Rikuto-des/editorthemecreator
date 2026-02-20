import { useState, useEffect, useCallback, useSyncExternalStore } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

const LOCAL_STORAGE_KEY = 'etc_free_generations'
const DAILY_FREE_LIMIT = 2
const IP_FREE_LIMIT = 3

interface Credits {
  dailyFreeRemaining: number
  paidBalance: number
  remaining: number
  canGenerate: boolean
}

const DEFAULT_CREDITS: Credits = {
  dailyFreeRemaining: DAILY_FREE_LIMIT,
  paidBalance: 0,
  remaining: DAILY_FREE_LIMIT,
  canGenerate: true,
}

// --- モジュールレベル共有ステート ---
let sharedCredits: Credits = { ...DEFAULT_CREDITS }
let sharedLoading = true
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

function getSnapshot() {
  return sharedCredits
}

function setSharedCredits(c: Credits) {
  sharedCredits = c
  notify()
}

export function useCredits() {
  const { user } = useAuth()
  const credits = useSyncExternalStore(subscribe, getSnapshot)
  const [loading, setLoading] = useState(sharedLoading)

  const fetchCredits = useCallback(async () => {
    if (user) {
      const todayStart = new Date()
      todayStart.setUTCHours(0, 0, 0, 0)
      const { data: logs } = await supabase
        .from('generation_log')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', todayStart.toISOString())

      const todayUsed = logs?.length ?? 0
      const dailyFreeRemaining = Math.max(0, DAILY_FREE_LIMIT - todayUsed)

      const { data: cred } = await supabase
        .from('user_credits')
        .select('paid_balance')
        .eq('user_id', user.id)
        .single()

      const paidBalance = cred?.paid_balance ?? 0
      const total = dailyFreeRemaining + paidBalance
      setSharedCredits({
        dailyFreeRemaining,
        paidBalance,
        remaining: total,
        canGenerate: total > 0,
      })
    } else {
      // localStorageが有効な場合はlocalStorageから取得
      let stored: string | null = null
      try {
        stored = localStorage.getItem(LOCAL_STORAGE_KEY)
      } catch {
        // localStorageが無効（プライバシーモードなど）→ APIから取得
      }

      if (stored !== null) {
        const freeUsed = parseInt(stored, 10) || 0
        const remaining = Math.max(0, IP_FREE_LIMIT - freeUsed)
        setSharedCredits({
          dailyFreeRemaining: remaining,
          paidBalance: 0,
          remaining,
          canGenerate: remaining > 0,
        })
      } else {
        // localStorageが無効な場合: APIからIPベースの残り回数を取得
        try {
          const res = await fetch('/api/check-ip-limit')
          if (res.ok) {
            const data = await res.json() as { allowed: boolean; remaining: number }
            setSharedCredits({
              dailyFreeRemaining: data.remaining,
              paidBalance: 0,
              remaining: data.remaining,
              canGenerate: data.allowed,
            })
          } else {
            // APIエラー時はフォールバック
            setSharedCredits({
              dailyFreeRemaining: IP_FREE_LIMIT,
              paidBalance: 0,
              remaining: IP_FREE_LIMIT,
              canGenerate: true,
            })
          }
        } catch {
          // ネットワークエラー時はフォールバック
          setSharedCredits({
            dailyFreeRemaining: IP_FREE_LIMIT,
            paidBalance: 0,
            remaining: IP_FREE_LIMIT,
            canGenerate: true,
          })
        }
      }
    }
    sharedLoading = false
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchCredits()
  }, [fetchCredits])

  const consumeLocalCredit = useCallback(() => {
    if (user) return
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    const freeUsed = (stored ? parseInt(stored, 10) : 0) + 1
    localStorage.setItem(LOCAL_STORAGE_KEY, String(freeUsed))
    const remaining = Math.max(0, IP_FREE_LIMIT - freeUsed)
    setSharedCredits({ dailyFreeRemaining: remaining, paidBalance: 0, remaining, canGenerate: remaining > 0 })
  }, [user])

  return { credits, loading, refetchCredits: fetchCredits, consumeLocalCredit }
}
