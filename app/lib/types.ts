/** セッション一覧用 */
export interface ChatSession {
  session_id: string
  user_id: string
  created_at: number
  updated_at: number
  title?: string
}

/** メッセージ履歴用 (バックエンドからのレスポンス) */
export interface MessageEntry {
  session_id: string
  timestamp: number
  message_id: string
  role: 'user' | 'assistant'
  content: string
  user_id: string
  tool_calls?: { tool_id: string; tool: string; result: string }[]
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

/** ユーザー利用量 */
export interface UsageInfo {
  user_id: string
  month?: string
  monthly_cost_yen?: number
  monthly_limit_yen?: number
  session_cost_yen?: number
  session_limit_yen?: number | null
  is_limited: boolean
  error?: string
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

/** アイテム検索APIレスポンス */
export interface QueryItemResponse {
  keywords: Record<string, string[]>
  candidates: Record<string, Product[]>
}

/** 生成画像メタデータ */
export interface GeneratedImageMeta {
  image_url: string
  avatar_name: string
  ai_image_url?: string
  items: Record<string, { name: string; imageUrl?: string }>
  preference_text?: string
}
