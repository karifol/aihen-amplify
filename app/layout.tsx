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
        {children}
      </body>
    </html>
  );
}
