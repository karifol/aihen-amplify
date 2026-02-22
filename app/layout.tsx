import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Providers from "./components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const IS_PAUSED = true

const SITE_URL = 'https://aihen.jp'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'AIhen - 改変サポートAI',
  description: 'アバター改変をサポートするAIチャットボット',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'AIhen - 改変サポートAI',
    description: 'アバター改変をサポートするAIチャットボット',
    images: [{ url: '/ogp.png' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIhen - 改変サポートAI',
    description: 'アバター改変をサポートするAIチャットボット',
    images: ['/ogp.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Header />
          <div className="pt-14">{children}</div>
          {IS_PAUSED && (
            <div className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-4 backdrop-blur-sm bg-white/70 dark:bg-zinc-950/70">
              <span className="rounded-full bg-zinc-900 px-5 py-1.5 text-xs font-bold tracking-widest text-white dark:bg-zinc-100 dark:text-zinc-900">
                停止中
              </span>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                現在このサービスは一時停止しています
              </p>
            </div>
          )}
        </Providers>
      </body>
    </html>
  );
}
