import { LogIn, LogOut, Sparkles, CreditCard } from 'lucide-react'
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
        {credits.paidBalance <= 0 && credits.remaining <= 3 && (
          <DropdownMenuItem className="flex items-center gap-2 text-primary">
            <CreditCard className="h-4 w-4" />
            クレジットを購入
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="flex items-center gap-2 text-destructive">
          <LogOut className="h-4 w-4" />
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
