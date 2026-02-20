interface Env {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
}

const IP_FREE_LIMIT = 3

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

/** 未ログインユーザーのIP制限チェック（累計3回） */
async function checkIPRateLimit(
  supabaseUrl: string, serviceKey: string, ip: string,
): Promise<{ allowed: boolean; remaining: number }> {
  const res = await fetch(
    `${supabaseUrl}/rest/v1/generation_log?ip_address=eq.${encodeURIComponent(ip)}&select=id`,
    { headers: supabaseHeaders(serviceKey) },
  )
  const rows = await res.json() as Array<{ id: string }>
  const used = Array.isArray(rows) ? rows.length : 0
  return { allowed: used < IP_FREE_LIMIT, remaining: Math.max(0, IP_FREE_LIMIT - used) }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = env

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(
      JSON.stringify({ error: 'Server configuration error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const clientIP = getClientIP(context.request)
  const { allowed, remaining } = await checkIPRateLimit(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, clientIP)

  return new Response(
    JSON.stringify({ allowed, remaining }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    },
  )
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
