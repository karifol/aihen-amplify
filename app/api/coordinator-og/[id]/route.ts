import { NextRequest } from 'next/server'
import { extractCoordinateId } from '../../../coordinator/gallery/utils'

const API_URL = 'https://pskgdhik95.execute-api.ap-northeast-1.amazonaws.com/Prod'
const API_KEY = 'oYfue6ET7d770SPUSQ06NacbJPRz1R3N7LU2RgQO'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  // 全画像一覧から対象の image_key を特定
  const listRes = await fetch(`${API_URL}/images?limit=50`, {
    headers: { 'x-api-key': API_KEY },
    next: { revalidate: 60 },
  })
  if (!listRes.ok) {
    return new Response('Not Found', { status: 404 })
  }
  const data = await listRes.json()
  const images: Array<{ image_key?: string; image_url?: string }> = data.images ?? []
  const item = images.find(
    (img) => extractCoordinateId(img.image_key ?? img.image_url ?? '') === id,
  )
  if (!item?.image_key) {
    return new Response('Not Found', { status: 404 })
  }

  // 画像バイナリを取得
  const imgRes = await fetch(`${API_URL}/image?key=${encodeURIComponent(item.image_key)}`, {
    headers: { 'x-api-key': API_KEY },
  })
  if (!imgRes.ok) {
    return new Response('Image fetch failed', { status: 502 })
  }

  const imgJson = await imgRes.json().catch(() => null)
  if (!imgJson || typeof imgJson.image_b64 !== 'string') {
    return new Response('Image not available', { status: 502 })
  }

  const binary = Buffer.from(imgJson.image_b64, 'base64')

  return new Response(binary, {
    headers: {
      'content-type': 'image/png',
      'cache-control': 'public, max-age=86400, immutable',
    },
  })
}
