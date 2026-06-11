"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const isLogin = pathname === "/admin/login";

  if (isLogin) return <>{children}</>;

  const navItems = [
    { href: "/admin", label: "ダッシュボード", icon: "🏠" },
    { href: "/admin/shop", label: "店舗情報", icon: "🏪" },
    { href: "/admin/menu", label: "メニュー管理", icon: "🍽" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f9fafb" }}>
      {/* 管理者ヘッダー */}
      <header className="bg-white border-b px-4 py-3 shadow-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-black text-lg" style={{ color: "var(--color-green)" }}>
              MY
            </span>
            <span className="font-black text-lg" style={{ color: "var(--color-text)" }}>
              SHOKU
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full text-white ml-1"
                  style={{ backgroundColor: "var(--color-green)" }}>
              管理者
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ color: "var(--color-muted)", borderColor: "#e5e7eb" }}
          >
            ログアウト
          </button>
        </div>
      </header>

      {/* ナビゲーション */}
      <nav className="bg-white border-b">
        <div className="max-w-2xl mx-auto flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors"
                style={{
                  borderBottomColor: active ? "var(--color-green)" : "transparent",
                  color: active ? "var(--color-green)" : "var(--color-muted)",
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
          <Link
            href="/"
            className="ml-auto flex items-center gap-1 px-4 py-3 text-xs transition-colors hover:opacity-70"
            style={{ color: "var(--color-muted)" }}
          >
            来場者画面 →
          </Link>
        </div>
      </nav>

      {/* コンテンツ */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-20">{children}</main>
    </div>
  );
}
