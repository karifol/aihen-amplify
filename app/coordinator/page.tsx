'use client'

import { useState, useEffect, ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { GiComb } from 'react-icons/gi'
import { RiTShirt2Line } from 'react-icons/ri'
import { PiPantsDuotone } from 'react-icons/pi'
import { LiaShoePrintsSolid } from 'react-icons/lia'
import {
  steps,
  categories,
  type Avatar,
} from './mock-data'
import { queryItems, generateImage, generatePreference } from '../lib/api-client'
import { extractCoordinateId } from './gallery/utils'
import { useAuth } from '../lib/auth-context'
import type { Product } from '../lib/types'

const categoryIcons: Record<string, ReactNode> = {
  Hair:  <GiComb className="text-3xl" />,
  Tops:  <RiTShirt2Line className="text-3xl" />,
  Pants: <PiPantsDuotone className="text-3xl" />,
  Shoes: <LiaShoePrintsSolid className="text-3xl" />,
}

/* ─── ステッパーヘッダー ─── */
function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((s, i) => {
        const done = current > s.number
        const active = current === s.number
        return (
          <div key={s.number} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  done
                    ? 'bg-orange-400 text-white'
                    : active
                      ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900'
                      : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400'
                }`}
              >
                {done ? '✓' : s.number}
              </div>
              <span
                className={`text-xs whitespace-nowrap ${
                  active
                    ? 'font-bold text-zinc-900 dark:text-zinc-50'
                    : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`mx-2 h-0.5 flex-1 ${
                  done ? 'bg-orange-400' : 'bg-zinc-200 dark:bg-zinc-700'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Step 1: アバター選択 ─── */
function StepAvatar({
  selected,
  onSelect,
}: {
  selected: Avatar | null
  onSelect: (a: Avatar) => void
}) {
  const [search, setSearch] = useState('')
  const [avatarList, setAvatarList] = useState<Avatar[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/3Dキャラクター.json')
      .then((res) => res.json())
      .then((data: Avatar[]) => setAvatarList(data))
      .catch((err) => console.error('Failed to load avatars:', err))
      .finally(() => setLoading(false))
  }, [])

  const filtered = avatarList.filter((av) =>
    av.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        対象の3Dアバターを選択
      </h2>
      <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
        コーディネートを提案するアバターを選んでください
      </p>

      {selected && (
        <div className="mb-4 flex items-center gap-4 rounded-lg bg-orange-50 px-4 py-3 dark:bg-orange-950/20">
          <Image
            src={selected.thumbnail_url}
            alt={selected.title}
            width={64}
            height={64}
            className="h-16 w-16 shrink-0 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
              {selected.title}
            </span>
          </div>
        </div>
      )}

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="アバター名で検索..."
        className="mb-4 w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-orange-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500"
      />

      <div className="flex max-h-80 flex-col gap-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col gap-2 px-3 pt-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-8 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-4 text-center text-sm text-zinc-400 dark:text-zinc-500">
            該当するアバターが見つかりません
          </p>
        ) : (
          filtered.map((av) => {
            const isSelected = selected?.url === av.url
            return (
              <button
                key={av.url}
                onClick={() => onSelect(av)}
                className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors hover:cursor-pointer ${
                  isSelected
                    ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400'
                    : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                }`}
              >
                {av.title}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

/* ─── Step 2: 好み入力 ─── */
function StepPreference({
  value,
  onChange,
  userId,
}: {
  value: string
  onChange: (v: string) => void
  userId?: string
}) {
  const [generating, setGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)

  const handleAutoGenerate = async () => {
    if (!userId) return
    setGenerating(true)
    setGenerateError(null)
    try {
      const preference = await generatePreference(userId)
      onChange(preference)
    } catch (e) {
      setGenerateError(e instanceof Error ? e.message : '生成に失敗しました')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        好みを入力
      </h2>
      <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
        ファッションの好みやテーマを教えてください。AIが会話履歴から自動生成することもできます。
      </p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="例: ゴシック系、ダーク系の衣装が好き。レースやフリルが多めで..."
        rows={5}
        className="w-full resize-none rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-orange-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500"
      />

      <button
        onClick={handleAutoGenerate}
        disabled={generating || !userId}
        className="mt-3 rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:cursor-pointer hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        {generating ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-50" />
            生成中...
          </span>
        ) : (
          'AIが会話履歴から自動生成'
        )}
      </button>
      {generateError && (
        <p className="mt-2 text-xs text-red-500 dark:text-red-400">{generateError}</p>
      )}
    </div>
  )
}

/* ─── Step 3: Boothアイテム検索 ─── */
function StepItems({
  avatarName,
  preferenceText,
  onSearchComplete,
  onSelectionChange,
}: {
  avatarName: string
  preferenceText: string
  onSearchComplete: () => void
  onSelectionChange: (selected: Record<string, Product>) => void
}) {
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [candidates, setCandidates] = useState<Record<string, Product[]>>({})
  const [selected, setSelected] = useState<Record<string, Product>>({})

  const handleSearch = async () => {
    setLoading(true)
    setSearched(true)
    setError(null)
    try {
      const result = await queryItems(avatarName, preferenceText)
      setCandidates(result.candidates)
      // 各カテゴリの先頭を初期選択
      const initial: Record<string, Product> = {}
      for (const [label, items] of Object.entries(result.candidates)) {
        if (items.length > 0) {
          initial[label] = items[0]
        }
      }
      setSelected(initial)
      onSelectionChange(initial)
      onSearchComplete()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (label: string, item: Product) => {
    const next = { ...selected, [label]: item }
    setSelected(next)
    onSelectionChange(next)
  }

  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Boothアイテム検索
      </h2>
      <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
        AIがあなたの好みに合うアイテムをBoothから検索します。各カテゴリからアイテムを選んでください。
      </p>

      {!searched && (
        <button
          onClick={handleSearch}
          disabled={loading}
          className="mb-8 rounded-full bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:cursor-pointer hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          アイテムを検索
        </button>
      )}

      {loading && (
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-300 border-t-orange-400" />
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            AIがキーワードを生成してBoothを検索中...
          </span>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            これには数十秒かかることがあります
          </span>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
          {error}
          <button
            onClick={handleSearch}
            className="ml-3 font-medium underline hover:cursor-pointer"
          >
            再試行
          </button>
        </div>
      )}

      {!loading && (
        <div className="flex flex-col gap-10">
          {categories.map((cat) => {
            const items = candidates[cat.label] || []
            const selectedItem = selected[cat.label]
            if (!searched || items.length === 0) return null
            return (
              <section key={cat.label}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xl text-zinc-700 dark:text-zinc-300">
                    {categoryIcons[cat.label]}
                  </span>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {cat.label}
                  </h3>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    ({items.length}件)
                  </span>
                </div>

                {/* 横スクロール候補リスト */}
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {items.map((item, idx) => {
                    const isSelected = selectedItem?.url === item.url
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelect(cat.label, item)}
                        className={`flex w-40 shrink-0 flex-col overflow-hidden rounded-xl border-2 bg-white text-left transition-all hover:cursor-pointer dark:bg-zinc-900 ${
                          isSelected
                            ? 'border-orange-400 shadow-md'
                            : 'border-zinc-200 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500'
                        }`}
                      >
                        {item.imageUrl ? (
                          <div className="aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex aspect-square w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                            <span className="text-2xl">📦</span>
                          </div>
                        )}
                        <div className="flex flex-1 flex-col gap-1 p-2">
                          <p className="line-clamp-2 text-xs font-medium leading-tight text-zinc-900 dark:text-zinc-50">
                            {item.name}
                          </p>
                          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                            {item.priceDisplay || (typeof item.price === 'number'
                              ? item.price === 0 ? '無料' : `¥${item.price.toLocaleString()}`
                              : item.price)}
                          </p>
                          {item.authorName && (
                            <p className="truncate text-[10px] text-zinc-400 dark:text-zinc-500">
                              {item.authorName}
                            </p>
                          )}
                        </div>
                        {isSelected && (
                          <div className="bg-orange-400 px-2 py-1 text-center text-[10px] font-bold text-white">
                            選択中
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* 選択中アイテムの詳細 */}
                {selectedItem && (
                  <div className="mt-3 flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2.5 dark:border-orange-900/30 dark:bg-orange-950/20">
                    <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                      選択: {selectedItem.name}
                    </span>
                    {selectedItem.url && (
                      <a
                        href={selectedItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto shrink-0 rounded-md bg-red-500 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-red-700"
                      >
                        BOOTH
                      </a>
                    )}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ─── Step 4: 画像生成＆シェア ─── */
function StepImageGen({
  avatar,
  selectedItems,
  preferenceText,
  userId,
  onGenerated,
  onBack,
}: {
  avatar: Avatar | null
  selectedItems: Record<string, Product>
  preferenceText: string
  userId?: string
  onGenerated: () => void
  onBack: () => void
}) {
  const shareText = encodeURIComponent(
    'AIhenのAIコーディネーター  #AIhen #VRChat'
  )
  const [state, setState] = useState<'idle' | 'generating' | 'done' | 'error'>('idle')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [galleryUrl, setGalleryUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const itemEntries = Object.entries(selectedItems)

  // Split items into left 2 and right 2
  const leftItems = itemEntries.slice(0, 2)
  const rightItems = itemEntries.slice(2, 4)

  const handleGenerate = async () => {
    setState('generating')
    setError(null)
    try {
      const items: Record<string, { name: string; imageUrl?: string }> = {}
      for (const [label, product] of Object.entries(selectedItems)) {
        items[label] = {
          name: product.name,
          ...(product.imageUrl ? { imageUrl: product.imageUrl } : {}),
        }
      }
      const result = await generateImage(
        avatar?.title ?? '',
        items,
        preferenceText,
        avatar?.ai_image_url,
        userId,
      )
      setImageUrl(`/api/generate-image/image?key=${encodeURIComponent(result.image_key)}`)
      const coordinateId = extractCoordinateId(result.image_key)
      setGalleryUrl(`${window.location.origin}/coordinator/gallery/${coordinateId}`)
      setState('done')
      onGenerated()
    } catch (e) {
      setError(e instanceof Error ? e.message : '画像生成に失敗しました')
      setState('error')
    }
  }

  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        コーディネート画像を生成
      </h2>
      <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
        選んだアイテムでコーディネート画像を生成します
      </p>

      <div className="relative flex items-center justify-center gap-4">
        {/* 左側アイテム（2つ） */}
        <div className="flex flex-col items-center gap-4">
          {leftItems.map(([label, product], idx) => (
            <div
              key={label}
              className="group relative h-36 w-36 overflow-hidden rounded-xl border-2 border-zinc-200 bg-zinc-100 shadow-md sm:h-44 sm:w-44 dark:border-zinc-700 dark:bg-zinc-800"
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-zinc-400 dark:text-zinc-500">
                  {categoryIcons[label] ?? label}
                </div>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-end bg-linear-to-t from-black/70 to-transparent p-1 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="text-[10px] font-semibold text-white">{label}</p>
                <p className="line-clamp-1 text-center text-[9px] text-zinc-200">{product.name}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 中央プレースホルダー */}
        <div className="w-60 shrink-0 sm:w-72">
          {state === 'idle' && (
            <div className="flex aspect-9/16 flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
              {avatar && (
                <img
                  src={avatar.thumbnail_url}
                  alt={avatar.title}
                  className="h-24 w-24 rounded-full border-2 border-zinc-200 object-cover dark:border-zinc-600"
                />
              )}
              <button
                onClick={handleGenerate}
                className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:cursor-pointer hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                生成する
              </button>
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                {avatar ? avatar.title : '選んだアイテムでコーディネート画像を生成します'}
              </span>
            </div>
          )}

          {state === 'generating' && (
            <div className="flex aspect-9/16 flex-col items-center justify-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
              {avatar && (
                <img
                  src={avatar.thumbnail_url}
                  alt={avatar.title}
                  className="h-24 w-24 rounded-full border-2 border-zinc-200 object-cover opacity-50 dark:border-zinc-600"
                />
              )}
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-300 border-t-orange-400" />
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                AIが画像を生成中...
              </span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                これには1〜2分かかることがあります
              </span>
            </div>
          )}

          {state === 'error' && (
            <div className="flex aspect-9/16 flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/20">
              <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
              <button
                onClick={handleGenerate}
                className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:cursor-pointer hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                再試行
              </button>
            </div>
          )}

          {state === 'done' && imageUrl && (
            <img
              src={imageUrl}
              alt={`${avatar?.title ?? 'Avatar'} コーディネート`}
              className="w-full rounded-xl shadow-lg"
            />
          )}
        </div>

        {/* 右側アイテム（2つ） */}
        <div className="flex flex-col items-center gap-4">
          {rightItems.map(([label, product], idx) => (
            <div
              key={label}
              className="group relative h-36 w-36 overflow-hidden rounded-xl border-2 border-zinc-200 bg-zinc-100 shadow-md sm:h-44 sm:w-44 dark:border-zinc-700 dark:bg-zinc-800"
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-zinc-400 dark:text-zinc-500">
                  {categoryIcons[label] ?? label}
                </div>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-end bg-linear-to-t from-black/70 to-transparent p-1 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="text-[10px] font-semibold text-white">{label}</p>
                <p className="line-clamp-1 text-center text-[9px] text-zinc-200">{product.name}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* アクションボタン */}
      {state === 'done' ? (
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}${galleryUrl ? `&url=${encodeURIComponent(galleryUrl)}` : ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Xでシェア
          </a>
        </div>
      ) : state !== 'generating' ? (
        <div className="mt-6">
          <button
            onClick={onBack}
            className="text-sm font-medium text-zinc-500 transition-colors hover:cursor-pointer hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ← 戻る
          </button>
        </div>
      ) : null}
    </div>
  )
}

/* ─── メインページ ─── */
export default function CoordinatorPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null)
  const [preference, setPreference] = useState('')
  const [itemsSearched, setItemsSearched] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Record<string, Product>>({})

  const canGoNext = (): boolean => {
    switch (currentStep) {
      case 1:
        return selectedAvatar !== null
      case 2:
        return preference.trim().length > 0
      case 3:
        return itemsSearched
      default:
        return false
    }
  }

  return (
    <div className="relative mx-auto max-w-3xl px-6 py-12">
      {!authLoading && !user && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur-sm dark:bg-zinc-950/70">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              ログインが必要です
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              この機能を使用するにはログインしてください
            </p>
            <Link
              href="/login"
              className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              Login
            </Link>
          </div>
        </div>
      )}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="flex text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Personal
            <span className="mx-2 text-orange-400">AI</span>
            Coordinator
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            AIがあなたの好みを分析し、Boothのアイテムでコーディネートを提案します
          </p>
        </div>
        <Link
          href="/coordinator/gallery"
          className="shrink-0 rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          過去の結果
        </Link>
      </div>

      <>
        {/* ステッパー */}
        <Stepper current={currentStep} />

          {/* ステップコンテンツ */}
          <div className="mt-10">
            {currentStep === 1 && (
              <StepAvatar
                selected={selectedAvatar}
                onSelect={setSelectedAvatar}
              />
            )}
            {currentStep === 2 && (
              <StepPreference value={preference} onChange={setPreference} userId={user?.email ?? undefined} />
            )}
            {currentStep === 3 && (
              <StepItems
                avatarName={selectedAvatar?.title ?? ''}
                preferenceText={preference}
                onSearchComplete={() => setItemsSearched(true)}
                onSelectionChange={setSelectedItems}
              />
            )}
            {currentStep === 4 && (
              <StepImageGen
                avatar={selectedAvatar}
                selectedItems={selectedItems}
                preferenceText={preference}
                userId={user?.email ?? undefined}
                onGenerated={() => {}}
                onBack={() => setCurrentStep(3)}
              />
            )}
          </div>

          {/* ナビゲーションボタン (Step 1-3 のみ) */}
          {currentStep < 4 && (
            <div className="mt-10 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                disabled={currentStep === 1}
                className="rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:cursor-pointer hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                戻る
              </button>

              <button
                onClick={() => setCurrentStep((s) => Math.min(4, s + 1))}
                disabled={!canGoNext()}
                className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:cursor-pointer hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                次へ
              </button>
            </div>
          )}
      </>
    </div>
  )
}
