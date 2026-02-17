import type { Metadata } from 'next'
import Link from 'next/link'
import type { GeneratedImageMeta } from '../../../lib/types'
import { extractCoordinateId } from '../utils'
import DetailView from './detail-view'

const API_URL = process.env.GENERATE_IMAGE_API_URL || ''
const API_KEY = process.env.GENERATE_IMAGE_API_KEY || ''

async function fetchImageById(id: string): Promise<GeneratedImageMeta | null> {
  try {
    const res = await fetch(`${API_URL}/images?limit=50`, {
      headers: { 'x-api-key': API_KEY },
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const data = await res.json()
    const images: GeneratedImageMeta[] = data.images ?? []
    return images.find((img) => extractCoordinateId(img.image_url) === id) ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const item = await fetchImageById(id)

  if (!item) {
    return { title: 'Not Found - Coordinate Gallery' }
  }

  const itemNames = Object.values(item.items)
    .map((i) => i.name)
    .join(', ')
  const title = `${item.avatar_name} のコーディネート`
  const description = `${item.avatar_name} × ${itemNames}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: item.image_url, width: 900, height: 1600 }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [item.image_url],
    },
  }
}

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const item = await fetchImageById(id)

  if (!item) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          指定された画像が見つかりません。
          <Link
            href="/coordinator/gallery"
            className="ml-2 font-medium text-orange-500 underline"
          >
            一覧に戻る
          </Link>
        </div>
      </div>
    )
  }

  return <DetailView item={item} />
}
