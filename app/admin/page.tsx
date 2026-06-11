"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Shop, MenuItem } from "@/types/database";

export default function AdminDashboard() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: shopData } = await supabase
        .from("shops")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (shopData) {
        setShop(shopData);
        const { data: menuData } = await supabase
          .from("menu_items")
          .select("*")
          .eq("shop_id", shopData.id);
        if (menuData) setMenus(menuData);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2"
          style={{ borderColor: "var(--color-green)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
        ダッシュボード
      </h1>

      {!shop ? (
        /* 店舗未登録 */
        <div className="rounded-2xl border-2 border-dashed p-8 text-center"
             style={{ borderColor: "var(--color-green)" }}>
          <p className="mb-2 text-3xl">🏪</p>
          <p className="mb-4 text-sm font-medium" style={{ color: "var(--color-text)" }}>
            まず店舗情報を登録してください
          </p>
          <Link
            href="/admin/shop"
            className="inline-block rounded-xl px-5 py-2.5 text-sm font-medium text-white"
            style={{ backgroundColor: "var(--color-green)" }}
          >
            店舗を登録する
          </Link>
        </div>
      ) : (
        <>
          {/* 店舗概要カード */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              {shop.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={shop.logo_url}
                  alt={shop.name}
                  className="h-14 w-14 rounded-xl object-cover flex-shrink-0"
                />
              ) : (
                <div
                  className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-2xl"
                  style={{ backgroundColor: "var(--color-green-50)" }}
                >
                  🏪
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-base truncate" style={{ color: "var(--color-text)" }}>
                  {shop.name}
                </h2>
                {shop.category && (
                  <span
                    className="mt-1 inline-block rounded-full px-2 py-0.5 text-xs"
                    style={{
                      backgroundColor: "var(--color-green-50)",
                      color: "var(--color-green)",
                    }}
                  >
                    {shop.category}
                  </span>
                )}
                {shop.description && (
                  <p className="mt-1 text-xs line-clamp-2" style={{ color: "var(--color-muted)" }}>
                    {shop.description}
                  </p>
                )}
              </div>
            </div>
            <Link
              href="/admin/shop"
              className="mt-4 block text-center rounded-xl border py-2 text-xs font-medium transition-colors hover:bg-gray-50"
              style={{ borderColor: "#e5e7eb", color: "var(--color-muted)" }}
            >
              店舗情報を編集する →
            </Link>
          </div>

          {/* メニュー統計カード */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-2xl font-black" style={{ color: "var(--color-green)" }}>
                {menus.length}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
                登録メニュー数
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-2xl font-black" style={{ color: "var(--color-text)" }}>
                {new Set(menus.flatMap((m) => m.allergens)).size}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
                登録アレルゲン種類
              </p>
            </div>
          </div>

          {/* クイックアクション */}
          <div className="grid grid-cols-1 gap-3">
            <Link
              href="/admin/menu"
              className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">🍽</span>
              <div>
                <p className="font-medium text-sm" style={{ color: "var(--color-text)" }}>
                  メニューを管理する
                </p>
                <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                  メニューの追加・編集・削除
                </p>
              </div>
              <span className="ml-auto" style={{ color: "var(--color-muted)" }}>→</span>
            </Link>

            <Link
              href={`/shop/${shop.id}`}
              target="_blank"
              className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">👁</span>
              <div>
                <p className="font-medium text-sm" style={{ color: "var(--color-text)" }}>
                  来場者向けページを確認
                </p>
                <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                  新しいタブで開きます
                </p>
              </div>
              <span className="ml-auto" style={{ color: "var(--color-muted)" }}>↗</span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
