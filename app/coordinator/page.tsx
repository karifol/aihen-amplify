'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, ReactNode } from 'react'
import { GiComb } from 'react-icons/gi'
import { categories, CoordinatorResult } from './mock-data'
import { RiTShirt2Line } from "react-icons/ri";
import { PiPantsDuotone } from "react-icons/pi";
import { LiaShoePrintsSolid } from "react-icons/lia";
import { useAuth } from '../lib/auth-context'
import { getCoordinate, getLatestCoordinate } from '../lib/api-client'

const categoryIcons: Record<string, ReactNode> = {
  'Hair':    <GiComb className='text-3xl' />,
  'Tops':    <RiTShirt2Line className='text-3xl' />,
  'Pants':   <PiPantsDuotone className='text-3xl' />,
  'Shoes':   <LiaShoePrintsSolid className='text-3xl' />,
}

export default function CoordinatorPage() {
  const [result, setResult] = useState<CoordinatorResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [generatedToday, setGeneratedToday] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, userId, isLoading: authLoading } = useAuth()
  const isLoggedIn = !!user

  // ページ表示時に前回結果を取得（ログイン済みユーザーのみ）
  useEffect(() => {
    if (authLoading || !isLoggedIn) return
    getLatestCoordinate(userId)
      .then(({ result: prev, generated_today }) => {
        if (prev) setResult(prev)
        setGeneratedToday(generated_today)
      })
      .catch(() => {})
  }, [userId, authLoading])

  const handleStart = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getCoordinate(userId)
      setResult(data)
      setGeneratedToday(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  const getPick = (label: string) =>
    result?.picks.find((p) => p.label === label)

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="flex text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Personal
        <span className="mx-2 text-orange-400">AI</span>
        Coordinator
        <span className='ml-2 text-xl text-orange-400 dark:text-zinc-400 flex items-end'>Ver. β</span>
      </h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        AIがあなたの会話履歴から好みを分析し、Boothのアイテムでフルコーディネートを提案します。
      </p>

      <button
        onClick={handleStart}
        disabled={isLoading || generatedToday || !isLoggedIn}
        className="mt-8 rounded-full bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:cursor-pointer hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {!isLoggedIn ? 'ログインしてください' : isLoading ? '分析中...' : generatedToday ? '本日は実行済みです' : 'コーディネートを開始 【1日1回まで】'}
      </button>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="mt-8 space-y-10">
        {/* 好み分析結果 */}
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            あなたの好み
          </h2>
          {result ? (
            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {result.preference}
            </p>
          ) : isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-50" />
              <span className="text-sm text-zinc-400 dark:text-zinc-500">分析中...</span>
            </div>
          ) : (
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              ボタンを押すと会話履歴から好みを分析します
            </p>
          )}
        </div>

        {/* カテゴリ別ピック (1列) */}
        <div className="flex flex-col gap-8">
          {categories.map((cat) => {
            const pick = getPick(cat.label)
            return (
              <section key={cat.label}>
                {/* 要素名 + アイコン */}
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xl text-zinc-700 dark:text-zinc-300">{categoryIcons[cat.label]}</span>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {cat.label}
                  </h2>
                </div>

                {pick ? (
                  <div className="flex flex-col sm:flex-row gap-4 rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                    {/* 画像 */}
                    {pick.item.imageUrl ? (
                      <div className="sm:w-48 sm:flex-shrink-0 overflow-hidden bg-zinc-200">
                        <img src={pick.item.imageUrl} alt={pick.item.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="sm:w-48 sm:flex-shrink-0 flex aspect-square sm:aspect-auto items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700">
                        <span className="text-3xl">📦</span>
                      </div>
                    )}

                    {/* 情報 */}
                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          {pick.item.category}
                        </span>
                        <span className="ml-auto text-sm font-bold text-zinc-900 dark:text-zinc-50">
                          {typeof pick.item.price === 'number'
                            ? pick.item.price === 0 ? '無料' : `¥${pick.item.price.toLocaleString()}`
                            : pick.item.price}
                        </span>
                      </div>

                      <h3 className="mt-2 text-sm font-semibold leading-snug text-zinc-900 dark:text-zinc-50">
                        {pick.item.name}
                      </h3>

                      {pick.item.authorName && (
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                          by {pick.item.authorName}
                        </p>
                      )}

                      {/* AIコメント */}
                      <div className="mt-3 rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
                        <span className="mr-1 text-xs text-yellow-500">✦</span>
                        <span className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                          {pick.reason}
                        </span>
                      </div>

                      {pick.item.tags && pick.item.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {pick.item.tags.map((tag, idx) => (
                            <span key={idx} className="text-[11px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded dark:bg-zinc-800 dark:text-zinc-400">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-auto flex items-center justify-end pt-3">
                        <a
                          href={pick.item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700"
                        >
                          BOOTH
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-50" />
                        <span className="text-sm text-zinc-400 dark:text-zinc-500">検索中...</span>
                      </div>
                    ) : (
                      <span className="text-sm text-zinc-400 dark:text-zinc-500">
                        未選択
                      </span>
                    )}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
