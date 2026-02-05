'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Message, Product } from '../lib/types'
import SwipeableCardContainer from './SwipeableCardContainer'

function extractBoothItems(message: Message): Product[] {
  if (message.role !== 'assistant' || !message.toolResults) return []

  const boothToolResult = message.toolResults.find(
    (tr) => tr.tool_name === 'display_booth_items' || tr.tool_name === 'display_single_booth_item'
  )
  if (!boothToolResult?.result) return []

  const result = boothToolResult.result
  const items: Product[] = []

  if (result._display_type === 'booth_items' && result.items) {
    for (const item of result.items) {
      items.push({
        name: item.title || '',
        subTitle: item.sub_title || '',
        price: item.price || 0,
        priceDisplay: item.price_display,
        url: item.booth_url || '',
        imageUrl: item.thumbnail_url || '',
        category: item.category || '',
        authorName: item.author_name || '',
        likesCount: item.likes_count || 0,
      })
    }
  } else if (result._display_type === 'booth_item_single' && result.item) {
    const item = result.item
    items.push({
      name: item.title || '',
      subTitle: item.sub_title || '',
      price: item.price || 0,
      priceDisplay: item.price_display,
      url: item.booth_url || '',
      imageUrl: item.thumbnail_url || '',
      category: item.category || '',
      authorName: item.author_name || '',
      likesCount: item.likes_count || 0,
    })
  }

  return items
}

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }: { children?: React.ReactNode }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
  ol: ({ children }: { children?: React.ReactNode }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
  li: ({ children }: { children?: React.ReactNode }) => <li className="ml-2">{children}</li>,
  h1: ({ children }: { children?: React.ReactNode }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
  h2: ({ children }: { children?: React.ReactNode }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
  h3: ({ children }: { children?: React.ReactNode }) => <h3 className="text-base font-bold mb-2">{children}</h3>,
  code: ({ children, className }: { children?: React.ReactNode; className?: string }) => {
    const isInline = !className
    return isInline ? (
      <code className="bg-zinc-100 text-red-600 px-1 py-0.5 rounded text-sm dark:bg-zinc-800 dark:text-red-400">{children}</code>
    ) : (
      <code className="block bg-zinc-100 p-3 rounded-lg text-sm overflow-x-auto dark:bg-zinc-800">{children}</code>
    )
  },
  pre: ({ children }: { children?: React.ReactNode }) => <pre className="bg-zinc-100 p-3 rounded-lg mb-2 overflow-x-auto dark:bg-zinc-800">{children}</pre>,
  a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
    <a href={href} className="text-blue-600 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-bold">{children}</strong>,
  em: ({ children }: { children?: React.ReactNode }) => <em className="italic">{children}</em>,
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border-collapse border border-zinc-300 dark:border-zinc-700">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => <thead className="bg-zinc-100 dark:bg-zinc-800">{children}</thead>,
  tbody: ({ children }: { children?: React.ReactNode }) => <tbody>{children}</tbody>,
  tr: ({ children }: { children?: React.ReactNode }) => <tr className="border-b border-zinc-300 dark:border-zinc-700">{children}</tr>,
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="border border-zinc-300 px-4 py-2 text-left font-semibold dark:border-zinc-700">{children}</th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="border border-zinc-300 px-4 py-2 dark:border-zinc-700">{children}</td>
  ),
}

export default function ChatMessage({ message }: { message: Message }) {
  const boothItems = extractBoothItems(message)

  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-zinc-200 text-zinc-900 dark:bg-zinc-100 dark:text-zinc-900">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-full px-4 py-3 text-sm leading-relaxed text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {message.content}
          </ReactMarkdown>
        </div>

        {boothItems.length > 0 && (
          <div className="mt-4">
            <div className="text-xs font-semibold text-gray-600 mb-2 dark:text-gray-400">商品一覧:</div>
            <SwipeableCardContainer items={boothItems} />
          </div>
        )}
      </div>
    </div>
  )
}
