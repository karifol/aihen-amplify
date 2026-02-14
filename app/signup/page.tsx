"use client";

export const dynamic = 'force-dynamic';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../lib/auth-context";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [step, setStep] = useState<"register" | "confirm">("register");
  const [error, setError] = useState("");
  const { signup, confirmSignup, login } = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }
    try {
      const result = await signup(email, password);
      if (result.needsConfirmation) {
        setStep("confirm");
      } else {
        await login(email, password);
        router.push("/chat");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "アカウント作成に失敗しました。");
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await confirmSignup(email, confirmationCode);
      await login(email, password);
      router.push("/chat");
    } catch (err) {
      setError(err instanceof Error ? err.message : "確認コードの検証に失敗しました。");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:focus:border-zinc-400 dark:focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-sm px-8">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            AIhen
          </Link>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {step === "register" ? "新規アカウント作成" : "確認コードを入力"}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {step === "register" ? (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                パスワード
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="パスワードを入力"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                パスワード（確認）
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
                placeholder="パスワードを再入力"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-zinc-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              アカウント作成
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirm} className="flex flex-col gap-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {email} に確認コードを送信しました。
            </p>
            <div>
              <label
                htmlFor="code"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                確認コード
              </label>
              <input
                id="code"
                type="text"
                required
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                className={inputClass}
                placeholder="6桁のコードを入力"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-zinc-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              確認
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          すでにアカウントをお持ちの方は{" "}
          <Link
            href="/login"
            className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
          >
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}
