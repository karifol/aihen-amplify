import { NextRequest } from 'next/server'

const API_URL = 'https://pskgdhik95.execute-api.ap-northeast-1.amazonaws.com/Prod'
const API_KEY = 'oYfue6ET7d770SPUSQ06NacbJPRz1R3N7LU2RgQO'

async function proxyRequest(request: NextRequest, path: string): Promise<Response> {
  const url = new URL(`${API_URL}/${path}`)
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value)
  })

  const headers: Record<string, string> = {
    'x-api-key': API_KEY,
    'content-type': 'application/json',
  }

  const init: RequestInit = { method: request.method, headers }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.text()
  }

  try {
    const response = await fetch(url.toString(), init)
    const text = await response.text()
    let json: Record<string, unknown> | null = null
    try { json = JSON.parse(text) } catch { /* not JSON */ }

    if (json && typeof json.image_b64 === 'string') {
      const binary = Buffer.from(json.image_b64, 'base64')
      return new Response(binary, {
        status: response.status,
        headers: { 'content-type': 'image/png', 'cache-control': 'private, max-age=3600' },
      })
    }

    return new Response(text, {
      status: response.status,
      headers: { 'content-type': 'application/json' },
    })
  } catch (e) {
    console.error('proxy error:', e)
    return Response.json({ error: 'Upstream request failed' }, { status: 502 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  return proxyRequest(request, path.join('/'))
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  return proxyRequest(request, path.join('/'))
}
