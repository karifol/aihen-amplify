import { NextRequest, NextResponse } from 'next/server'

const BACKEND_API_URL = process.env.BACKEND_API_URL
const BACKEND_API_KEY = process.env.BACKEND_API_KEY

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!BACKEND_API_URL || !BACKEND_API_KEY) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  const { id } = await params

  const backendRes = await fetch(`${BACKEND_API_URL}/v1/sessions/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': BACKEND_API_KEY,
    },
  })

  if (!backendRes.ok) {
    return NextResponse.json({ error: backendRes.statusText }, { status: backendRes.status })
  }

  return NextResponse.json({ success: true })
}
