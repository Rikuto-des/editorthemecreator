import { useState } from 'react'
import { Sparkles, LogIn, CheckCircle2, CreditCard, Loader2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

interface UpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
  const { user, signInWithGoogle } = useAuth()
  const [purchasing, setPurchasing] = useState(false)

  const handleLogin = async () => {
    await signInWithGoogle()
  }

  const handlePurchase = async () => {
    if (!user) return
    setPurchasing(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`
      }
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers,
        body: JSON.stringify({ userId: user.id, userEmail: user.email }),
      })
      const data = await res.json() as { url?: string; error?: string }
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      // エラー時は何もしない（ボタンが再度押せるようになる）
    } finally {
      setPurchasing(false)
    }
  }

  // 未ログイン: ログイン誘導
  // ログイン済み: 購入誘導
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              {user ? <CreditCard className="h-4 w-4 text-primary" /> : <Zap className="h-4 w-4 text-primary" />}
            </div>
            {user ? '今日の無料枠を使い切りました' : '無料枠を使い切りました'}
          </DialogTitle>
          <DialogDescription>
            {user
              ? 'クレジットを購入すると、無料枠を超えてAIでテーマを生成できます。無料枠は毎日リセットされます。'
              : 'ログインすると毎日2回まで無料でAI生成できます。さらにクレジットの購入も可能になります。'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {!user ? (
            <>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
                <Sparkles className="mx-auto mb-2 h-8 w-8 text-primary" />
                <p className="text-sm font-medium">Googleアカウントでログイン</p>
                <p className="mt-1 text-xs text-muted-foreground">ログインするとAI生成の無料枠＋クレジット購入が利用可能に</p>
              </div>
              <Button onClick={handleLogin} className="w-full gap-2" size="lg">
                <LogIn className="h-4 w-4" />
                Googleでログイン（無料）
              </Button>
            </>
          ) : (
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">AI生成クレジット 30回分</p>
                  <p className="text-sm text-muted-foreground">有効期限なし・買い切り</p>
                </div>
                <p className="text-lg font-bold">$3</p>
              </div>
              <Button className="mt-3 w-full gap-2" size="lg" onClick={handlePurchase} disabled={purchasing}>
                {purchasing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                {purchasing ? '処理中...' : '購入する'}
              </Button>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                Stripeの安全な決済を利用
              </p>
            </div>
          )}

          <div className="flex items-start gap-2 rounded-md bg-muted/50 p-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
            <p className="text-xs text-muted-foreground">
              テンプレートからの作成や手動でのカラー編集、エクスポートは引き続き<strong className="text-foreground">無料</strong>でご利用いただけます。
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
