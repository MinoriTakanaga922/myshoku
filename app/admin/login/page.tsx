"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("メールアドレスまたはパスワードが正しくありません");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
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

      {/* ログインフォーム */}
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="mb-5 text-center text-base font-bold" style={{ color: "var(--color-text)" }}>
          ログイン
        </h1>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs text-red-600">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
              className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1"
              style={{ borderColor: "#e5e7eb" }}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: "var(--color-muted)" }}>
              パスワード
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-1"
              style={{ borderColor: "#e5e7eb" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3 text-sm font-medium text-white transition-opacity"
            style={{
              backgroundColor: loading ? "#9ca3af" : "var(--color-green)",
            }}
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
      </div>
    </div>
  );
}
