import { NextRequest } from 'next/server'

const API_URL = 'https://lgz099nfc3.execute-api.ap-northeast-1.amazonaws.com/Prod'
const API_KEY = '8YMHgTr2wF51SjAbYuuuM8dz8ngL4KZ98LGLaKVC'

async function proxyRequest(request: NextRequest, path: string): Promise<Response> {
  const url = new URL(`${API_URL}/${path}`)
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value)
  })

  const headers: Record<string, string> = {
    'x-api-key': API_KEY,
  }
  const contentType = request.headers.get('content-type')
  if (contentType) {
    headers['content-type'] = contentType
  }

  const init: RequestInit = {
    method: request.method,
    headers,
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body
    // @ts-expect-error duplex is required for streaming request body
    init.duplex = 'half'
  }

  const response = await fetch(url.toString(), init)

  const responseContentType = response.headers.get('content-type') || 'application/json'
  const isStreaming = responseContentType.includes('text/event-stream') || path === 'chat'

  const responseHeaders: Record<string, string> = {
    'content-type': isStreaming ? 'text/event-stream; charset=utf-8' : responseContentType,
    'cache-control': 'no-cache, no-transform',
    'connection': 'keep-alive',
  }
  if (isStreaming) {
    responseHeaders['x-accel-buffering'] = 'no'
  }

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  })
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  return proxyRequest(request, path.join('/'))
}
