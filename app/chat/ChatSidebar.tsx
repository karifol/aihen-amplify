'use client'

import { ChatSession } from '../lib/types'

export default function ChatSidebar({
  sessions,
  activeSessionId,
  isLoading,
  onSelectSession,
  onNewChat,
}: {
  sessions: ChatSession[]
  activeSessionId: string | null
  isLoading: boolean
  onSelectSession: (id: string) => void
  onNewChat: () => void
}) {

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:cursor-pointer hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
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
        {isLoading && sessions.length === 0 ? (
          <div className="flex flex-col gap-2 px-3 pt-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-8 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800"
              />
            ))}
          </div>
        ) : (
        <ul className="flex flex-col gap-0.5">
          {sessions.map((session) => (
            <li key={session.session_id}>
              <button
                onClick={() => onSelectSession(session.session_id)}
                className={`w-full truncate rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  activeSessionId === session.session_id
                    ? 'bg-zinc-200 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'
                    : 'text-zinc-600 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:bg-zinc-800/60 hover:cursor-pointer'
                }`}
              >
                {session.title || 'New Chat'}
              </button>
            </li>
          ))}
        </ul>
        )}
      </nav>
    </aside>
  )
}
