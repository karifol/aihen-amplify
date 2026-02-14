import { NextRequest } from 'next/server'

const API_URL = 'https://poqzffs5v8.execute-api.ap-northeast-1.amazonaws.com/prod'
const API_KEY = 'EGy2fdcoi34GJXLuO3HZp4JFBPm1X8fH9iCElNVq'

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
