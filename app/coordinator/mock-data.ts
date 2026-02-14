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

export const categories: Category[] = [
  { label: 'Hair',   icon: '💇' },
  { label: 'Tops',   icon: '👔' },
  { label: 'Pants', icon: '👗' },
  { label: 'Shoes',  icon: '👠' },
]

export const mockResult: CoordinatorResult = {
  preference:
    'あなたの会話履歴を分析した結果、ゴシック・ダーク系のスタイルを好む傾向があります。黒やダークパープルを基調としたアイテムを多く閲覧しており、Marycia対応の衣装に強い関心を持っています。レース・フリル・クロスモチーフなどのディテールが好みのポイントです。',
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
