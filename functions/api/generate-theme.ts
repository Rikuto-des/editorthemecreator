interface Env {
  GEMINI_API_KEY: string
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
}

interface RequestBody {
  description: string
}

const FREE_LIMIT = 3

/** クライアントIPを取得 */
function getClientIP(request: Request): string {
  return request.headers.get('CF-Connecting-IP')
    || request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim()
    || 'unknown'
}

/** Supabase REST APIヘルパー */
function supabaseHeaders(key: string) {
  return {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json',
  }
}

/** ログインユーザーのクレジットチェック＆消費 */
async function checkAndConsumeUserCredits(
  supabaseUrl: string, serviceKey: string, userId: string,
): Promise<{ allowed: boolean; remaining: number }> {
  const res = await fetch(
    `${supabaseUrl}/rest/v1/user_credits?user_id=eq.${userId}&select=free_used,paid_balance`,
    { headers: supabaseHeaders(serviceKey) },
  )
  const rows = await res.json() as Array<{ free_used: number; paid_balance: number }>
  if (!rows || rows.length === 0) {
    // user_credits行が未作成の既存ユーザー → ウェルカムクレジット2で自動作成
    await fetch(`${supabaseUrl}/rest/v1/user_credits`, {
      method: 'POST',
      headers: { ...supabaseHeaders(serviceKey), 'Prefer': 'return=minimal' },
      body: JSON.stringify({ user_id: userId, free_used: 0, paid_balance: 2 }),
    })
    return { allowed: true, remaining: FREE_LIMIT + 1 }
  }

  const { free_used, paid_balance } = rows[0]
  const freeRemaining = Math.max(0, FREE_LIMIT - free_used)

  if (freeRemaining > 0) {
    await fetch(`${supabaseUrl}/rest/v1/user_credits?user_id=eq.${userId}`, {
      method: 'PATCH',
      headers: { ...supabaseHeaders(serviceKey), 'Prefer': 'return=minimal' },
      body: JSON.stringify({ free_used: free_used + 1 }),
    })
    return { allowed: true, remaining: freeRemaining - 1 + paid_balance }
  } else if (paid_balance > 0) {
    await fetch(`${supabaseUrl}/rest/v1/user_credits?user_id=eq.${userId}`, {
      method: 'PATCH',
      headers: { ...supabaseHeaders(serviceKey), 'Prefer': 'return=minimal' },
      body: JSON.stringify({ paid_balance: paid_balance - 1 }),
    })
    return { allowed: true, remaining: freeRemaining + paid_balance - 1 }
  }
  return { allowed: false, remaining: 0 }
}

/** 未ログインユーザーのIP制限チェック */
async function checkIPRateLimit(
  supabaseUrl: string, serviceKey: string, ip: string,
): Promise<{ allowed: boolean; remaining: number }> {
  const res = await fetch(
    `${supabaseUrl}/rest/v1/generation_log?ip_address=eq.${encodeURIComponent(ip)}&select=id`,
    { headers: supabaseHeaders(serviceKey) },
  )
  const rows = await res.json() as Array<{ id: string }>
  const used = Array.isArray(rows) ? rows.length : 0
  return { allowed: used < FREE_LIMIT, remaining: Math.max(0, FREE_LIMIT - used) }
}

/** 生成ログを記録 */
async function logGeneration(
  supabaseUrl: string, serviceKey: string, ip: string, prompt: string, userId?: string,
) {
  await fetch(`${supabaseUrl}/rest/v1/generation_log`, {
    method: 'POST',
    headers: { ...supabaseHeaders(serviceKey), 'Prefer': 'return=minimal' },
    body: JSON.stringify({
      ip_address: ip,
      prompt,
      ...(userId ? { user_id: userId } : {}),
    }),
  })
}

/** Supabase JWTからuser_idを取得（簡易デコード） */
function getUserIdFromToken(token: string): string | null {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    return decoded.sub || null
  } catch {
    return null
  }
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
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  const apiKey = context.env.GEMINI_API_KEY
  const supabaseUrl = context.env.SUPABASE_URL
  const serviceKey = context.env.SUPABASE_SERVICE_ROLE_KEY

  if (!apiKey || !supabaseUrl || !serviceKey) {
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

  // --- サーバーサイド クレジットチェック ---
  const authHeader = context.request.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')
  const userId = token ? getUserIdFromToken(token) : null
  const clientIP = getClientIP(context.request)

  if (userId) {
    const { allowed } = await checkAndConsumeUserCredits(supabaseUrl, serviceKey, userId)
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: 'クレジットが不足しています。追加クレジットを購入してください。' }),
        { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
      )
    }
  } else {
    const { allowed, remaining } = await checkIPRateLimit(supabaseUrl, serviceKey, clientIP)
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: `無料枠（${FREE_LIMIT}回）を使い切りました。アカウントを作成してさらにご利用ください。`, remaining: 0 }),
        { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
      )
    }
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
    // 生成成功 → ログ記録
    logGeneration(supabaseUrl, serviceKey, clientIP, description.trim(), userId || undefined)

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
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
