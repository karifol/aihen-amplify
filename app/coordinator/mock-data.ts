import { Product } from '../lib/types'

export interface CategoryPick {
  label: string
  item: Product
  reason: string
}

export interface CoordinatorResult {
  preference: string
  picks: CategoryPick[]
}

export interface Category {
  label: string
  icon: string
}

export interface Avatar {
  title: string
  url: string
  thumbnail_url: string
  ai_image_url: string
}

export const categories: Category[] = [
  { label: 'Hair',   icon: '💇' },
  { label: 'Tops',   icon: '👔' },
  { label: 'Pants',  icon: '👗' },
  { label: 'Shoes',  icon: '👠' },
]

// avatarsはJSONから動的に読み込むため、初期値は空配列
export const avatars: Avatar[] = []

export const mockPreference =
  'あなたの会話履歴を分析した結果、ゴシック・ダーク系のスタイルを好む傾向があります。黒やダークパープルを基調としたアイテムを多く閲覧しており、Marycia対応の衣装に強い関心を持っています。レース・フリル・クロスモチーフなどのディテールが好みのポイントです。'

export const mockResult: CoordinatorResult = {
  preference: mockPreference,
  picks: [
    {
      label: 'Hair',
      item: { name: 'ゴシックツインテール', price: 800, tags: ['髪型', 'Marycia対応'], authorName: 'HairLab', url: '#' },
      reason: 'ダーク系スタイルに合うツインテールで、Marycia対応済み。リボンとレースのディテールがコーデ全体のゴシック感を引き立てます。',
    },
    {
      label: 'Tops',
      item: { name: 'ゴシックフリルブラウス', price: 1200, tags: ['トップス', 'ゴシック'], authorName: 'DarkCloset', url: '#' },
      reason: 'レースとフリルが好みのポイントに合致。黒のブラウスにダークパープルのリボンが付いており、上品なゴシックスタイルを演出します。',
    },
    {
      label: 'Pants',
      item: { name: 'フリルミニスカート -黒薔薇-', price: 800, tags: ['スカート', 'ゴシック'], authorName: 'Gothic Lolita', url: '#' },
      reason: '上のブラウスと合わせやすい黒のフリルスカート。薔薇の刺繍がアクセントで、ゴシックロリータスタイルが完成します。',
    },
    {
      label: 'Shoes',
      item: { name: '厚底レースアップブーツ', price: 900, tags: ['靴', 'ゴシック'], authorName: 'ShoeBox', url: '#' },
      reason: '厚底でスタイルアップしつつ、レースアップのデザインがコーデ全体のゴシック感を足元から支えます。',
    },
  ],
}

/** URL変更時に返すモックアイテム */
export const mockReplacementItems: Record<string, CategoryPick> = {
  Hair: {
    label: 'Hair',
    item: { name: 'ふわふわショートヘア', price: 500, tags: ['髪型', '汎用'], authorName: 'HeadStyle', url: '#' },
    reason: 'ユーザーが選択したBoothアイテムに差し替えました。',
  },
  Tops: {
    label: 'Tops',
    item: { name: 'オーバーサイズパーカー', price: 1000, tags: ['トップス', 'カジュアル'], authorName: 'CasualShop', url: '#' },
    reason: 'ユーザーが選択したBoothアイテムに差し替えました。',
  },
  Pants: {
    label: 'Pants',
    item: { name: 'デニムワイドパンツ', price: 700, tags: ['パンツ', 'カジュアル'], authorName: 'JeansFactory', url: '#' },
    reason: 'ユーザーが選択したBoothアイテムに差し替えました。',
  },
  Shoes: {
    label: 'Shoes',
    item: { name: 'キャンバススニーカー', price: 600, tags: ['靴', 'カジュアル'], authorName: 'ShoeMart', url: '#' },
    reason: 'ユーザーが選択したBoothアイテムに差し替えました。',
  },
}

export interface HistoryEntry {
  id: string
  date: string
  avatarId: string
  avatarName: string
  avatarColor: string
  preference: string
  picks: CategoryPick[]
}

export const mockHistory: HistoryEntry[] = [
  {
    id: 'h1',
    date: '2026-02-14',
    avatarId: 'marycia',
    avatarName: 'Marycia',
    avatarColor: '#f9a8d4',
    preference: 'ゴシック・ダーク系のスタイルを好む傾向。黒やダークパープルを基調としたアイテムを多く閲覧。',
    picks: [
      { label: 'Hair', item: { name: 'ゴシックツインテール', price: 800, tags: ['髪型'], authorName: 'HairLab', url: '#' }, reason: 'ダーク系に合うツインテール。' },
      { label: 'Tops', item: { name: 'ゴシックフリルブラウス', price: 1200, tags: ['トップス'], authorName: 'DarkCloset', url: '#' }, reason: 'レースとフリルが好みに合致。' },
      { label: 'Pants', item: { name: 'フリルミニスカート', price: 800, tags: ['スカート'], authorName: 'Gothic Lolita', url: '#' }, reason: '黒のフリルスカート。' },
      { label: 'Shoes', item: { name: '厚底レースアップブーツ', price: 900, tags: ['靴'], authorName: 'ShoeBox', url: '#' }, reason: '厚底でスタイルアップ。' },
    ],
  },
  {
    id: 'h2',
    date: '2026-02-10',
    avatarId: 'shinra',
    avatarName: '森羅',
    avatarColor: '#93c5fd',
    preference: 'ストリート・カジュアル系。オーバーサイズのシルエットとスニーカーが好み。',
    picks: [
      { label: 'Hair', item: { name: 'マッシュショート', price: 600, tags: ['髪型'], authorName: 'HeadStyle', url: '#' }, reason: 'カジュアルに合うマッシュ。' },
      { label: 'Tops', item: { name: 'オーバーサイズパーカー', price: 1000, tags: ['トップス'], authorName: 'CasualShop', url: '#' }, reason: 'ストリート感のあるパーカー。' },
      { label: 'Pants', item: { name: 'ワイドカーゴパンツ', price: 850, tags: ['パンツ'], authorName: 'StreetWear', url: '#' }, reason: 'オーバーサイズと合うワイドシルエット。' },
      { label: 'Shoes', item: { name: 'ハイカットスニーカー', price: 750, tags: ['靴'], authorName: 'ShoeMart', url: '#' }, reason: 'ストリートコーデの定番。' },
    ],
  },
  {
    id: 'h3',
    date: '2026-02-05',
    avatarId: 'manuka',
    avatarName: 'マヌカ',
    avatarColor: '#fcd34d',
    preference: 'フェミニン・パステル系。ピンクやラベンダーを基調とした柔らかいスタイル。',
    picks: [
      { label: 'Hair', item: { name: 'ゆるふわロング', price: 700, tags: ['髪型'], authorName: 'HairLab', url: '#' }, reason: 'フェミニンなゆるふわロング。' },
      { label: 'Tops', item: { name: 'リボン付きブラウス', price: 900, tags: ['トップス'], authorName: 'PastelRoom', url: '#' }, reason: 'パステルピンクのリボンブラウス。' },
      { label: 'Pants', item: { name: 'フレアスカート', price: 650, tags: ['スカート'], authorName: 'FemShop', url: '#' }, reason: 'ラベンダーのフレアスカート。' },
      { label: 'Shoes', item: { name: 'ストラップパンプス', price: 800, tags: ['靴'], authorName: 'ShoeMart', url: '#' }, reason: '上品なストラップパンプス。' },
    ],
  },
]

export const steps = [
  { number: 1, label: 'アバター選択' },
  { number: 2, label: '好み入力' },
  { number: 3, label: 'アイテム検索' },
  { number: 4, label: '画像生成' },
]
