/** セッション一覧用 */
export interface ChatSession {
  session_id: string
  actor_id: string
  created_at: string | number
  first_message?: string
}

/** 履歴取得用 */
export interface HistoryEntry {
  type: 'user' | 'text' | 'tool_output'
  content?: string
  data?: unknown
  tool_name?: string
  timestamp?: number
}

/** ツール実行結果 */
export interface ToolResult {
  tool_name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any
}

/** クライアント側メッセージ表示用 */
export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  toolResults?: ToolResult[]
}

/** 商品カード表示用 */
export interface Product {
  category?: string
  name: string
  subTitle?: string
  price: number | string
  priceDisplay?: string
  tags?: string[]
  imageUrl?: string
  url?: string
  authorName?: string
  likesCount?: number
}
