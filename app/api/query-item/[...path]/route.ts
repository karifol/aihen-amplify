import { NextRequest } from 'next/server'

const API_URL = process.env.QUERY_ITEM_API_URL || ''
const API_KEY = process.env.QUERY_ITEM_API_KEY || ''

async function proxyRequest(request: NextRequest, path: string): Promise<Response> {
  if (!API_URL) {
    return Response.json({ error: 'QUERY_ITEM_API_URL is not configured' }, { status: 500 })
  }

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
    const body = await response.text()
    return new Response(body, {
      status: response.status,
      headers: { 'content-type': 'application/json' },
    })
  } catch (e) {
    console.error('proxy error:', e)
    return Response.json({ error: 'Upstream request failed' }, { status: 502 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  return proxyRequest(request, path.join('/'))
}
