export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-black select-none">
      <main className="flex flex-col items-center gap-8 px-8">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            AIhen
          </h1>
          <p className="flex text-2xl text-zinc-600 dark:text-zinc-400">
            K
            <span className="text-blue-500 font-bold mx-0.5">AI</span>
            HEN support AI
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-10 py-8 shadow-sm">
          <div className="text-4xl">🔧</div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            メンテナンス中
          </h2>
          <p className="max-w-sm text-center text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            現在、サービスの改善のためメンテナンスを行っております。
            <br />
            ご不便をおかけしますが、しばらくお待ちください。
          </p>
        </div>
      </main>
    </div>
  );
}
