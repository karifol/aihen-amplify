import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "../data";

export function generateStaticParams() {
  return articles.map((article) => ({ id: article.id }));
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = articles.find((a) => a.id === id);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/news"
          className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
        >
          &larr; ニュース一覧に戻る
        </Link>

        <article className="mt-8">
          <time className="text-sm text-zinc-500">{article.date}</time>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {article.title}
          </h1>
          <div className="mt-6 whitespace-pre-line text-base leading-7 text-zinc-700 dark:text-zinc-300">
            {article.body}
          </div>
        </article>
      </div>
    </div>
  );
}
