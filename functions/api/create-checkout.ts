interface Env {
  STRIPE_SECRET_KEY: string
  STRIPE_PRICE_ID: string
}

interface RequestBody {
  userId: string
  userEmail?: string
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

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  const stripeKey = context.env.STRIPE_SECRET_KEY
  const priceId = context.env.STRIPE_PRICE_ID

  if (!stripeKey || !priceId) {
    return new Response(
      JSON.stringify({ error: 'サーバーの設定エラーです。' }),
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

  const { userId, userEmail } = body
  if (!userId) {
    return new Response(
      JSON.stringify({ error: 'ログインが必要です。' }),
      { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    )
  }

  // JWT検証: AuthorizationヘッダーからuserIdを取得して照合
  const authHeader = context.request.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')
  const tokenUserId = token ? getUserIdFromToken(token) : null
  if (!tokenUserId || tokenUserId !== userId) {
    return new Response(
      JSON.stringify({ error: '認証が無効です。再ログインしてください。' }),
      { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    )
  }

  // リクエスト元のオリジンを取得（成功/キャンセルURL用）
  const origin = context.request.headers.get('Origin') || 'https://theme-leon.com'

  try {
    // Stripe Checkout Session を作成
    const params = new URLSearchParams({
      'mode': 'payment',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      'success_url': `${origin}?payment=success`,
      'cancel_url': `${origin}?payment=cancel`,
      'metadata[user_id]': userId,
      'client_reference_id': userId,
    })

    if (userEmail) {
      params.append('customer_email', userEmail)
    }

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    const session = await response.json() as { url?: string; error?: { message: string } }

    if (!response.ok || !session.url) {
      return new Response(
        JSON.stringify({ error: session.error?.message || '決済セッションの作成に失敗しました。' }),
        { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
      )
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: '決済処理中にエラーが発生しました。' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    )
  }
}
