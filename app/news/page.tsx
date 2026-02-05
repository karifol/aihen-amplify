import Link from "next/link";
import { articles } from "./data";

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          News
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          AIhenからのお知らせ
        </p>

        <ul className="mt-10 divide-y divide-zinc-200 dark:divide-zinc-800">
          {articles.map((article) => (
            <li key={article.id}>
              <Link
                href={`/news/${article.id}`}
                className="block py-5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 -mx-4 px-4 rounded-lg"
              >
                <time className="text-sm text-zinc-500 dark:text-zinc-500">
                  {article.date}
                </time>
                <h2 className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {article.title}
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {article.summary}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
