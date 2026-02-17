import { useState } from 'react'
import { LogIn, LogOut, Sparkles, CreditCard, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/AuthContext'
import { useCredits } from '@/hooks'

export function UserMenu() {
  const { user, loading, signInWithGoogle, signOut } = useAuth()
  const { credits } = useCredits()
  const [purchasing, setPurchasing] = useState(false)

  const handlePurchase = async () => {
    if (!user) return
    setPurchasing(true)
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, userEmail: user.email }),
      })
      const data = await res.json() as { url?: string }
      if (data.url) window.location.href = data.url
    } catch { /* noop */ } finally {
      setPurchasing(false)
    }
  }

  if (loading) return null

  if (!user) {
    return (
      <Button variant="ghost" size="sm" onClick={signInWithGoogle} className="gap-1.5 text-muted-foreground hover:text-foreground">
        <LogIn className="h-4 w-4" />
        <span className="hidden sm:inline">ログイン</span>
      </Button>
    )
  }

  const avatarUrl = user.user_metadata?.avatar_url
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'ユーザー'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 px-2">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-6 w-6 rounded-full" />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {displayName[0].toUpperCase()}
            </div>
          )}
          <Badge variant="secondary" className="gap-0.5 px-1.5 text-[10px]">
            <Sparkles className="h-2.5 w-2.5" />
            {credits.remaining}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium">{displayName}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="flex justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI生成クレジット
          </span>
          <Badge variant="secondary">{credits.remaining}回</Badge>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePurchase} disabled={purchasing} className="flex items-center gap-2 text-primary">
          {purchasing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
          {purchasing ? '処理中...' : 'クレジットを購入 ($3 / 20回)'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="flex items-center gap-2 text-destructive">
          <LogOut className="h-4 w-4" />
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
