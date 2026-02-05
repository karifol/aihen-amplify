import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Contact
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          お問い合わせはX（Twitter）またはフォームからお気軽にどうぞ。
        </p>

        <div className="mt-10 flex flex-col gap-10">
          {/* X (Twitter) */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              X (Twitter)
            </h2>
            <a
              href="https://x.com/karifol133027"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @karifol133027
            </a>
          </section>

          {/* Google Form */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              お問い合わせフォーム
            </h2>
            <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSeVCPBLrTaG1CSK0Q6SH5eRih-VY7vg0d3GTOfNdvvIJYvLnQ/viewform?usp=dialog"
                width="100%"
                height="500"
                className="bg-white"
                title="お問い合わせフォーム"
              >
                読み込み中...
              </iframe>
            </div>
          </section>
          {/* Legal */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              規約・ポリシー
            </h2>
            <div className="flex gap-4">
              <Link
                href="/terms"
                className="inline-flex items-center rounded-lg border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                利用規約
              </Link>
              <Link
                href="/privacy"
                className="inline-flex items-center rounded-lg border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                プライバシーポリシー
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
