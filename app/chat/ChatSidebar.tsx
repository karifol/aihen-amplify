'use client'

import { useState } from 'react'
import { ChatSession } from '../lib/types'

export default function ChatSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
}: {
  sessions: ChatSession[]
  activeSessionId: string | null
  onSelectSession: (id: string) => void
  onNewChat: () => void
  onDeleteSession: (id: string) => void
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          新しいチャット
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-3">
        <ul className="flex flex-col gap-0.5">
          {sessions.map((session) => (
            <li
              key={session.session_id}
              className="relative"
              onMouseEnter={() => setHoveredId(session.session_id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <button
                onClick={() => onSelectSession(session.session_id)}
                className={`w-full truncate rounded-lg px-3 py-2 pr-8 text-left text-sm transition-colors ${
                  activeSessionId === session.session_id
                    ? 'bg-zinc-200 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'
                    : 'text-zinc-600 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:bg-zinc-800/60'
                }`}
              >
                {session.first_message || 'New Chat'}
              </button>
              {hoveredId === session.session_id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteSession(session.session_id)
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-400 hover:bg-zinc-300 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                  title="削除"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
