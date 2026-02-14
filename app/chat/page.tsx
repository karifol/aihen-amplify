'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ChatSidebar from './ChatSidebar'
import ChatMessage from './ChatMessage'
import { ChatSession, MessageEntry, Message, ToolResult } from '../lib/types'
import {
  sendMessageStream,
  listSessions,
  getSessionMessages,
  deleteSession,
  getUserUsage,
} from '../lib/api-client'
import { useAuth } from '../lib/auth-context'

export default function ChatPage() {
  const { user, userId } = useAuth()
  const isLoggedIn = !!user
  const searchParams = useSearchParams()
  const router = useRouter()

  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLimited, setIsLimited] = useState(false)
  const initialMessageSent = useRef(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // マウント時にセッション一覧と利用量を読み込み
  useEffect(() => {
    if (isLoggedIn) {
      loadSessions()
    }
    checkUsageLimit()
  }, [isLoggedIn])

  // トップページからのクエリパラメータで自動送信
  useEffect(() => {
    const q = searchParams.get('q')
    if (q && !initialMessageSent.current) {
      initialMessageSent.current = true
      router.replace('/chat', { scroll: false })
      sendChatMessage(q)
    }
  }, [searchParams])

  const checkUsageLimit = async (sessionId?: string | null) => {
    try {
      const usage = await getUserUsage(userId, sessionId ?? currentSessionId)
      setIsLimited(usage.is_limited)
    } catch (error) {
      console.error('Failed to check usage limit:', error)
    }
  }

  const loadSessions = async () => {
    if (!isLoggedIn) return
    try {
      const data = await listSessions(userId)
      setSessions(data)
    } catch (error) {
      console.error('Failed to load sessions:', error)
    }
  }

  // セッション選択で履歴読み込み
  const handleSelectSession = async (sessionId: string) => {
    setCurrentSessionId(sessionId)
    try {
      const entries = await getSessionMessages(sessionId, userId)
      const converted = convertMessagesToDisplay(entries)
      setMessages(converted)
    } catch (error) {
      console.error('Failed to load session history:', error)
    }
  }

  // MessageEntry[] → Message[] 変換
  const convertMessagesToDisplay = (entries: MessageEntry[]): Message[] => {
    return entries.map((entry) => {
      const msg: Message = {
        role: entry.role,
        content: entry.content,
        timestamp: new Date(entry.timestamp),
      }
      if (entry.role === 'assistant' && entry.tool_calls?.length) {
        msg.toolResults = entry.tool_calls.map((tc) => ({
          tool_name: tc.tool,
          result: tc.result,
        }))
      }
      return msg
    })
  }

  const handleNewChat = () => {
    setCurrentSessionId(null)
    setMessages([])
  }

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId, userId)
      setSessions((prev) => prev.filter((s) => s.session_id !== sessionId))
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null)
        setMessages([])
      }
    } catch (error) {
      console.error('Failed to delete session:', error)
    }
  }

  const sendChatMessage = async (messageText: string) => {
    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      toolResults: [],
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setIsLoading(true)

    try {
      let hasFirstChunk = false
      let collectedToolResults: ToolResult[] = []
      let activeSessionId = currentSessionId

      await sendMessageStream(messageText, currentSessionId, userId, {
        onChunk: (accumulated) => {
          if (!hasFirstChunk) {
            hasFirstChunk = true
            setIsLoading(false)
          }
          setMessages((prev) => {
            const updated = [...prev]
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: accumulated,
              toolResults: collectedToolResults,
            }
            return updated
          })
        },
        onSessionId: (sessionId) => {
          activeSessionId = sessionId
          setCurrentSessionId(sessionId)
        },
        onToolResult: (toolResult) => {
          collectedToolResults = [...collectedToolResults, toolResult]
          setMessages((prev) => {
            const updated = [...prev]
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              toolResults: collectedToolResults,
            }
            return updated
          })
        },
        onError: (errorMsg) => {
          setIsLoading(false)
          if (errorMsg === 'monthly_limit_reached') {
            setIsLimited(true)
            setMessages((prev) => {
              const updated = [...prev]
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: '今月の利用上限に達しました。来月までお待ちください。',
              }
              return updated
            })
          } else if (errorMsg === 'token_limit_reached') {
            setIsLimited(true)
            setMessages((prev) => {
              const updated = [...prev]
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: '利用上限に達しました。ログインしてください。',
              }
              return updated
            })
          } else {
            setMessages((prev) => {
              const updated = [...prev]
              const last = updated[updated.length - 1]
              updated[updated.length - 1] = {
                ...last,
                content: last.content ? `${last.content}\n\n${errorMsg}` : errorMsg,
              }
              return updated
            })
          }
        },
        onInfo: (infoContent) => {
          if (infoContent === 'token_limit_reached') {
            setIsLimited(true)
          }
        },
      })

      // レスポンス完了後に利用制限を再チェック（activeSessionIdで最新のセッションIDを渡す）
      await checkUsageLimit(activeSessionId)

      // セッション一覧を再取得（ログイン時のみ）
      if (isLoggedIn) {
        await loadSessions()
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: 'エラーが発生しました。もう一度お試しください。',
        }
        return updated
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || isLimited) return
    const text = input.trim()
    setInput('')
    sendChatMessage(text)
  }

  const handleSuggestClick = (text: string) => {
    if (isLoading || isLimited) return
    sendChatMessage(text)
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {isLoggedIn && (
        <ChatSidebar
          sessions={sessions}
          activeSessionId={currentSessionId}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col bg-white dark:bg-black">
        {currentSessionId || messages.length > 0 ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="mx-auto flex max-w-2xl flex-col gap-6">
                {messages.map((msg, i) => (
                  <ChatMessage key={i} message={msg} />
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex space-x-1.5 px-4 py-3">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: '0.2s' }} />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="bg-white px-6 py-10 dark:border-zinc-800 dark:bg-black">
              {isLimited && (
                <div className="mx-auto mb-3 max-w-2xl rounded-lg bg-amber-50 px-4 py-3 text-center text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                  {isLoggedIn ? '今月の利用上限に達しました。来月までお待ちください。' : '利用上限に達しました。ログインしてください。'}
                </div>
              )}
              <form
                onSubmit={handleSend}
                className="mx-auto flex max-w-2xl h-13 items-center rounded-full border border-zinc-300 focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500 dark:focus-within:border-zinc-400 dark:focus-within:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isLimited ? '利用上限に達しています' : 'メッセージを入力...'}
                  className="flex-1 bg-transparent px-4 py-2.5 text-zinc-900 outline-none dark:text-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading || isLimited}
                />
                <button
                  type="submit"
                  disabled={isLoading || isLimited || !input.trim()}
                  className="mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white transition-colors hover:cursor-pointer hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                  </svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-6">
            <div className="flex w-full max-w-2xl flex-col items-center">
              {/* Logo */}
              <h1 className="mb-10 text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                AIhen <span className="text-blue-400 dark:text-zinc-600">AI</span>
              </h1>

              {isLimited && (
                <div className="mb-4 w-full rounded-lg bg-amber-50 px-4 py-3 text-center text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                  {isLoggedIn ? '今月の利用上限に達しました。来月までお待ちください。' : '利用上限に達しました。ログインしてください。'}
                </div>
              )}

              {/* Input */}
              <form
                onSubmit={handleSend}
                className="flex h-15 w-full items-center rounded-full border border-zinc-300  focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500 dark:focus-within:border-zinc-400 dark:focus-within:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isLimited ? '利用上限に達しています' : 'メッセージを入力...'}
                  className="flex-1 bg-transparent px-4 py-2.5 text-zinc-900 outline-none dark:text-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLimited}
                />
                <button
                  type="submit"
                  disabled={isLimited || !input.trim()}
                  className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white transition-colors hover:cursor-pointer hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                  </svg>
                </button>
              </form>

              {/* Suggestions */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {[
                  'こんにちは。君は何ができるの？',
                  'Marycia対応の衣装を5つ教えて',
                  '1000円台の制服を5つ教えて',
                  '今日のおすすめアイテムは？',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestClick(suggestion)}
                    className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 transition-colors hover:cursor-pointer hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
