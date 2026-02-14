'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [input, setInput] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    router.push(`/chat?q=${encodeURIComponent(input.trim())}`);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex flex-col items-center gap-5 px-8 w-full max-w-2xl">
        <Image
          src="/title_log.svg"
          alt="AIhen"
          width={300}
          height={136}
          priority
          className="dark:invert"
        />

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex h-13 w-full items-center rounded-full border border-zinc-300 focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:focus-within:border-zinc-400 dark:focus-within:ring-zinc-400"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Lapwing対応の衣装を教えて"
            className="flex-1 bg-transparent px-4 py-2.5 text-zinc-900 outline-none dark:text-zinc-50"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white transition-colors hover:cursor-pointer hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
            </svg>
          </button>
        </form>
      </main>
      <p className="absolute bottom-8 text-sm text-zinc-400 dark:text-zinc-500">
        powered by{" "}
        <Link
          href="/contact"
          className="underline hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          karifol
        </Link>
      </p>
    </div>
  );
}
