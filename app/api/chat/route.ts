import { NextRequest } from 'next/server'

const BACKEND_API_URL = process.env.BACKEND_API_URL
const BACKEND_API_KEY = process.env.BACKEND_API_KEY

export async function POST(req: NextRequest) {
  if (!BACKEND_API_URL || !BACKEND_API_KEY) {
    return new Response('Server configuration error', { status: 500 })
  }

  const body = await req.json()

  const backendRes = await fetch(`${BACKEND_API_URL}/v1/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': BACKEND_API_KEY,
    },
    body: JSON.stringify(body),
  })

  if (!backendRes.ok) {
    return new Response(backendRes.statusText, { status: backendRes.status })
  }

  // ストリーミングレスポンスをそのままパイプ
  const headers = new Headers({
    'Content-Type': 'application/x-ndjson',
    'Transfer-Encoding': 'chunked',
  })

  // X-Session-Id ヘッダーを転送
  const sessionId = backendRes.headers.get('X-Session-Id')
  if (sessionId) {
    headers.set('X-Session-Id', sessionId)
  }

  return new Response(backendRes.body, { status: 200, headers })
}
