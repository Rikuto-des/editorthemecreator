import { useState } from 'react'
import { Sparkles, LogIn, CheckCircle2, CreditCard, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuth } from '@/contexts/AuthContext'

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
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            {user ? 'クレジットがなくなりました' : '無料のAI生成枠を使い切りました'}
          </DialogTitle>
          <DialogDescription>
            {user
              ? 'クレジットを追加購入すると、引き続きAI生成をご利用いただけます。'
              : 'アカウントを作成してクレジットを購入すると、引き続きAI生成をご利用いただけます。'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {!user && (
            <Button onClick={handleLogin} className="w-full gap-2" size="lg">
              <LogIn className="h-4 w-4" />
              Googleでログイン
            </Button>
          )}

          {user && (
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">AI生成クレジット 20回分</p>
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
