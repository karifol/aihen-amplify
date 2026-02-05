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

/** クライアント側メッセージ表示用 */
export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}
