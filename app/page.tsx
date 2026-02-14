import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex flex-col items-center gap-5 px-8">
        <Image
          src="/title_log.svg"
          alt="AIhen"
          width={300}
          height={136}
          priority
          className="dark:invert"
        />
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
