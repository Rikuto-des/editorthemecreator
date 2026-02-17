import { useState, useMemo } from 'react'
import { Search, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useThemeStore } from '@/stores'
import { ThemeCard } from './ThemeCard'

interface ThemeListProps {
  onSelectTheme: (id: string) => void
  onAIGenerate: (themeId: string, description: string) => void
}

export function ThemeList({ onSelectTheme }: ThemeListProps) {
  const { themes, currentThemeId, setCurrentTheme } = useThemeStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredThemes = useMemo(() => {
    if (!searchQuery.trim()) return themes
    const query = searchQuery.toLowerCase()
    return themes.filter((theme) => theme.name.toLowerCase().includes(query))
  }, [themes, searchQuery])

  const handleSelectTheme = (id: string) => {
    setCurrentTheme(id)
    onSelectTheme(id)
  }

  if (themes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Sparkles className="mb-4 h-10 w-10 text-muted-foreground/30" />
        <h3 className="mb-2 text-lg font-medium text-muted-foreground">テーマがまだありません</h3>
        <p className="text-sm text-muted-foreground/70">ホーム画面からAIでテーマを生成するか、テンプレートから作成してください</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">マイテーマ</h2>
          <p className="text-sm text-muted-foreground">
            {themes.length}個のテーマ{searchQuery.trim() && filteredThemes.length !== themes.length ? ` / ${filteredThemes.length}件表示中` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {themes.length > 3 && (
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="テーマを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-52 pl-8"
              />
            </div>
          )}
        </div>
      </div>
      {filteredThemes.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <Search className="mb-3 h-8 w-8 text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground">「{searchQuery}」に一致するテーマが見つかりません</p>
          <p className="mt-1 text-sm text-muted-foreground/70">検索キーワードを変えてお試しください</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredThemes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isSelected={theme.id === currentThemeId}
              onClick={() => handleSelectTheme(theme.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
