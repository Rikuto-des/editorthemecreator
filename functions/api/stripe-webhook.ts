interface Env {
  STRIPE_WEBHOOK_SECRET: string
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
}

const CREDITS_PER_PURCHASE = 30

/**
 * Stripe Webhook 署名検証（Web Crypto API使用）
 */
async function verifyStripeSignature(
  payload: string,
  sigHeader: string,
  secret: string,
): Promise<boolean> {
  const parts = sigHeader.split(',').reduce<Record<string, string>>((acc, part) => {
    const [key, value] = part.split('=')
    acc[key] = value
    return acc
  }, {})

  const timestamp = parts['t']
  const signature = parts['v1']
  if (!timestamp || !signature) return false

  // タイムスタンプが5分以上前なら拒否
  const now = Math.floor(Date.now() / 1000)
  if (Math.abs(now - parseInt(timestamp)) > 300) return false

  const signedPayload = `${timestamp}.${payload}`
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(signedPayload))
  const expectedSig = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  return expectedSig === signature
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const webhookSecret = context.env.STRIPE_WEBHOOK_SECRET
  const supabaseUrl = context.env.SUPABASE_URL
  const supabaseKey = context.env.SUPABASE_SERVICE_ROLE_KEY

  if (!webhookSecret || !supabaseUrl || !supabaseKey) {
    return new Response('Server configuration error', { status: 500 })
  }

  const sigHeader = context.request.headers.get('stripe-signature')
  if (!sigHeader) {
    return new Response('Missing signature', { status: 400 })
  }

  const payload = await context.request.text()

  // 署名検証
  const isValid = await verifyStripeSignature(payload, sigHeader, webhookSecret)
  if (!isValid) {
    return new Response('Invalid signature', { status: 400 })
  }

  const event = JSON.parse(payload) as {
    type: string
    data: {
      object: {
        id?: string
        metadata?: { user_id?: string }
        client_reference_id?: string
        payment_status?: string
      }
    }
  }

  // checkout.session.completed イベントのみ処理
  if (event.type !== 'checkout.session.completed') {
    return new Response('OK', { status: 200 })
  }

  const session = event.data.object
  if (session.payment_status !== 'paid') {
    return new Response('Payment not completed', { status: 200 })
  }

  const userId = session.metadata?.user_id || session.client_reference_id
  const sessionId = session.id
  if (!userId) {
    return new Response('No user ID found', { status: 400 })
  }

  const supaHeaders = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
  }

  // Supabase でクレジットを追加（Service Role Key でRLSバイパス）
  try {
    // 冪等性チェック: 同じセッションIDが既に処理済みなら重複付与を防止
    if (sessionId) {
      const dupCheck = await fetch(
        `${supabaseUrl}/rest/v1/stripe_payment_log?stripe_session_id=eq.${encodeURIComponent(sessionId)}&select=id`,
        { headers: supaHeaders },
      )
      const existing = await dupCheck.json() as Array<{ id: string }>
      if (Array.isArray(existing) && existing.length > 0) {
        return new Response('Already processed', { status: 200 })
      }
    }

    // 現在のクレジットを取得
    const getRes = await fetch(
      `${supabaseUrl}/rest/v1/user_credits?user_id=eq.${userId}&select=paid_balance`,
      { headers: supaHeaders },
    )

    const rows = await getRes.json() as Array<{ paid_balance: number }>
    if (!rows || rows.length === 0) {
      return new Response('User not found', { status: 404 })
    }

    const newBalance = rows[0].paid_balance + CREDITS_PER_PURCHASE

    // クレジットを更新
    const updateRes = await fetch(
      `${supabaseUrl}/rest/v1/user_credits?user_id=eq.${userId}`,
      {
        method: 'PATCH',
        headers: { ...supaHeaders, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ paid_balance: newBalance }),
      },
    )

    if (!updateRes.ok) {
      return new Response('Failed to update credits', { status: 500 })
    }

    // 処理済みセッションを記録（冪等性保証）
    if (sessionId) {
      await fetch(`${supabaseUrl}/rest/v1/stripe_payment_log`, {
        method: 'POST',
        headers: { ...supaHeaders, 'Prefer': 'return=minimal' },
        body: JSON.stringify({
          stripe_session_id: sessionId,
          user_id: userId,
          credits_added: CREDITS_PER_PURCHASE,
        }),
      })
    }

    return new Response('OK', { status: 200 })
  } catch {
    return new Response('Internal error', { status: 500 })
  }
}
