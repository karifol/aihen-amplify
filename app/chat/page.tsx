"use client";

import { useState } from "react";

type Chat = {
  id: string;
  title: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

const dummyChats: Chat[] = [
  { id: "1", title: "Next.jsの使い方について" },
  { id: "2", title: "TypeScriptの型について" },
  { id: "3", title: "TailwindCSSのレイアウト" },
];

const dummyMessages: Record<string, Message[]> = {
  "1": [
    { role: "user", content: "Next.jsのApp Routerについて教えてください。" },
    {
      role: "assistant",
      content:
        "App Routerは Next.js 13以降で導入されたルーティングシステムです。appディレクトリ内にフォルダを作ることでルートを定義し、layout.tsxやpage.tsxなどの規約ファイルを使ってUIを構成します。",
    },
  ],
  "2": [
    { role: "user", content: "ジェネリクスの使い方を教えて。" },
    {
      role: "assistant",
      content:
        "ジェネリクスは型をパラメータとして渡す仕組みです。例えば function identity<T>(arg: T): T { return arg; } のように定義すると、呼び出し時に型が推論されます。",
    },
  ],
  "3": [
    { role: "user", content: "Flexboxでの中央揃えの方法は？" },
    {
      role: "assistant",
      content:
        "items-center と justify-center を flex コンテナに指定すると、水平・垂直方向の中央揃えができます。例: <div className=\"flex items-center justify-center\">",
    },
  ],
};

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>(dummyChats);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(dummyMessages);
  const [input, setInput] = useState("");

  const activeMessages = activeChatId ? (messages[activeChatId] ?? []) : [];

  const handleNewChat = () => {
    const id = String(Date.now());
    const newChat: Chat = { id, title: "新しいチャット" };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(id);
  };

  const startChat = (text: string) => {
    const id = String(Date.now());
    const newChat: Chat = { id, title: text.slice(0, 20) };
    const userMessage: Message = { role: "user", content: text };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(id);
    setMessages((prev) => ({ ...prev, [id]: [userMessage] }));
    setInput("");

    // TODO: AI応答を実装
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: "これはダミーの応答です。AI連携後に実際の回答が表示されます。",
      };
      setMessages((prev) => ({
        ...prev,
        [id]: [...(prev[id] ?? []), assistantMessage],
      }));
    }, 500);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!activeChatId) {
      startChat(input.trim());
      return;
    }

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] ?? []), userMessage],
    }));

    // 最初のメッセージならチャットタイトルを更新
    if (!messages[activeChatId]?.length) {
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? { ...c, title: input.trim().slice(0, 20) }
            : c
        )
      );
    }

    setInput("");

    // TODO: AI応答を実装
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: "これはダミーの応答です。AI連携後に実際の回答が表示されます。",
      };
      setMessages((prev) => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] ?? []), assistantMessage],
      }));
    }, 500);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="p-3">
          <button
            onClick={handleNewChat}
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
            {chats.map((chat) => (
              <li key={chat.id}>
                <button
                  onClick={() => setActiveChatId(chat.id)}
                  className={`w-full truncate rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    activeChatId === chat.id
                      ? "bg-zinc-200 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                      : "text-zinc-600 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  {chat.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col bg-white dark:bg-black">
        {activeChatId ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="mx-auto flex max-w-2xl flex-col gap-6">
                {activeMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                          : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-black">
              <form
                onSubmit={handleSend}
                className="mx-auto flex max-w-2xl items-center gap-3"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="メッセージを入力..."
                  className="flex-1 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
                >
                  送信
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-6">
            <div className="flex w-full max-w-2xl flex-col items-center">
              {/* Logo */}
              <h1 className="mb-10 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                AIhen <span className="text-zinc-400 dark:text-zinc-600">AI</span>
              </h1>

              {/* Input */}
              <form
                onSubmit={handleSend}
                className="flex w-full items-center gap-3"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="メッセージを入力..."
                  className="flex-1 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
                >
                  送信
                </button>
              </form>

              {/* Suggestions */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {[
                  "今日のニュースを教えて",
                  "Next.jsの始め方",
                  "メールの文面を作成して",
                  "英語を翻訳して",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => startChat(suggestion)}
                    className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
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
  );
}
