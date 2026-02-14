import { ChatSession, MessageEntry, ToolResult, UsageInfo } from './types'
import type { CoordinatorResult } from '../coordinator/mock-data'

const API_URL = '/api/chat'
const COORDINATOR_API_URL = '/api/coordinator'
const DEFAULT_USER_ID = 'user_default'

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

  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: getHeaders(),
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
 * コーディネート取得
 * ユーザーの会話履歴からAIが好みを分析し、4カテゴリのアイテムを提案する
 */
export async function getCoordinate(
  userId: string = DEFAULT_USER_ID,
): Promise<CoordinatorResult> {
  const response = await fetch(`${COORDINATOR_API_URL}/coordinate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || `Coordinator API error: ${response.statusText}`)
  }

  return response.json()
}

/**
 * 前回のコーディネート結果を取得
 */
export async function getLatestCoordinate(
  userId: string = DEFAULT_USER_ID,
): Promise<{ result: CoordinatorResult | null; generated_today: boolean }> {
  const response = await fetch(
    `${COORDINATOR_API_URL}/coordinate?user_id=${encodeURIComponent(userId)}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  if (!response.ok) {
    throw new Error(`Failed to get latest coordinate: ${response.statusText}`)
  }

  return response.json()
}
