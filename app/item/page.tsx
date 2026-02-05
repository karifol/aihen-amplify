'use client'

import { useState } from 'react'

interface DailyItem {
  id: number
  title: string
  category: string
  price: number
  priceDisplay: string
  imageUrl: string
  boothUrl: string
  authorName: string
  aiDescription: string
  tags: string[]
}

// ダミーデータ（後からAPI連携に差し替え）
const dummyItems: Record<string, DailyItem[]> = {
  '2026-02-04': [
    {
      id: 1,
      title: 'ふわふわネコミミヘアバンド',
      category: '3Dモデル / アクセサリー',
      price: 500,
      priceDisplay: '¥500',
      imageUrl: '',
      boothUrl: '#',
      authorName: 'NekoShop3D',
      aiDescription:
        'VRChatアバター向けのネコミミヘアバンド。ふわふわの毛並みが特徴で、PhysBoneによる揺れ物設定済み。桜色・白・黒の3カラーバリエーション。Quest対応済みで、軽量なポリゴン数に抑えられています。',
      tags: ['VRChat', 'アクセサリー', 'Quest対応'],
    },
    {
      id: 2,
      title: 'サイバーパンク風フード付きジャケット',
      category: '3Dモデル / 衣装',
      price: 1200,
      priceDisplay: '¥1,200',
      imageUrl: '',
      boothUrl: '#',
      authorName: 'CyberWear',
      aiDescription:
        '近未来感あふれるフード付きジャケット。発光パーツにはEmissionが設定されており、暗い環境で映えるデザイン。桔梗・薄荷・舞夜の主要アバターに対応したプリセット付き。テクスチャの差し替えで自由にカスタマイズ可能です。',
      tags: ['VRChat', '衣装', '対応アバター多数'],
    },
    {
      id: 3,
      title: 'ローポリ和風カフェ ワールド素材',
      category: '3Dモデル / ワールド',
      price: 2000,
      priceDisplay: '¥2,000',
      imageUrl: '',
      boothUrl: '#',
      authorName: 'WabiSabi Studio',
      aiDescription:
        '和モダンなカフェをテーマにしたワールド向け3D素材セット。畳・障子・テーブル・照明など50以上のプレハブを同梱。ライトベイク済みのサンプルシーン付きで、初心者でもすぐにワールド制作を始められます。',
      tags: ['VRChat', 'ワールド素材', 'Unity'],
    },
    {
      id: 4,
      title: 'オリジナルアバター「シズク」',
      category: '3Dモデル / アバター',
      price: 4500,
      priceDisplay: '¥4,500',
      imageUrl: '',
      boothUrl: '#',
      authorName: 'AvatarFactory',
      aiDescription:
        '透明感のあるデザインが魅力のオリジナルアバター。フルボディトラッキング対応、表情パターン20種類以上搭載。髪色・瞳色のカラー変更シェーダー付き。VRChat向けに最適化されたポリゴン構成で、PC・Quest両対応。',
      tags: ['VRChat', 'オリジナルアバター', 'フルトラ対応'],
    },
    {
      id: 5,
      title: 'ネオン看板シェーダーパック',
      category: 'ツール / シェーダー',
      price: 300,
      priceDisplay: '¥300',
      imageUrl: '',
      boothUrl: '#',
      authorName: 'ShaderLab',
      aiDescription:
        'ワールド制作に使えるネオン看板用シェーダー。テキストや画像を差し替えるだけでオリジナルのネオンサインが作れます。点滅・グロー・色変化のアニメーションパラメータ搭載。lilToonベースで導入も簡単です。',
      tags: ['VRChat', 'シェーダー', 'ワールド向け'],
    },
    {
      id: 6,
      title: 'ゴシックメイドワンピース',
      category: '3Dモデル / 衣装',
      price: 800,
      priceDisplay: '¥800',
      imageUrl: '',
      boothUrl: '#',
      authorName: 'DarkLace',
      aiDescription:
        'クラシカルなゴシックメイド衣装。フリルやレースの細部まで作り込まれたモデリングが特徴。黒×白の定番カラーに加え、紺×白、赤×黒のバリエーション付き。対応アバター: 桔梗、舞夜、イメリス。',
      tags: ['VRChat', '衣装', 'ゴシック'],
    },
  ],
}

function getYesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

// 利用可能な日付一覧（ダミー）
const availableDates = Object.keys(dummyItems).sort().reverse()

export default function ItemPage() {
  const yesterday = getYesterday()
  const [selectedDate, setSelectedDate] = useState(
    availableDates.includes(yesterday) ? yesterday : availableDates[0]
  )

  const items = dummyItems[selectedDate] || []

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Daily Booth Picks
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          前日に発売された注目のBoothアイテムをAIが解説付きでお届けします。
        </p>

        {/* 日付セレクター */}
        <div className="mt-6 flex items-center gap-3">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            日付:
          </label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          >
            {availableDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        {/* アイテム一覧 */}
        {items.length === 0 ? (
          <p className="mt-10 text-center text-zinc-500">
            この日のデータはまだありません。
          </p>
        ) : (
          <div className="mt-8 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item.id} className="flex h-full flex-col">
                {/* AI解説 吹き出し */}
                <div className="relative mb-2 min-h-[5.5rem] rounded-xl bg-zinc-800 px-3 py-2 text-xs leading-relaxed text-zinc-200 dark:bg-zinc-700">
                  <span className="mr-1 inline-block text-yellow-400">✦</span>
                  <span className="line-clamp-4">{item.aiDescription}</span>
                  {/* 吹き出し三角 */}
                  <div className="absolute -bottom-1.5 left-5 h-3 w-3 rotate-45 bg-zinc-800 dark:bg-zinc-700" />
                </div>

                {/* 商品カード */}
                <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900">
                  {item.imageUrl ? (
                    <div className="h-36 overflow-hidden bg-zinc-200">
                      <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-36 items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700">
                      <span className="text-3xl">📦</span>
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {item.category}
                      </span>
                      <span className="ml-auto text-sm font-bold text-zinc-900 dark:text-zinc-50">
                        {item.priceDisplay}
                      </span>
                    </div>

                    <h2 className="mt-1.5 text-sm font-semibold leading-snug text-zinc-900 dark:text-zinc-50 line-clamp-2">
                      {item.title}
                    </h2>

                    <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                      by {item.authorName}
                    </p>

                    <div className="mt-auto flex items-center justify-end pt-2">
                      <a
                        href={item.boothUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md bg-zinc-600 px-2.5 py-1 text-[11px] font-medium text-white transition-colors hover:bg-blue-700"
                      >
                        Booth
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
