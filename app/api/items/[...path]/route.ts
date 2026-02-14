import { NextRequest } from 'next/server'

async function proxyRequest(request: NextRequest, path: string): Promise<Response> {
  const apiUrl = process.env.ITEMS_API_URL || ''
  const apiKey = process.env.ITEMS_API_KEY || ''

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

  const response = await fetch(url.toString(), {
    method: request.method,
    headers,
  })

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
