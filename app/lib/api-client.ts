import { ChatSession, MessageEntry, ToolResult, UsageInfo, QueryItemResponse, GeneratedImageMeta } from './types'
const API_URL = '/api/chat'
const QUERY_ITEM_API_URL = '/api/query-item'
const GENERATE_IMAGE_API_URL = '/api/generate-image'
const GENERATE_PREFERENCE_API_URL = '/api/generate-preference'
const DEFAULT_USER_ID = 'user_default'

// ストリーミング用: 直接API Gatewayを叩く（Amplifyがバッファリングするため）
const STREAMING_API_URL = process.env.NEXT_PUBLIC_STREAMING_API_URL || ''
const STREAMING_API_KEY = process.env.NEXT_PUBLIC_STREAMING_API_KEY || ''

const getHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
})

/**
 * ストリーミングチャット送信
 * SSE形式のレスポンスを解析し、コールバックで通知する
 */
export async function sendMessageStream(
  message: string,
  sessionId?: string | null,
  userId: string = DEFAULT_USER_ID,
  callbacks?: {
    onChunk?: (accumulatedContent: string) => void
    onSessionId?: (sessionId: string) => void
    onToolResult?: (toolResult: ToolResult) => void
    onError?: (error: string) => void
    onInfo?: (content: string) => void
  }
): Promise<string> {
  // セッションIDが未指定の場合はフロントで生成して渡す
  const resolvedSessionId = sessionId || crypto.randomUUID()

  const response = await fetch(`${STREAMING_API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': STREAMING_API_KEY,
    },
    body: JSON.stringify({
      message,
      session_id: resolvedSessionId,
      user_id: userId,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`)
  }

  // 新規セッションの場合、セッションIDをコールバックで通知
  if (!sessionId) {
    callbacks?.onSessionId?.(resolvedSessionId)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('No response body')
  }

  const decoder = new TextDecoder()
  let textBuffer = ''
  let fullResponse = ''


  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    textBuffer += chunk

    let newlineIndex = textBuffer.indexOf('\n')
    while (newlineIndex !== -1) {
      const rawLine = textBuffer.slice(0, newlineIndex).trim()
      textBuffer = textBuffer.slice(newlineIndex + 1)

      if (rawLine.length === 0) {
        newlineIndex = textBuffer.indexOf('\n')
        continue
      }

      // SSE形式: "data: {...}" からJSONを抽出
      const jsonStr = rawLine.startsWith('data: ') ? rawLine.slice(6) : rawLine

      try {
        const parsed = JSON.parse(jsonStr)

        if (parsed.type === 'content') {
          const text = typeof parsed.text === 'string' ? parsed.text : ''
          fullResponse += text
          callbacks?.onChunk?.(fullResponse)
        } else if (parsed.type === 'tool_result') {
          let toolResultValue = parsed.result
          if (typeof toolResultValue === 'string') {
            try { toolResultValue = JSON.parse(toolResultValue) } catch { /* keep as string */ }
          }
          callbacks?.onToolResult?.({
            tool_name: parsed.tool || 'unknown',
            result: toolResultValue,
          })
        } else if (parsed.type === 'error') {
          const errorContent = typeof parsed.error === 'string' ? parsed.error : 'エラーが発生しました。'
          callbacks?.onError?.(errorContent)
        } else if (parsed.type === 'info') {
          const infoContent = typeof parsed.content === 'string' ? parsed.content : ''
          callbacks?.onInfo?.(infoContent)
        }
        // "tool_call" と "done" は特に処理不要
      } catch {
        // JSONとして解釈できない場合は無視
      }

      newlineIndex = textBuffer.indexOf('\n')
    }
  }

  // 残ったバッファを処理
  const remaining = textBuffer.trim()
  if (remaining) {
    const jsonStr = remaining.startsWith('data: ') ? remaining.slice(6) : remaining
    try {
      const parsed = JSON.parse(jsonStr)
      if (parsed.type === 'content') {
        fullResponse += typeof parsed.text === 'string' ? parsed.text : ''
        callbacks?.onChunk?.(fullResponse)
      } else if (parsed.type === 'tool_result') {
        let toolResultValue = parsed.result
        if (typeof toolResultValue === 'string') {
          try { toolResultValue = JSON.parse(toolResultValue) } catch { /* keep as string */ }
        }
        callbacks?.onToolResult?.({
          tool_name: parsed.tool || 'unknown',
          result: toolResultValue,
        })
      } else if (parsed.type === 'error') {
        callbacks?.onError?.(typeof parsed.error === 'string' ? parsed.error : 'エラーが発生しました。')
      } else if (parsed.type === 'info') {
        callbacks?.onInfo?.(typeof parsed.content === 'string' ? parsed.content : '')
      }
    } catch {
      // 無視
    }
  }

  return fullResponse
}

/**
 * セッション一覧取得
 */
export async function listSessions(userId: string = DEFAULT_USER_ID): Promise<ChatSession[]> {
  const response = await fetch(
    `${API_URL}/sessions?user_id=${encodeURIComponent(userId)}`,
    { headers: getHeaders() }
  )

  if (!response.ok) {
    throw new Error(`Failed to list sessions: ${response.statusText}`)
  }

  const data = await response.json()
  return data.sessions || []
}

/**
 * セッションのメッセージ履歴取得
 */
export async function getSessionMessages(
  sessionId: string,
  userId: string = DEFAULT_USER_ID,
): Promise<MessageEntry[]> {
  const response = await fetch(
    `${API_URL}/sessions/${encodeURIComponent(sessionId)}/messages?user_id=${encodeURIComponent(userId)}`,
    { headers: getHeaders() }
  )

  if (!response.ok) {
    throw new Error(`Failed to get session messages: ${response.statusText}`)
  }

  const data = await response.json()
  return data.messages || []
}

/**
 * セッション削除
 */
export async function deleteSession(
  sessionId: string,
  userId: string = DEFAULT_USER_ID,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/sessions/${encodeURIComponent(sessionId)}?user_id=${encodeURIComponent(userId)}`,
    { method: 'DELETE', headers: getHeaders() }
  )

  if (!response.ok) {
    throw new Error(`Failed to delete session: ${response.statusText}`)
  }
}

/**
 * ユーザーの利用量と制限状態を取得（月間 + セッション内）
 */
export async function getUserUsage(userId: string = DEFAULT_USER_ID, sessionId?: string | null): Promise<UsageInfo> {
  let url = `${API_URL}/users/${encodeURIComponent(userId)}/usage`
  if (sessionId) {
    url += `?session_id=${encodeURIComponent(sessionId)}`
  }
  const response = await fetch(url, { headers: getHeaders() })

  if (!response.ok) {
    throw new Error(`Failed to get usage: ${response.statusText}`)
  }

  return response.json()
}

/**
 * アイテム検索
 * アバター名と好みテキストからカテゴリ別の候補アイテムを取得する
 */
export async function queryItems(
  avatarName: string,
  preferenceText: string,
  avatarId?: string,
): Promise<QueryItemResponse> {
  const response = await fetch(`${QUERY_ITEM_API_URL}/query_item`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      avatar_name: avatarName,
      avatar_id: avatarId,
      preference_text: preferenceText,
    }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || `Query item API error: ${response.statusText}`)
  }

  return response.json()
}

/**
 * 画像生成
 * 選択したアイテム情報からコーディネート画像を生成する
 */
export async function generateImage(
  avatarName: string,
  items: Record<string, { name: string; imageUrl?: string }>,
  preferenceText?: string,
  aiImageUrl?: string,
  userId?: string,
): Promise<{ image_key: string }> {
  const response = await fetch(`${GENERATE_IMAGE_API_URL}/generate_image`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      avatar_name: avatarName,
      ai_image_url: aiImageUrl,
      items,
      preference_text: preferenceText,
      user_id: userId,
    }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || `Generate image API error: ${response.statusText}`)
  }

  return response.json()
}

/**
 * 会話履歴からユーザーの好みテキストを生成
 */
export async function generatePreference(userId: string): Promise<string> {
  const response = await fetch(`${GENERATE_PREFERENCE_API_URL}/generate_preference`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ user_id: userId }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || `Generate preference API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.preference as string
}

/**
 * 生成済み画像メタデータ一覧を取得
 */
export async function listGeneratedImages(limit = 20, userId?: string): Promise<GeneratedImageMeta[]> {
  const params = new URLSearchParams({ limit: String(limit) })
  if (userId) params.set('user_id', userId)
  const response = await fetch(`${GENERATE_IMAGE_API_URL}/images?${params}`, {
    headers: getHeaders(),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || `List images API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.images
}
