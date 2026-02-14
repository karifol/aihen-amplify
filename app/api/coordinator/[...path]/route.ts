import { NextRequest } from 'next/server'

async function proxyRequest(request: NextRequest, path: string): Promise<Response> {
  const apiUrl = process.env.COORDINATOR_API_URL || ''
  const apiKey = process.env.COORDINATOR_API_KEY || ''

  const url = new URL(`${apiUrl}/${path}`)
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value)
  })

  const headers: Record<string, string> = {
    'x-api-key': apiKey,
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

  return new Response(response.body, {
    status: response.status,
    headers: {
      'content-type': response.headers.get('content-type') || 'application/json',
    },
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
