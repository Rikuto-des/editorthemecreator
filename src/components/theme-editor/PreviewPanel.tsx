import { useMemo, type CSSProperties } from 'react'
import type { Theme, TokenColor } from '@/types'
import { useHighlightStore } from '@/stores'

interface PreviewPanelProps {
  theme: Theme
}

interface CodeToken {
  text: string
  type: 'comment' | 'string' | 'number' | 'keyword' | 'function' | 'class' | 'variable' | 'operator' | 'property' | 'plain'
}

const SAMPLE_TOKENS: CodeToken[] = [
  { text: '// Sample code preview\n', type: 'comment' },
  { text: 'function', type: 'keyword' },
  { text: ' ', type: 'plain' },
  { text: 'greet', type: 'function' },
  { text: '(', type: 'plain' },
  { text: 'name', type: 'variable' },
  { text: ': ', type: 'plain' },
  { text: 'string', type: 'keyword' },
  { text: '): ', type: 'plain' },
  { text: 'string', type: 'keyword' },
  { text: ' {\n  ', type: 'plain' },
  { text: 'const', type: 'keyword' },
  { text: ' ', type: 'plain' },
  { text: 'message', type: 'variable' },
  { text: ' = ', type: 'plain' },
  { text: '`Hello, ${', type: 'string' },
  { text: 'name', type: 'variable' },
  { text: '}!`', type: 'string' },
  { text: ';\n  ', type: 'plain' },
  { text: 'console', type: 'variable' },
  { text: '.', type: 'plain' },
  { text: 'log', type: 'function' },
  { text: '(', type: 'plain' },
  { text: 'message', type: 'variable' },
  { text: ');\n  ', type: 'plain' },
  { text: 'return', type: 'keyword' },
  { text: ' ', type: 'plain' },
  { text: 'message', type: 'variable' },
  { text: ';\n}\n\n', type: 'plain' },
  { text: '// Call the function\n', type: 'comment' },
  { text: 'const', type: 'keyword' },
  { text: ' ', type: 'plain' },
  { text: 'result', type: 'variable' },
  { text: ' = ', type: 'plain' },
  { text: 'greet', type: 'function' },
  { text: '(', type: 'plain' },
  { text: '"World"', type: 'string' },
  { text: ');\n', type: 'plain' },
  { text: 'console', type: 'variable' },
  { text: '.', type: 'plain' },
  { text: 'log', type: 'function' },
  { text: '(', type: 'plain' },
  { text: 'result', type: 'variable' },
  { text: '); ', type: 'plain' },
  { text: '// Output: Hello, World!\n\n', type: 'comment' },
  { text: 'class', type: 'keyword' },
  { text: ' ', type: 'plain' },
  { text: 'Calculator', type: 'class' },
  { text: ' {\n  ', type: 'plain' },
  { text: 'private', type: 'keyword' },
  { text: ' ', type: 'plain' },
  { text: 'value', type: 'property' },
  { text: ': ', type: 'plain' },
  { text: 'number', type: 'keyword' },
  { text: ' = ', type: 'plain' },
  { text: '0', type: 'number' },
  { text: ';\n\n  ', type: 'plain' },
  { text: 'add', type: 'function' },
  { text: '(', type: 'plain' },
  { text: 'n', type: 'variable' },
  { text: ': ', type: 'plain' },
  { text: 'number', type: 'keyword' },
  { text: '): ', type: 'plain' },
  { text: 'this', type: 'keyword' },
  { text: ' {\n    ', type: 'plain' },
  { text: 'this', type: 'keyword' },
  { text: '.', type: 'plain' },
  { text: 'value', type: 'property' },
  { text: ' += ', type: 'operator' },
  { text: 'n', type: 'variable' },
  { text: ';\n    ', type: 'plain' },
  { text: 'return', type: 'keyword' },
  { text: ' ', type: 'plain' },
  { text: 'this', type: 'keyword' },
  { text: ';\n  }\n\n  ', type: 'plain' },
  { text: 'getResult', type: 'function' },
  { text: '(): ', type: 'plain' },
  { text: 'number', type: 'keyword' },
  { text: ' {\n    ', type: 'plain' },
  { text: 'return', type: 'keyword' },
  { text: ' ', type: 'plain' },
  { text: 'this', type: 'keyword' },
  { text: '.', type: 'plain' },
  { text: 'value', type: 'property' },
  { text: ';\n  }\n}', type: 'plain' },
]

function getTokenColor(tokenColors: TokenColor[], tokenType: CodeToken['type']): string | undefined {
  const scopeMap: Record<CodeToken['type'], string[]> = {
    comment: ['comment'],
    string: ['string'],
    number: ['constant.numeric'],
    keyword: ['keyword'],
    function: ['entity.name.function'],
    class: ['entity.name.class', 'entity.name.type.class'],
    variable: ['variable'],
    operator: ['keyword.operator'],
    property: ['variable.other.property'],
    plain: [],
  }

  const scopes = scopeMap[tokenType]
  if (scopes.length === 0) return undefined

  for (const tc of tokenColors) {
    const tcScopes = Array.isArray(tc.scope) ? tc.scope : [tc.scope]
    for (const scope of scopes) {
      if (tcScopes.some((s) => s.includes(scope) || scope.includes(s))) {
        return tc.settings.foreground
      }
    }
  }
  return undefined
}

const SCOPE_TO_TOKEN_TYPE: Record<string, CodeToken['type'][]> = {
  comment: ['comment'],
  string: ['string'],
  'constant.numeric': ['number'],
  keyword: ['keyword'],
  'entity.name.function': ['function'],
  'entity.name.class': ['class'],
  'entity.name.type.class': ['class'],
  variable: ['variable'],
  'keyword.operator': ['operator'],
  'variable.other.property': ['property'],
}

function getHighlightedTokenTypes(scope: string | null): Set<CodeToken['type']> {
  if (!scope) return new Set()
  const types = new Set<CodeToken['type']>()
  for (const [key, tokenTypes] of Object.entries(SCOPE_TO_TOKEN_TYPE)) {
    if (key.includes(scope) || scope.includes(key)) {
      tokenTypes.forEach((t) => types.add(t))
    }
  }
  return types
}

const HL_STYLE: CSSProperties = {
  outline: '2px solid #facc15',
  outlineOffset: '-1px',
  borderRadius: '2px',
}

export function PreviewPanel({ theme }: PreviewPanelProps) {
  const { colors, tokenColors } = theme
  const hoveredKey = useHighlightStore((s) => s.hoveredKey)
  const hoveredScope = useHighlightStore((s) => s.hoveredScope)

  const highlightedTokenTypes = useMemo(
    () => getHighlightedTokenTypes(hoveredScope),
    [hoveredScope],
  )

  const hl = (keys: string[]): CSSProperties =>
    hoveredKey && keys.includes(hoveredKey) ? HL_STYLE : {}

  const lineCount = SAMPLE_TOKENS.reduce(
    (acc, t) => acc + (t.text.match(/\n/g) || []).length,
    1,
  )

  return (
    <div className="flex h-full flex-col text-[11px]" style={{ color: colors['foreground'] }}>
      {/* ===== タイトルバー ===== */}
      <div className="flex h-7 shrink-0 items-center">
        <div
          className="flex flex-1 items-center px-3 h-full"
          style={{
            backgroundColor: colors['titleBar.activeBackground'],
            color: colors['titleBar.activeForeground'],
            ...hl(['titleBar.activeBackground', 'titleBar.activeForeground']),
          }}
        >
          Themeleon
        </div>
        <div
          className="flex items-center px-3 h-full text-[10px]"
          style={{
            backgroundColor: colors['titleBar.inactiveBackground'],
            color: colors['titleBar.inactiveForeground'],
            ...hl(['titleBar.inactiveBackground', 'titleBar.inactiveForeground']),
          }}
        >
          (inactive)
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ===== アクティビティバー ===== */}
        <div
          className="flex w-10 shrink-0 flex-col items-center gap-2 py-2"
          style={{
            backgroundColor: colors['activityBar.background'],
            color: colors['activityBar.foreground'],
            ...hl([
              'activityBar.background',
              'activityBar.foreground',
              'activityBar.inactiveForeground',
            ]),
          }}
        >
          <div className="relative flex h-5 w-5 items-center justify-center rounded bg-current opacity-80">
            <div
              className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-bold"
              style={{
                backgroundColor: colors['activityBarBadge.background'],
                color: colors['activityBarBadge.foreground'],
                ...hl(['activityBarBadge.background', 'activityBarBadge.foreground']),
              }}
            >
              3
            </div>
          </div>
          <div
            className="h-5 w-5 rounded bg-current opacity-30"
            style={{ color: colors['activityBar.inactiveForeground'] }}
          />
          <div
            className="h-5 w-5 rounded bg-current opacity-30"
            style={{ color: colors['activityBar.inactiveForeground'] }}
          />
        </div>

        {/* ===== サイドバー ===== */}
        <div
          className="flex w-40 shrink-0 flex-col border-r"
          style={{
            backgroundColor: colors['sideBar.background'],
            color: colors['sideBar.foreground'],
            borderColor: colors['sideBar.border'],
            ...hl(['sideBar.background', 'sideBar.foreground', 'sideBar.border']),
          }}
        >
          <div
            className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide"
            style={{
              color: colors['sideBarTitle.foreground'],
              ...hl(['sideBarTitle.foreground']),
            }}
          >
            Explorer
          </div>
          <div
            className="px-2 py-0.5 text-[10px] font-semibold"
            style={{
              backgroundColor: colors['sideBarSectionHeader.background'],
              color: colors['sideBarSectionHeader.foreground'],
              ...hl([
                'sideBarSectionHeader.background',
                'sideBarSectionHeader.foreground',
              ]),
            }}
          >
            PROJECT
          </div>

          {/* リスト */}
          <div className="flex-1 overflow-y-auto py-0.5">
            <div
              className="px-2 py-0.5"
              style={{
                backgroundColor: colors['list.activeSelectionBackground'],
                color: colors['list.activeSelectionForeground'],
                ...hl([
                  'list.activeSelectionBackground',
                  'list.activeSelectionForeground',
                ]),
              }}
            >
              📁 src
            </div>
            <div
              className="py-0.5 pl-5 pr-2"
              style={{
                backgroundColor: colors['list.hoverBackground'],
                color: colors['list.hoverForeground'],
                ...hl(['list.hoverBackground', 'list.hoverForeground']),
              }}
            >
              📄 App.tsx
            </div>
            <div
              className="py-0.5 pl-5 pr-2"
              style={{
                backgroundColor: colors['list.inactiveSelectionBackground'],
                ...hl(['list.inactiveSelectionBackground']),
              }}
            >
              📄 index.css
            </div>
            <div className="py-0.5 pl-5 pr-2">
              <span
                style={{
                  color: colors['list.highlightForeground'],
                  ...hl(['list.highlightForeground']),
                }}
              >
                util
              </span>
              s.ts
            </div>
          </div>

          {/* 入力フィールド */}
          <div className="px-2 py-1">
            <div className="flex items-center gap-1">
              <div
                className="flex-1 rounded-sm border px-1.5 py-0.5"
                style={{
                  backgroundColor: colors['input.background'],
                  color: colors['input.foreground'],
                  borderColor: colors['input.border'],
                  ...hl([
                    'input.background',
                    'input.foreground',
                    'input.border',
                    'input.placeholderForeground',
                  ]),
                }}
              >
                <span style={{ color: colors['input.placeholderForeground'] }}>
                  Search...
                </span>
              </div>
              <div
                className="rounded-sm border-2 px-1 py-0.5 text-[9px]"
                style={{
                  borderColor: colors['inputOption.activeBorder'],
                  backgroundColor: `${colors['inputOption.activeBorder']}30`,
                  color: colors['input.foreground'],
                  ...hl(['inputOption.activeBorder']),
                }}
              >
                Aa
              </div>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-1 px-2 py-0.5">
            <div
              className="flex-1 rounded-sm px-2 py-0.5 text-center"
              style={{
                backgroundColor: colors['button.background'],
                color: colors['button.foreground'],
                ...hl(['button.background', 'button.foreground']),
              }}
            >
              Run
            </div>
            <div
              className="flex-1 rounded-sm px-2 py-0.5 text-center"
              style={{
                backgroundColor: colors['button.hoverBackground'],
                color: colors['button.foreground'],
                ...hl(['button.hoverBackground']),
              }}
            >
              Hover
            </div>
          </div>

          {/* ドロップダウン */}
          <div className="px-2 py-1">
            <div
              className="rounded-sm border px-1.5 py-0.5"
              style={{
                backgroundColor: colors['dropdown.background'],
                color: colors['dropdown.foreground'],
                borderColor: colors['dropdown.border'],
                ...hl([
                  'dropdown.background',
                  'dropdown.foreground',
                  'dropdown.border',
                ]),
              }}
            >
              main ▾
            </div>
          </div>
        </div>

        {/* ===== メインエディタエリア ===== */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* ブレッドクラム */}
          <div
            className="flex h-5 shrink-0 items-center gap-1 px-3"
            style={{
              backgroundColor: colors['editor.background'],
              ...hl([
                'breadcrumb.foreground',
                'breadcrumb.focusForeground',
                'breadcrumb.activeSelectionForeground',
              ]),
            }}
          >
            <span style={{ color: colors['breadcrumb.foreground'] }}>src</span>
            <span style={{ color: colors['breadcrumb.foreground'], opacity: 0.5 }}>
              /
            </span>
            <span style={{ color: colors['breadcrumb.focusForeground'] }}>
              components
            </span>
            <span style={{ color: colors['breadcrumb.foreground'], opacity: 0.5 }}>
              /
            </span>
            <span style={{ color: colors['breadcrumb.activeSelectionForeground'] }}>
              preview.ts
            </span>
          </div>

          {/* タブバー */}
          <div
            className="flex h-8 shrink-0 items-center border-b"
            style={{
              backgroundColor: colors['tab.inactiveBackground'],
              borderColor: colors['tab.border'],
              ...hl(['tab.border', 'tab.inactiveBackground']),
            }}
          >
            <div
              className="flex h-full items-center border-b-2 border-r px-3"
              style={{
                backgroundColor: colors['tab.activeBackground'],
                color: colors['tab.activeForeground'],
                borderBottomColor: colors['tab.activeBorder'],
                borderRightColor: colors['tab.border'],
                ...hl([
                  'tab.activeBackground',
                  'tab.activeForeground',
                  'tab.activeBorder',
                ]),
              }}
            >
              preview.ts
            </div>
            <div
              className="flex h-full items-center px-3"
              style={{
                color: colors['tab.inactiveForeground'],
                ...hl(['tab.inactiveForeground']),
              }}
            >
              styles.css
            </div>
          </div>

          {/* エディタ本体: ガター + コード + ミニマップ + スクロールバー */}
          <div className="flex flex-1 overflow-hidden">
            {/* エディタガター */}
            <div
              className="flex shrink-0 flex-col items-end py-0.5 pr-2 pl-1 font-mono leading-[1.5]"
              style={{
                backgroundColor: colors['editorGutter.background'],
                color: colors['editorLineNumber.foreground'],
                minWidth: '2.5em',
                ...hl([
                  'editorGutter.background',
                  'editorLineNumber.foreground',
                  'editorLineNumber.activeForeground',
                ]),
              }}
            >
              {Array.from({ length: lineCount }, (_, i) => (
                <div
                  key={i}
                  style={
                    i === 4
                      ? { color: colors['editorLineNumber.activeForeground'] }
                      : undefined
                  }
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {/* コードエリア */}
            <div
              className="flex-1 overflow-auto font-mono leading-[1.5]"
              style={{
                backgroundColor: colors['editor.background'],
                color: colors['editor.foreground'],
                ...hl(['editor.background', 'editor.foreground']),
              }}
            >
              <pre className="relative whitespace-pre-wrap px-1 py-0.5">
                {/* 行ハイライト (5行目) */}
                <div
                  className="pointer-events-none absolute left-0 right-0"
                  style={{
                    top: `calc(0.125rem + ${4 * 1.5}em)`,
                    height: '1.5em',
                    backgroundColor: colors['editor.lineHighlightBackground'],
                    ...hl(['editor.lineHighlightBackground']),
                  }}
                />
                {/* 選択ハイライト */}
                <div
                  className="pointer-events-none absolute"
                  style={{
                    top: `calc(0.125rem + ${2 * 1.5}em)`,
                    left: 'calc(0.25rem + 2ch)',
                    width: '14ch',
                    height: '1.5em',
                    backgroundColor: colors['editor.selectionBackground'],
                    opacity: 0.6,
                    ...hl(['editor.selectionBackground']),
                  }}
                />
                {/* 選択ハイライト（他の出現箇所） */}
                <div
                  className="pointer-events-none absolute"
                  style={{
                    top: `calc(0.125rem + ${9 * 1.5}em)`,
                    left: 'calc(0.25rem + 10ch)',
                    width: '8ch',
                    height: '1.5em',
                    backgroundColor: colors['editor.selectionHighlightBackground'],
                    opacity: 0.4,
                    ...hl(['editor.selectionHighlightBackground']),
                  }}
                />
                {/* 検索マッチ（現在） */}
                <div
                  className="pointer-events-none absolute"
                  style={{
                    top: `calc(0.125rem + ${6 * 1.5}em)`,
                    left: 'calc(0.25rem + 6ch)',
                    width: '5ch',
                    height: '1.5em',
                    backgroundColor: colors['editor.findMatchBackground'],
                    opacity: 0.7,
                    ...hl(['editor.findMatchBackground']),
                  }}
                />
                {/* 検索マッチ（他の出現箇所） */}
                <div
                  className="pointer-events-none absolute"
                  style={{
                    top: `calc(0.125rem + ${11 * 1.5}em)`,
                    left: 'calc(0.25rem + 4ch)',
                    width: '5ch',
                    height: '1.5em',
                    backgroundColor: colors['editor.findMatchHighlightBackground'],
                    opacity: 0.5,
                    ...hl(['editor.findMatchHighlightBackground']),
                  }}
                />
                {/* 単語ハイライト */}
                <div
                  className="pointer-events-none absolute"
                  style={{
                    top: `calc(0.125rem + ${8 * 1.5}em)`,
                    left: 'calc(0.25rem + 8ch)',
                    width: '7ch',
                    height: '1.5em',
                    backgroundColor: colors['editor.wordHighlightBackground'],
                    opacity: 0.5,
                    ...hl(['editor.wordHighlightBackground']),
                  }}
                />
                {SAMPLE_TOKENS.map((token, index) => {
                  const color =
                    getTokenColor(tokenColors, token.type) ||
                    colors['editor.foreground']
                  const isScopeHL =
                    highlightedTokenTypes.has(token.type) &&
                    token.type !== 'plain'
                  return (
                    <span
                      key={index}
                      style={{
                        color,
                        ...(isScopeHL
                          ? {
                              backgroundColor: 'rgba(250, 204, 21, 0.25)',
                              borderRadius: '2px',
                            }
                          : {}),
                      }}
                    >
                      {token.text}
                    </span>
                  )
                })}
              </pre>
            </div>

            {/* ミニマップ */}
            <div
              className="w-8 shrink-0 py-1"
              style={{
                backgroundColor: colors['minimap.background'],
                ...hl(['minimap.background', 'minimap.selectionHighlight']),
              }}
            >
              {Array.from({ length: 14 }, (_, i) => (
                <div
                  key={i}
                  className="mx-1 my-px rounded-sm"
                  style={{
                    height: '2px',
                    backgroundColor:
                      i === 4
                        ? colors['minimap.selectionHighlight']
                        : `${colors['editor.foreground']}20`,
                  }}
                />
              ))}
            </div>

            {/* スクロールバー */}
            <div
              className="relative w-3 shrink-0"
              style={{
                backgroundColor: colors['editor.background'],
                boxShadow: `inset 2px 0 4px ${colors['scrollbar.shadow']}`,
                ...hl(['scrollbar.shadow']),
              }}
            >
              <div
                className="absolute left-0 right-0 top-1 rounded-sm"
                style={{
                  height: '15%',
                  backgroundColor: colors['scrollbarSlider.background'],
                  ...hl(['scrollbarSlider.background']),
                }}
              />
              <div
                className="absolute left-0 right-0 rounded-sm"
                style={{
                  top: '20%',
                  height: '15%',
                  backgroundColor: colors['scrollbarSlider.hoverBackground'],
                  ...hl(['scrollbarSlider.hoverBackground']),
                }}
              />
              <div
                className="absolute left-0 right-0 rounded-sm"
                style={{
                  top: '38%',
                  height: '15%',
                  backgroundColor: colors['scrollbarSlider.activeBackground'],
                  ...hl(['scrollbarSlider.activeBackground']),
                }}
              />
            </div>
          </div>

          {/* ===== パネル（ターミナル） ===== */}
          <div
            className="flex shrink-0 flex-col border-t"
            style={{
              height: '25%',
              minHeight: '5rem',
              backgroundColor: colors['panel.background'],
              borderColor: colors['panel.border'],
              ...hl(['panel.background', 'panel.border']),
            }}
          >
            <div className="flex h-6 shrink-0 items-center gap-3 px-3">
              <span
                className="border-b"
                style={{
                  borderColor: colors['panelTitle.activeBorder'],
                  color: colors['panelTitle.activeForeground'],
                  ...hl([
                    'panelTitle.activeBorder',
                    'panelTitle.activeForeground',
                  ]),
                }}
              >
                TERMINAL
              </span>
              <span
                style={{
                  color: colors['panelTitle.inactiveForeground'],
                  ...hl(['panelTitle.inactiveForeground']),
                }}
              >
                PROBLEMS
              </span>
              <span style={{ color: colors['panelTitle.inactiveForeground'] }}>
                OUTPUT
              </span>
            </div>
            <div
              className="flex-1 overflow-auto px-3 py-1 font-mono"
              style={{ color: colors['editor.foreground'] }}
            >
              <div>$ npm run build</div>
              <div style={{ color: colors['foreground'], ...hl(['foreground']) }}>
                Compiling...
              </div>
              <div
                style={{
                  color: colors['errorForeground'],
                  ...hl(['errorForeground']),
                }}
              >
                Error: Missing semicolon
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== ステータスバー ===== */}
      <div
        className="flex h-6 shrink-0 items-center border-t"
        style={{
          borderColor: colors['statusBar.border'],
          ...hl(['statusBar.border']),
        }}
      >
        <div
          className="flex flex-1 items-center gap-2 px-2 h-full"
          style={{
            backgroundColor: colors['statusBar.background'],
            color: colors['statusBar.foreground'],
            ...hl(['statusBar.background', 'statusBar.foreground']),
          }}
        >
          <span>main</span>
          <span>TypeScript</span>
        </div>
        <div
          className="flex items-center gap-1 px-2 h-full text-[9px]"
          style={{
            backgroundColor: colors['statusBar.debuggingBackground'],
            color: colors['statusBar.foreground'],
            ...hl(['statusBar.debuggingBackground']),
          }}
        >
          Debug
        </div>
        <div
          className="flex items-center gap-1 px-2 h-full text-[9px]"
          style={{
            backgroundColor: colors['statusBar.noFolderBackground'],
            color: colors['statusBar.foreground'],
            ...hl(['statusBar.noFolderBackground']),
          }}
        >
          No Folder
        </div>
        <div
          className="flex items-center gap-2 px-2 h-full"
          style={{
            backgroundColor: colors['statusBar.background'],
            color: colors['statusBar.foreground'],
          }}
        >
          <span>Ln 5</span>
          <span>UTF-8</span>
        </div>
      </div>

      {/* フォーカスボーダー / ウィジェットシャドウ / 選択背景の可視化 */}
      {hoveredKey === 'focusBorder' && (
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{ outline: `2px solid ${colors['focusBorder']}`, outlineOffset: '-2px' }}
        />
      )}
      {hoveredKey === 'widget.shadow' && (
        <div
          className="pointer-events-none absolute inset-[15%] z-20 rounded-md"
          style={{
            backgroundColor: colors['editor.background'],
            boxShadow: `0 4px 24px ${colors['widget.shadow']}`,
            border: `1px solid ${colors['panel.border']}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors['foreground'],
            fontSize: '12px',
          }}
        >
          Widget Shadow Preview
        </div>
      )}
      {hoveredKey === 'selection.background' && (
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{ backgroundColor: `${colors['selection.background']}30` }}
        />
      )}
    </div>
  )
}
