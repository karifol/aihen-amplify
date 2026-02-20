'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { GeneratedImageMeta } from '../../../lib/types'
import { coordinateImageSrc } from '../../../lib/types'

export default function DetailView({ item }: { item: GeneratedImageMeta }) {
  const [shareUrl, setShareUrl] = useState('')
  useEffect(() => {
    setShareUrl(encodeURIComponent(window.location.href))
  }, [])

  const shareText = encodeURIComponent(
    'AIhenのAIコーディネーター  #AIhen #VRChat'
  )

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(window.location.href)
  }

  const itemEntries = Object.entries(item.items)

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/coordinator/gallery"
        className="mb-6 flex items-center gap-1 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        ← 一覧に戻る
      </Link>

      <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start">
        {/* 生成画像 */}
        <div className="w-full max-w-xs shrink-0">
          <img
            src={coordinateImageSrc(item)}
            alt={`${item.avatar_name} コーディネート`}
            className="w-full rounded-xl shadow-lg"
          />
        </div>

        {/* 詳細情報 */}
        <div className="flex-1">
          <h2 className="mb-1 text-xl font-bold text-zinc-900 dark:text-zinc-50">
            {item.avatar_name}
          </h2>

          {item.preference_text && (
            <div className="mb-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
              <h4 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                好み
              </h4>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                {item.preference_text}
              </p>
            </div>
          )}

          {/* アイテム一覧 */}
          <h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            使用アイテム
          </h4>
          <div className="flex flex-col gap-3">
            {itemEntries.map(([label, info]) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900"
              >
                {info.imageUrl ? (
                  <img
                    src={info.imageUrl}
                    alt={info.name}
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-lg dark:bg-zinc-800">
                    📦
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{info.name}</p>
                </div>
              </div>
            ))}
          </div>

          {/* アクションボタン */}
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Xでシェア
            </a>
            <button
              onClick={handleCopyUrl}
              className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:cursor-pointer hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              URLをコピー
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
