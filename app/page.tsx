import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex flex-col items-center gap-5 px-8">
        <h1 className="text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          AIhen
        </h1>
        <p className="flex not-visited:max-w-md text-center text-3xl text-zinc-600 dark:text-zinc-400">
          K
          {/* <span className="text-blue-500 font-bold mx-0.5">AI</span> */}
          AIHEN support AI
        </p>
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
