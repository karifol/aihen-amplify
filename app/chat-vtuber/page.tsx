'use client'

export const dynamic = 'force-dynamic'

import { useState, useRef, useEffect } from 'react'
import ChatMessage from '../chat/ChatMessage'
import { Message, ToolResult } from '../lib/types'
import { sendMessageStream, getUserUsage } from '../lib/api-client'
import { useAuth } from '../lib/auth-context'

export default function ChatVtuberPage() {
  const { userId } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLimited, setIsLimited] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    getUserUsage(userId, null).then((usage) => setIsLimited(usage.is_limited)).catch(() => {})
  }, [userId])

  const sendChatMessage = async (messageText: string) => {
    const userMessage: Message = { role: 'user', content: messageText, timestamp: new Date() }
    const assistantMessage: Message = { role: 'assistant', content: '', timestamp: new Date(), toolResults: [] }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setIsLoading(true)

    try {
      let hasFirstChunk = false
      let collectedToolResults: ToolResult[] = []
      let activeSessionId: string | null = null

      await sendMessageStream(messageText, null, userId, {
        onChunk: (accumulated) => {
          if (!hasFirstChunk) { hasFirstChunk = true; setIsLoading(false) }
          setMessages((prev) => {
            const updated = [...prev]
            updated[updated.length - 1] = { ...updated[updated.length - 1], content: accumulated, toolResults: collectedToolResults }
            return updated
          })
        },
        onSessionId: (sessionId) => { activeSessionId = sessionId },
        onToolResult: (toolResult) => {
          collectedToolResults = [...collectedToolResults, toolResult]
          setMessages((prev) => {
            const updated = [...prev]
            updated[updated.length - 1] = { ...updated[updated.length - 1], toolResults: collectedToolResults }
            return updated
          })
        },
        onError: (errorMsg) => {
          setIsLoading(false)
          if (errorMsg === 'monthly_limit_reached' || errorMsg === 'token_limit_reached') {
            setIsLimited(true)
          }
          setMessages((prev) => {
            const updated = [...prev]
            const last = updated[updated.length - 1]
            const errText = errorMsg === 'monthly_limit_reached'
              ? '今月の利用上限に達しました。来月までお待ちください。'
              : errorMsg === 'token_limit_reached'
              ? '利用上限に達しました。ログインしてください。'
              : errorMsg
            updated[updated.length - 1] = { ...last, content: last.content ? `${last.content}\n\n${errText}` : errText }
            return updated
          })
        },
        onInfo: (infoContent) => {
          if (infoContent === 'token_limit_reached') setIsLimited(true)
        },
      })

      getUserUsage(userId, activeSessionId).then((usage) => setIsLimited(usage.is_limited)).catch(() => {})
    } catch {
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = { ...updated[updated.length - 1], content: 'エラーが発生しました。もう一度お試しください。' }
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

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Avatar Panel */}
      <div className="hidden md:flex w-72 shrink-0 flex-col items-center justify-end bg-gradient-to-b from-purple-50 to-pink-50 pb-8 dark:from-purple-950/30 dark:to-pink-950/30">
        {/* Placeholder avatar */}
        <div className="mb-4 flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800">
          <svg className="h-24 w-24 text-purple-400 dark:text-purple-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-purple-600 dark:text-purple-300">AIhen VTuber</p>
        <p className="mt-1 text-xs text-purple-400 dark:text-purple-500">ファッションアシスタント</p>
      </div>

      {/* Chat Panel */}
      <div className="flex flex-1 flex-col bg-white dark:bg-black">
        {messages.length > 0 ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="mx-auto flex max-w-2xl flex-col gap-6">
                {messages.map((msg, i) => (
                  <ChatMessage key={i} message={msg} />
                ))}

                {isLoading && (
                  <>
                    <style>{`
                      @keyframes pw1 { 0%,100%{width:80%} 50%{width:50%} }
                      @keyframes pw2 { 0%,100%{width:60%} 50%{width:85%} }
                      @keyframes pw3 { 0%,100%{width:40%} 50%{width:65%} }
                    `}</style>
                    <div className="flex flex-col gap-2 px-4">
                      <div className="h-4 rounded-lg bg-zinc-200 dark:bg-zinc-800" style={{ animation: 'pw1 1.8s ease-in-out infinite' }} />
                      <div className="h-4 rounded-lg bg-zinc-200 dark:bg-zinc-800" style={{ animation: 'pw2 1.8s ease-in-out infinite' }} />
                      <div className="h-4 rounded-lg bg-zinc-200 dark:bg-zinc-800" style={{ animation: 'pw3 1.8s ease-in-out infinite' }} />
                    </div>
                  </>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="bg-white px-6 py-10 dark:border-zinc-800 dark:bg-black">
              {isLimited && (
                <div className="mx-auto mb-3 max-w-2xl rounded-lg bg-amber-50 px-4 py-3 text-center text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                  利用上限に達しました。
                </div>
              )}
              <form
                onSubmit={handleSend}
                className="mx-auto flex max-w-2xl h-13 items-center rounded-full border border-zinc-300 focus-within:border-purple-400 focus-within:ring-1 focus-within:ring-purple-400 dark:border-zinc-700 dark:bg-zinc-900"
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
                  className="mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500 text-white transition-colors hover:cursor-pointer hover:bg-purple-600 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                  </svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          /* Initial screen */
          <div className="flex flex-1 flex-col items-center justify-center px-6">
            <div className="flex w-full max-w-2xl flex-col items-center">
              <h1 className="mb-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                AIhen <span className="text-purple-400">VTuber</span>
              </h1>
              <p className="mb-10 text-sm text-zinc-500 dark:text-zinc-400">ファッションアシスタントとチャットしよう</p>

              {isLimited && (
                <div className="mb-4 w-full rounded-lg bg-amber-50 px-4 py-3 text-center text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                  利用上限に達しました。
                </div>
              )}

              <form
                onSubmit={handleSend}
                className="flex h-15 w-full items-center rounded-full border border-zinc-300 focus-within:border-purple-400 focus-within:ring-1 focus-within:ring-purple-400 dark:border-zinc-700 dark:bg-zinc-900"
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
                  className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500 text-white transition-colors hover:cursor-pointer hover:bg-purple-600 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                  </svg>
                </button>
              </form>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {[
                  'こんにちは！何ができるの？',
                  'Marycia対応の衣装を5つ教えて',
                  '1000円台の制服を5つ教えて',
                  '今日のおすすめアイテムは？',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => { if (!isLoading && !isLimited) sendChatMessage(suggestion) }}
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
