import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex flex-col items-center gap-8 px-8">
        <h1 className="text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          AIhen
        </h1>
        <p className="flex not-visited:max-w-md text-center text-3xl text-zinc-600 dark:text-zinc-400">
          K
          <div className="text-blue-500 font-bold mx-0.5">AI</div>
          HEN support AI
        </p>
      </main>
    </div>
  );
}
