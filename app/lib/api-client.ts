import { ChatSession, HistoryEntry } from './types'

const DEFAULT_USER_ID = 'user_default'

/**
 * ストリーミングチャット送信
 * NDJSON形式のレスポンスを解析し、コールバックで通知する
 */
export async function sendMessageStream(
  message: string,
  sessionId?: string | null,
  userId: string = DEFAULT_USER_ID,
  callbacks?: {
    onChunk?: (accumulatedContent: string) => void
    onSessionId?: (sessionId: string) => void
    onError?: (error: string) => void
  }
): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      session_id: sessionId || null,
      user_id: userId,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`)
  }

  // セッションIDをヘッダーから取得
  const newSessionId = response.headers.get('X-Session-Id')
  if (newSessionId) {
    callbacks?.onSessionId?.(newSessionId)
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

      try {
        const parsed = JSON.parse(rawLine)

        if (parsed.type === 'text') {
          const content = typeof parsed.content === 'string' ? parsed.content : ''
          fullResponse += content
          callbacks?.onChunk?.(fullResponse)
        } else if (parsed.type === 'error') {
          const errorContent = typeof parsed.content === 'string' ? parsed.content : 'エラーが発生しました。'
          callbacks?.onError?.(errorContent)
        }
      } catch {
        // JSONとして解釈できない場合はテキストとして扱う
        fullResponse += rawLine
        callbacks?.onChunk?.(fullResponse)
      }

      newlineIndex = textBuffer.indexOf('\n')
    }
  }

  // 残ったバッファを処理
  const remaining = textBuffer.trim()
  if (remaining) {
    try {
      const parsed = JSON.parse(remaining)
      if (parsed.type === 'text') {
        fullResponse += typeof parsed.content === 'string' ? parsed.content : ''
        callbacks?.onChunk?.(fullResponse)
      } else if (parsed.type === 'error') {
        callbacks?.onError?.(typeof parsed.content === 'string' ? parsed.content : 'エラーが発生しました。')
      }
    } catch {
      fullResponse += remaining
      callbacks?.onChunk?.(fullResponse)
    }
  }

  return fullResponse
}

/**
 * セッション一覧取得
 */
export async function listSessions(userId: string = DEFAULT_USER_ID): Promise<ChatSession[]> {
  const response = await fetch(`/api/sessions?user_id=${encodeURIComponent(userId)}`)

  if (!response.ok) {
    throw new Error(`Failed to list sessions: ${response.statusText}`)
  }

  const data = await response.json()
  return data.sessions || []
}

/**
 * セッション履歴取得
 */
export async function getSessionHistory(sessionId: string): Promise<HistoryEntry[]> {
  const response = await fetch(`/api/sessions/${encodeURIComponent(sessionId)}/history`)

  if (!response.ok) {
    throw new Error(`Failed to get session history: ${response.statusText}`)
  }

  const data = await response.json()
  return Array.isArray(data) ? data : (data.history || [])
}

/**
 * セッション削除
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const response = await fetch(`/api/sessions/${encodeURIComponent(sessionId)}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Failed to delete session: ${response.statusText}`)
  }
}
