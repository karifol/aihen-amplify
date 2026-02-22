'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { HiUpload, HiSearch, HiX, HiPhotograph } from 'react-icons/hi'
import ProductCard from '@/app/components/ProductCard'

type PageState = 'idle' | 'uploaded' | 'searching' | 'results'

interface SearchResult {
  product_id: number
  distance: number
  similarity: number
  name: string
  subTitle?: string
  price: number
  priceDisplay: string
  imageUrl?: string
  url?: string
  authorName?: string
  category?: string
}

const IS_UNDER_DEVELOPMENT = true

const FINDER_API_URL = process.env.NEXT_PUBLIC_FINDER_API_URL!
const FINDER_API_KEY = process.env.NEXT_PUBLIC_FINDER_API_KEY!

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      resolve(dataUrl.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function FinderPage() {
  const [pageState, setPageState] = useState<PageState>('idle')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setCurrentFile(file)
    setPageState('uploaded')
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleReset = () => {
    setPageState('idle')
    setPreviewUrl(null)
    setCurrentFile(null)
    setResults([])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSearch = async () => {
    if (!currentFile) return
    setPageState('searching')

    try {
      const image = await fileToBase64(currentFile)
      const res = await fetch(FINDER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': FINDER_API_KEY,
        },
        body: JSON.stringify({ image }),
      })

      if (!res.ok) throw new Error(`API error: ${res.status}`)

      const data = await res.json()
      setResults(data.results ?? [])
    } catch (err) {
      console.error(err)
      setResults([])
    }

    setPageState('results')
  }

  return (
    <main className="relative mx-auto min-h-screen max-w-5xl px-6 pt-24 pb-16">
      {IS_UNDER_DEVELOPMENT && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 backdrop-blur-sm bg-white/70 dark:bg-zinc-950/70">
          <span className="rounded-full bg-violet-600 px-5 py-1.5 text-xs font-bold tracking-widest text-white dark:bg-violet-500">
            開発中
          </span>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            このページは現在開発中です
          </p>
        </div>
      )}
      {/* ページヘッダー */}
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          KAIHEN{' '}
          <span className="bg-linear-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-fuchsia-400">
            Finder
          </span>
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          改変アバターの画像をアップロードすると、使用されているアイテムを探します
        </p>
      </div>

      {/* アップロードエリア */}
      {(pageState === 'idle' || pageState === 'uploaded') && (
        <div className="mb-8">
          {pageState === 'idle' ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed py-16 transition-colors ${
                isDragging
                  ? 'border-orange-400 bg-orange-50 dark:bg-orange-950/20'
                  : 'border-zinc-300 bg-zinc-50 hover:border-orange-300 hover:bg-orange-50/50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-orange-700 dark:hover:bg-orange-950/10'
              }`}
            >
              <div className="rounded-full bg-zinc-200 p-4 dark:bg-zinc-700">
                <HiPhotograph size={32} className="text-zinc-500 dark:text-zinc-400" />
              </div>
              <div className="text-center">
                <p className="font-medium text-zinc-700 dark:text-zinc-300">
                  画像をドラッグ＆ドロップ
                </p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  または クリックしてファイルを選択
                </p>
              </div>
              <span className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300">
                <HiUpload className="mr-2 inline" />
                画像を選択
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            /* プレビュー */
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-md dark:border-zinc-700">
                  {previewUrl && (
                    <Image
                      src={previewUrl}
                      alt="アップロード画像"
                      width={480}
                      height={480}
                      className="h-80 w-auto object-contain"
                      unoptimized
                    />
                  )}
                </div>
                <button
                  onClick={handleReset}
                  className="absolute -right-3 -top-3 rounded-full bg-zinc-800 p-1.5 text-white shadow transition-colors hover:bg-zinc-600 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-400"
                  aria-label="画像を削除"
                >
                  <HiX size={16} />
                </button>
              </div>
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 rounded-full bg-zinc-900 px-8 py-3 font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                <HiSearch size={18} />
                このアバターのアイテムを探す
              </button>
            </div>
          )}
        </div>
      )}

      {/* 検索中 */}
      {pageState === 'searching' && (
        <div className="flex flex-col items-center gap-6">
          {previewUrl && (
            <div className="relative overflow-hidden rounded-2xl border border-zinc-200 shadow-md dark:border-zinc-700">
              <Image
                src={previewUrl}
                alt="検索中"
                width={480}
                height={480}
                className="h-80 w-auto object-contain"
                unoptimized
              />
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-black/60">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-300 border-t-orange-400" />
              </div>
            </div>
          )}
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            アイテムを検索しています...
          </p>
        </div>
      )}

      {/* 検索結果 */}
      {pageState === 'results' && (
        <div>
          {/* 元画像サムネイル + リセット */}
          <div className="mb-8 flex items-center gap-4">
            {previewUrl && (
              <Image
                src={previewUrl}
                alt="検索画像"
                width={72}
                height={72}
                className="h-16 w-16 rounded-xl border border-zinc-200 object-cover dark:border-zinc-700"
                unoptimized
              />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                検索結果
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {results.length} 件のアイテムが見つかりました
              </p>
            </div>
            <button
              onClick={handleReset}
              className="rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              別の画像を試す
            </button>
          </div>

          {/* 結果グリッド */}
          {results.length === 0 ? (
            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
              類似するアイテムが見つかりませんでした
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((item) => {
                const similarity = item.similarity ?? Math.round((1 - item.distance) * 100)
                return (
                  <div key={item.product_id} className="relative h-full">
                    <div className="absolute right-2 top-2 z-50 rounded-full bg-violet-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-md">
                      {similarity}%
                    </div>
                    <ProductCard
                      category={item.category}
                      name={item.name}
                      subTitle={item.subTitle}
                      price={item.price}
                      priceDisplay={item.priceDisplay}
                      imageUrl={item.imageUrl}
                      url={item.url}
                      authorName={item.authorName}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </main>
  )
}
