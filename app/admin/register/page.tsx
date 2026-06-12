"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-cream)" }}
    >
      {/* ロゴ */}
      <div className="mb-8 text-center">
        <div className="mb-2">
          <span className="font-black text-3xl tracking-tight" style={{ color: "var(--color-green)" }}>
            MY
          </span>
          <span className="font-black text-3xl" style={{ color: "var(--color-text)" }}>
            SHOKU
          </span>
        </div>
        <p className="text-sm" style={{ color: "var(--color-muted)" }}>
          マルシェ 出店者管理画面
        </p>
      </div>

      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm">
        {sent ? (
          <div className="text-center">
            <p className="mb-3 text-3xl">📬</p>
            <h1 className="mb-2 font-bold text-base" style={{ color: "var(--color-text)" }}>
              確認メールを送信しました
            </h1>
            <p className="text-xs leading-relaxed" style={{ color: "var(--color-muted)" }}>
              <span className="font-medium" style={{ color: "var(--color-text)" }}>{email}</span>{" "}
              に登録リンクを送りました。メールを確認してリンクをクリックすると登録完了です。
            </p>
            <p className="mt-4 text-xs" style={{ color: "var(--color-muted)" }}>
              届かない場合は迷惑メールフォルダもご確認ください。
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-5 text-xs underline"
              style={{ color: "var(--color-green)" }}
            >
              別のメールアドレスで試す
            </button>
          </div>
        ) : (
          <>
            <h1 className="mb-1 text-center text-base font-bold" style={{ color: "var(--color-text)" }}>
              新規登録
            </h1>
            <p className="mb-5 text-center text-xs" style={{ color: "var(--color-muted)" }}>
              メールアドレスを入力すると登録リンクを送ります
            </p>

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs text-red-600">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium" style={{ color: "var(--color-muted)" }}>
                  メールアドレス
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none"
                  style={{ borderColor: "#e5e7eb" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-3 text-sm font-medium text-white transition-opacity"
                style={{ backgroundColor: loading ? "#9ca3af" : "var(--color-green)" }}
              >
                {loading ? "送信中..." : "登録リンクを送る"}
              </button>
            </form>

            <p className="mt-5 text-center text-xs" style={{ color: "var(--color-muted)" }}>
              すでにアカウントをお持ちの方は{" "}
              <Link href="/admin/login" className="underline" style={{ color: "var(--color-green)" }}>
                ログイン
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
