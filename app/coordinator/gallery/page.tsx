'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { listGeneratedImages } from '../../lib/api-client'
import { useAuth } from '../../lib/auth-context'
import type { GeneratedImageMeta } from '../../lib/types'
import { coordinateImageSrc } from '../../lib/types'
import { extractCoordinateId } from './utils'

export default function GalleryPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [images, setImages] = useState<GeneratedImageMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    listGeneratedImages(50, user?.email ?? undefined)
      .then(setImages)
      .catch((e) => setError(e instanceof Error ? e.message : 'エラーが発生しました'))
      .finally(() => setLoading(false))
  }, [authLoading, user?.email])

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Coordinate Gallery
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            過去に生成されたコーディネート画像の一覧
          </p>
        </div>
        <Link
          href="/coordinator"
          className="shrink-0 rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          新規コーデ
        </Link>
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-300 border-t-orange-400" />
          <span className="text-sm text-zinc-500 dark:text-zinc-400">読み込み中...</span>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {images.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-400 dark:text-zinc-500">
              まだ生成結果がありません
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {images.map((img) => {
                const id = extractCoordinateId(img.image_key ?? img.image_url ?? '')
                const itemNames = Object.values(img.items)
                  .map((i) => i.name)
                  .join(', ')
                return (
                  <Link
                    key={id}
                    href={`/coordinator/gallery/${id}`}
                    className="group overflow-hidden rounded-xl border border-zinc-200 bg-white text-left transition-all hover:border-zinc-400 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-500"
                  >
                    <div className="aspect-9/16 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      <img
                        src={coordinateImageSrc(img)}
                        alt={`${img.avatar_name} コーディネート`}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                        {img.avatar_name}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                        {itemNames}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
