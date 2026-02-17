import JSZip from 'jszip'
import type { Theme } from '@/types'
import { themeToVSCode } from './theme-converter'

/**
 * テーマの安全なスラッグ名を生成
 */
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'custom-theme'
}

/**
 * VSIX に必要な [Content_Types].xml を生成
 */
function buildContentTypes(): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension=".json" ContentType="application/json" />
  <Default Extension=".vsixmanifest" ContentType="text/xml" />
</Types>`
}

/**
 * VSIX マニフェストを生成
 */
function buildVsixManifest(slug: string, displayName: string): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011" xmlns:d="http://schemas.microsoft.com/developer/vsx-schema-design/2011">
  <Metadata>
    <Identity Language="en-US" Id="${slug}" Version="1.0.0" Publisher="editor-theme-creator" />
    <DisplayName>${displayName}</DisplayName>
    <Description>Custom editor theme created with Themeleon</Description>
    <Categories>Themes</Categories>
  </Metadata>
  <Installation>
    <InstallationTarget Id="Microsoft.VisualStudio.Code" />
  </Installation>
  <Dependencies />
  <Assets>
    <Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true" />
  </Assets>
</PackageManifest>`
}

/**
 * 拡張機能の package.json を生成
 */
function buildPackageJson(slug: string, displayName: string, themeType: 'dark' | 'light'): string {
  return JSON.stringify(
    {
      name: slug,
      displayName,
      version: '1.0.0',
      publisher: 'editor-theme-creator',
      engines: { vscode: '^1.60.0' },
      categories: ['Themes'],
      contributes: {
        themes: [
          {
            label: displayName,
            uiTheme: themeType === 'dark' ? 'vs-dark' : 'vs',
            path: './themes/theme.json',
          },
        ],
      },
    },
    null,
    2,
  )
}

/**
 * ブラウザ内で Theme から VSIX パッケージを生成し、Blob として返す
 */
export async function buildVsix(theme: Theme): Promise<Blob> {
  const slug = toSlug(theme.name)
  const vscodeTheme = themeToVSCode(theme)

  const zip = new JSZip()

  zip.file('[Content_Types].xml', buildContentTypes())
  zip.file('extension.vsixmanifest', buildVsixManifest(slug, theme.name))
  zip.file('extension/package.json', buildPackageJson(slug, theme.name, theme.type))
  zip.file('extension/themes/theme.json', JSON.stringify(vscodeTheme, null, 2))

  return zip.generateAsync({ type: 'blob' })
}

/**
 * VSIX をダウンロードする
 */
export function downloadVsix(blob: Blob, themeName: string): void {
  const slug = toSlug(themeName)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${slug}.vsix`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * vscode:// プロトコルで VS Code を起動する
 */
export function openVSCode(): void {
  window.open('vscode://', '_blank')
}

/**
 * Windsurf を起動する（windsurf:// プロトコル）
 */
export function openWindsurf(): void {
  window.open('windsurf://', '_blank')
}
