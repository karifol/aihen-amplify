import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex flex-col items-center gap-8 px-8">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          AIhen
        </h1>
        <p className="max-w-md text-center text-lg text-zinc-600 dark:text-zinc-400">
          Your Personal AI Assistant
        </p>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            ログイン
          </Link>
          <Link
            href="/signup"
            className="rounded-full border border-zinc-300 px-8 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            新規登録
          </Link>
        </div>
      </main>
    </div>
  );
}
