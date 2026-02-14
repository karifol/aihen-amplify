'use client'

import { useState, useEffect, useCallback } from 'react'

const API_URL = 'https://poqzffs5v8.execute-api.ap-northeast-1.amazonaws.com/prod'
const API_KEY = 'EGy2fdcoi34GJXLuO3HZp4JFBPm1X8fH9iCElNVq'

interface ApiItem {
  link: string
  title: string
  image_url: string
  shop: string
  price: number
  category: string
  comment: string
}

function getYesterday(): string {
  const now = new Date()
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  jst.setUTCDate(jst.getUTCDate() - 1)
  return jst.toISOString().split('T')[0]
}

export default function ItemPage() {
  const [selectedDate, setSelectedDate] = useState(getYesterday())
  const [items, setItems] = useState<ApiItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25

  const fetchItems = useCallback(async (date: string) => {
    setLoading(true)
    setError(null)
    setCurrentPage(1) // 日付変更時にページをリセット
    try {
      const res = await fetch(`${API_URL}/items?date=${date}`, {
        headers: { 'x-api-key': API_KEY },
      })
      if (res.status === 404) {
        setItems([])
        setError('NO DATA')
        return
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setItems(data.items || [])
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '取得に失敗しました'
      setError(msg)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems(selectedDate)
  }, [selectedDate, fetchItems])

  // ページネーション計算
  const totalPages = Math.ceil(items.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = items.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="flex text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Daily
          <div className="text-red-500 mx-2">Booth</div>
          Picks 
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          前日に発売された注目のBoothアイテムをAIが解説付きでお届けします。
        </p>

        {/* 日付セレクター */}
        <div className="mt-6 flex items-center gap-3">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            日付:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </div>

        {/* ローディング */}
        {loading && (
          <div className="mt-10 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-800 dark:border-zinc-600 dark:border-t-zinc-200" />
          </div>
        )}

        {/* エラー */}
        {!loading && error && (
          <p className="mt-10 text-center text-red-500">{error}</p>
        )}

        {/* アイテム一覧 */}
        {!loading && !error && items.length === 0 && (
          <p className="mt-10 text-center text-zinc-500">
            この日のデータはまだありません。
          </p>
        )}

        {!loading && !error && items.length > 0 && (
          <>
            <div className="mt-8 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {currentItems.map((item, idx) => (
              <article key={idx} className="flex h-full flex-col">
                {/* AI解説 吹き出し */}
                <div className="group/comment relative mb-2 h-24 overflow-hidden rounded-xl bg-zinc-800 px-3 py-2 text-xs leading-relaxed text-zinc-200 hover:h-auto hover:overflow-visible dark:bg-zinc-700 z-10 hover:z-20">
                  <span className="mr-1 inline-block text-yellow-400">✦ AI コメント</span>
                  <span className="line-clamp-3 group-hover/comment:line-clamp-none">{item.comment}</span>
                  {/* 吹き出し三角 */}
                  <div className="absolute -bottom-1.5 left-5 h-3 w-3 rotate-45 bg-zinc-800 dark:bg-zinc-700" />
                </div>

                {/* 商品カード */}
                <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900">
                  {item.image_url ? (
                    <div className="aspect-square overflow-hidden bg-zinc-200">
                      <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700">
                      <span className="text-3xl">📦</span>
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {item.category}
                      </span>
                      <span className="ml-auto text-sm font-bold text-zinc-900 dark:text-zinc-50">
                        {item.price === 0 ? '無料' : `¥${item.price.toLocaleString()}`}
                      </span>
                    </div>

                    <h2 className="mt-1.5 text-sm font-semibold leading-snug text-zinc-900 dark:text-zinc-50 line-clamp-2">
                      {item.title}
                    </h2>

                    <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                      by {item.shop}
                    </p>

                    <div className="mt-auto flex items-center justify-end pt-2">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md bg-red-500 px-2.5 py-1 text-[11px] font-medium text-white transition-colors hover:bg-red-700"
                      >
                        BOOTH
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:disabled:hover:bg-zinc-900"
              >
                前へ
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-red-500 text-white'
                        : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:disabled:hover:bg-zinc-900"
              >
                次へ
              </button>
            </div>
          )}
          </>
        )}
      </div>
    </div>
  )
}
