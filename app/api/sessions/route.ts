import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL = process.env.BACKEND_API_URL
const BACKEND_API_KEY = process.env.BACKEND_API_KEY

export async function GET(req: NextRequest) {
  if (!BACKEND_API_URL || !BACKEND_API_KEY) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  const userId = req.nextUrl.searchParams.get('user_id') || 'user_default'

  const backendRes = await fetch(
    `${BACKEND_API_URL}/v1/sessions?user_id=${encodeURIComponent(userId)}&max_results=50`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': BACKEND_API_KEY,
      },
    }
  )

  if (!backendRes.ok) {
    return NextResponse.json({ error: backendRes.statusText }, { status: backendRes.status })
  }

  const data = await backendRes.json()
  return NextResponse.json(data)
}
