import { useRef } from 'react'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/stores'
import { importThemeFromFile } from '@/utils'

interface ImportButtonProps {
  onImport: (themeId: string) => void
}

export function ImportButton({ onImport }: ImportButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const addTheme = useThemeStore((state) => state.addTheme)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const theme = await importThemeFromFile(file)
      addTheme(theme)
      toast.success(`"${theme.name}" をインポートしました`)
      onImport(theme.id)
    } catch {
      toast.error('テーマファイルの読み込みに失敗しました', {
        description: '有効なVSCodeテーマファイルを選択してください。',
      })
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button size="sm" variant="outline" onClick={handleClick}>
        <Upload className="mr-1 h-4 w-4" />
        インポート
      </Button>
    </>
  )
}
