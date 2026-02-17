interface Env {
  GEMINI_API_KEY: string
}

interface RequestBody {
  description: string
}

interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string
      }>
    }
  }>
  error?: {
    message: string
    code: number
  }
}

const SYSTEM_PROMPT = `You are an expert VS Code theme designer. Given a natural language description of a desired editor theme, generate a complete VS Code color theme as JSON.

You MUST return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "name": "<theme name in English>",
  "type": "dark" or "light",
  "colors": { <all ThemeColors keys with hex color values> },
  "tokenColors": [ <array of 15 token color objects> ]
}

The "colors" object MUST contain ALL of the following keys:
"editor.background", "editor.foreground", "editor.lineHighlightBackground", "editor.selectionBackground", "editor.selectionHighlightBackground", "editor.wordHighlightBackground", "editor.findMatchBackground", "editor.findMatchHighlightBackground",
"editorGutter.background", "editorLineNumber.foreground", "editorLineNumber.activeForeground",
"sideBar.background", "sideBar.foreground", "sideBar.border", "sideBarTitle.foreground", "sideBarSectionHeader.background", "sideBarSectionHeader.foreground",
"activityBar.background", "activityBar.foreground", "activityBar.inactiveForeground", "activityBarBadge.background", "activityBarBadge.foreground",
"tab.activeBackground", "tab.activeForeground", "tab.inactiveBackground", "tab.inactiveForeground", "tab.border", "tab.activeBorder",
"titleBar.activeBackground", "titleBar.activeForeground", "titleBar.inactiveBackground", "titleBar.inactiveForeground",
"statusBar.background", "statusBar.foreground", "statusBar.border", "statusBar.debuggingBackground", "statusBar.noFolderBackground",
"panel.background", "panel.border", "panelTitle.activeBorder", "panelTitle.activeForeground", "panelTitle.inactiveForeground",
"input.background", "input.foreground", "input.border", "input.placeholderForeground", "inputOption.activeBorder",
"dropdown.background", "dropdown.foreground", "dropdown.border",
"button.background", "button.foreground", "button.hoverBackground",
"list.activeSelectionBackground", "list.activeSelectionForeground", "list.hoverBackground", "list.hoverForeground", "list.inactiveSelectionBackground", "list.highlightForeground",
"scrollbar.shadow", "scrollbarSlider.background", "scrollbarSlider.hoverBackground", "scrollbarSlider.activeBackground",
"minimap.background", "minimap.selectionHighlight",
"breadcrumb.foreground", "breadcrumb.focusForeground", "breadcrumb.activeSelectionForeground",
"focusBorder", "foreground", "widget.shadow", "selection.background", "errorForeground"

The "tokenColors" array MUST contain exactly 15 objects, each with this structure:
{ "name": "<name>", "scope": [<scope strings>], "settings": { "foreground": "#xxxxxx" } }

The 15 token colors MUST be (in order):
1. Comment (scope: ["comment", "comment.line", "comment.block"], fontStyle: "italic")
2. String (scope: ["string", "string.quoted"])
3. Number (scope: ["constant.numeric"])
4. Constant (scope: ["constant", "constant.language"])
5. Keyword (scope: ["keyword", "keyword.control"])
6. Operator (scope: ["keyword.operator"])
7. Function (scope: ["entity.name.function"])
8. Class (scope: ["entity.name.class", "entity.name.type"])
9. Variable (scope: ["variable", "variable.other"])
10. Parameter (scope: ["variable.parameter"])
11. Property (scope: ["variable.other.property"])
12. Tag (scope: ["entity.name.tag"])
13. Attribute (scope: ["entity.other.attribute-name"])
14. Regexp (scope: ["string.regexp"])
15. Escape (scope: ["constant.character.escape"])

All color values must be valid hex colors (#xxxxxx or #xxxxxxxx format).
Make the theme visually cohesive, aesthetically pleasing, and true to the user's description.
Ensure sufficient contrast between foreground and background colors for readability.`

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  const apiKey = context.env.GEMINI_API_KEY
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'サーバーの設定エラーです。管理者に連絡してください。' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    )
  }

  let body: RequestBody
  try {
    body = await context.request.json() as RequestBody
  } catch {
    return new Response(
      JSON.stringify({ error: 'リクエストの形式が正しくありません。' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    )
  }

  const { description } = body
  if (!description || typeof description !== 'string' || !description.trim()) {
    return new Response(
      JSON.stringify({ error: 'テーマの説明を入力してください。' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    )
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

  const geminiResponse = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\n---\n\n以下の説明に基づいてVS Codeテーマを生成してください:\n\n${description.trim()}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
      },
    }),
  })

  if (!geminiResponse.ok) {
    const errorData = (await geminiResponse.json().catch(() => null)) as GeminiResponse | null
    if (geminiResponse.status === 429) {
      return new Response(
        JSON.stringify({ error: 'APIのレート制限に達しました。しばらく待ってから再試行してください。' }),
        { status: 429, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
      )
    }
    return new Response(
      JSON.stringify({ error: errorData?.error?.message || `AI APIエラー (${geminiResponse.status})` }),
      { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    )
  }

  const data = (await geminiResponse.json()) as GeminiResponse
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    return new Response(
      JSON.stringify({ error: 'AIからの応答が空でした。再試行してください。' }),
      { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    )
  }

  try {
    const parsed = JSON.parse(text)
    if (!parsed.name || !parsed.type || !parsed.colors || !parsed.tokenColors) {
      return new Response(
        JSON.stringify({ error: 'AIの応答が不完全でした。再試行してください。' }),
        { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
      )
    }
    if (parsed.type !== 'dark' && parsed.type !== 'light') {
      parsed.type = 'dark'
    }
    return new Response(JSON.stringify(parsed), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  } catch {
    return new Response(
      JSON.stringify({ error: 'AIの応答をパースできませんでした。再試行してください。' }),
      { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    )
  }
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
