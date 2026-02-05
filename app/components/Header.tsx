import Link from "next/link";

const navItems = [
  { label: "Chat", href: "/chat" },
  { label: "Item", href: "/item" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center px-6">
        <Link
          href="/"
          className="mr-auto text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          AIhen
        </Link>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/login"
          className="ml-6 rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Login
        </Link>
      </div>
    </header>
  );
}
