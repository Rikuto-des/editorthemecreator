import { useRef, useCallback } from 'react'
import type { Theme, TokenColor } from '@/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { COLOR_CATEGORIES } from '@/constants'
import { useThemeStore, useHistoryStore } from '@/stores'
import { ColorPicker } from './ColorPicker'
import { TokenColorEditor } from './TokenColorEditor'

interface EditorPanelProps {
  theme: Theme
}

export function EditorPanel({ theme }: EditorPanelProps) {
  const updateThemeColor = useThemeStore((state) => state.updateThemeColor)
  const updateTokenColor = useThemeStore((state) => state.updateTokenColor)
  const pushHistory = useHistoryStore((state) => state.pushHistory)

  const lastHistoryPushRef = useRef<number>(0)
  const DEBOUNCE_MS = 500

  const pushHistoryDebounced = useCallback((currentTheme: Theme) => {
    const now = Date.now()
    if (now - lastHistoryPushRef.current > DEBOUNCE_MS) {
      pushHistory(currentTheme)
      lastHistoryPushRef.current = now
    }
  }, [pushHistory])

  const handleColorChange = (key: string, value: string) => {
    pushHistoryDebounced(theme)
    updateThemeColor(theme.id, key as keyof typeof theme.colors, value)
  }

  const handleTokenColorChange = (index: number, tokenColor: TokenColor) => {
    pushHistoryDebounced(theme)
    updateTokenColor(theme.id, index, tokenColor)
  }

  return (
    <Tabs defaultValue="colors" className="h-full">
      <div className="border-b border-border px-4 pt-2">
        <TabsList className="w-full">
          <TabsTrigger value="colors" className="flex-1">UIカラー</TabsTrigger>
          <TabsTrigger value="syntax" className="flex-1">シンタックス</TabsTrigger>
        </TabsList>
      </div>
      <ScrollArea className="h-[calc(100%-49px)]">
        <TabsContent value="colors" className="m-0 p-4">
          {COLOR_CATEGORIES.map((category, index) => (
            <div key={category.id}>
              {index > 0 && <Separator className="my-4" />}
              <h4 className="mb-3 text-sm font-medium text-muted-foreground">
                {category.name}
              </h4>
              <div className="space-y-3">
                {category.keys.map((key) => (
                  <ColorPicker
                    key={key}
                    label={key}
                    value={theme.colors[key]}
                    onChange={(value: string) => handleColorChange(key, value)}
                  />
                ))}
              </div>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="syntax" className="m-0 p-4">
          <h4 className="mb-3 text-sm font-medium text-muted-foreground">
            シンタックスハイライト
          </h4>
          <div className="space-y-2">
            {theme.tokenColors.map((tokenColor, index) => (
              <TokenColorEditor
                key={index}
                tokenColor={tokenColor}
                onChange={(updated) => handleTokenColorChange(index, updated)}
              />
            ))}
          </div>
        </TabsContent>
      </ScrollArea>
    </Tabs>
  )
}
