"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ALLERGENS, STAFF_CHECK } from "@/lib/allergens";
import type { MenuItem, ShopWithMenus } from "@/types/database";

const DISCLAIMER =
  "アレルギー情報は出店者が登録したものです。必ずスタッフまたは原材料表示を直接ご確認ください。";

export default function ShopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [shop, setShop] = useState<ShopWithMenus | null>(null);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  // localStorageからアレルゲン復元
  useEffect(() => {
    try {
      const saved = localStorage.getItem("myshoku_allergens");
      if (saved) setSelectedAllergens(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    const fetchShop = async () => {
      const { id } = await params;
      const supabase = createClient();
      const { data } = await supabase
        .from("shops")
        .select("*, menu_items(*)")
        .eq("id", id)
        .single();
      if (data) setShop(data as ShopWithMenus);
      setLoading(false);
    };
    fetchShop();
  }, [params]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2"
          style={{ borderColor: "var(--color-green)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-gray-500">店舗が見つかりませんでした</p>
        <Link href="/" className="text-sm" style={{ color: "var(--color-green)" }}>
          ← トップに戻る
        </Link>
      </div>
    );
  }

  const isSafe = (menu: MenuItem) =>
    selectedAllergens.length === 0 ||
    (!menu.allergens.includes(STAFF_CHECK) &&
      !selectedAllergens.some((a) => menu.allergens.includes(a)));

  const safeCount = shop.menu_items.filter(isSafe).length;
  const total = shop.menu_items.length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-cream)" }}>
      {/* ヘッダー */}
      <header
        className="sticky top-0 z-50 px-4 py-3 shadow-md"
        style={{ backgroundColor: "var(--color-green)" }}
      >
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link
            href="/"
            className="text-white opacity-70 hover:opacity-100 transition-opacity text-sm"
          >
            ← 戻る
          </Link>
          <div className="text-white">
            <span className="font-black text-base tracking-tight">MY</span>
            <span className="font-black text-base" style={{ color: "#bfdbfe" }}>
              SHOKU
            </span>
          </div>
        </div>
      </header>

      {/* 免責バナー */}
      <div className="border-b border-yellow-200 bg-yellow-50 px-4 py-2">
        <div className="max-w-lg mx-auto flex items-start gap-2">
          <span className="mt-0.5 text-yellow-500 text-sm">⚠️</span>
          <p className="text-xs leading-relaxed text-yellow-800">{DISCLAIMER}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 pb-20">
        {/* 店舗情報 */}
        <section className="mb-5 overflow-hidden rounded-2xl bg-white shadow-sm">
          {shop.photo_url ? (
            <div className="h-48 w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={shop.photo_url} alt={shop.name} className="h-full w-full object-cover" />
            </div>
          ) : (
            <div
              className="flex h-32 w-full items-center justify-center"
              style={{ backgroundColor: "var(--color-green-50)" }}
            >
              {shop.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={shop.logo_url}
                  alt={shop.name}
                  className="h-16 w-16 rounded-full object-contain"
                />
              ) : (
                <span className="text-5xl">🏪</span>
              )}
            </div>
          )}

          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
                {shop.name}
              </h1>
              {shop.category && (
                <span
                  className="ml-2 flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: "var(--color-green-50)",
                    color: "var(--color-green)",
                  }}
                >
                  {shop.category}
                </span>
              )}
            </div>

            {shop.description && (
              <p className="mb-3 text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
                {shop.description}
              </p>
            )}

            {shop.contact && (
              <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                📞 {shop.contact}
              </p>
            )}

            {/* メニュー概要バッジ */}
            {selectedAllergens.length > 0 && (
              <div
                className="mt-3 rounded-xl p-3 text-sm"
                style={{ backgroundColor: "var(--color-green-50)" }}
              >
                <span className="font-bold" style={{ color: "var(--color-green)" }}>
                  ✅ {safeCount} / {total} 品が食べられます
                </span>
              </div>
            )}
          </div>
        </section>

        {/* メニュー一覧 */}
        <section>
          <h2 className="mb-3 font-bold text-base" style={{ color: "var(--color-text)" }}>
            メニュー一覧
          </h2>

          {shop.menu_items.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: "var(--color-muted)" }}>
              メニューが登録されていません
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {shop.menu_items.map((menu) => {
                const safe = isSafe(menu);
                const isExpanded = expandedMenu === menu.id;
                const actualAllergens = menu.allergens.filter((a) => a !== STAFF_CHECK);
                const notContained = menu.allergens.includes(STAFF_CHECK)
                  ? []
                  : ALLERGENS.filter((a) => !actualAllergens.includes(a));

                return (
                  <div
                    key={menu.id}
                    className="overflow-hidden rounded-2xl bg-white shadow-sm"
                    style={
                      selectedAllergens.length > 0
                        ? {
                            borderLeft: `4px solid ${safe ? "#2563eb" : "#dc2626"}`,
                          }
                        : {}
                    }
                  >
                    {/* メニューヘッダー */}
                    <button
                      className="flex w-full items-start gap-3 p-4 text-left"
                      onClick={() => setExpandedMenu(isExpanded ? null : menu.id)}
                    >
                      {menu.photo_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={menu.photo_url}
                          alt={menu.name}
                          className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3
                            className="font-bold text-sm leading-tight"
                            style={{ color: "var(--color-text)" }}
                          >
                            {menu.name}
                          </h3>
                          {menu.allergens.includes(STAFF_CHECK) ? (
                            <span
                              className="flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-bold"
                              style={{ backgroundColor: "#fef3c7", color: "#92400e" }}
                            >
                              ⚠️ 要確認
                            </span>
                          ) : selectedAllergens.length > 0 && (
                            <span
                              className="flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-bold"
                              style={
                                safe
                                  ? { backgroundColor: "#dbeafe", color: "#1d4ed8" }
                                  : { backgroundColor: "#fee2e2", color: "#b91c1c" }
                              }
                            >
                              {safe ? "✅ OK" : "⚠️ 注意"}
                            </span>
                          )}
                        </div>

                        {menu.description && (
                          <p
                            className="mt-1 text-xs leading-relaxed"
                            style={{ color: "var(--color-muted)" }}
                          >
                            {menu.description}
                          </p>
                        )}

                        {menu.price != null && (
                          <p
                            className="mt-1 text-sm font-medium"
                            style={{ color: "var(--color-text)" }}
                          >
                            ¥{menu.price.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <span
                        className="flex-shrink-0 text-xs transition-transform"
                        style={{
                          color: "var(--color-muted)",
                          transform: isExpanded ? "rotate(180deg)" : "none",
                        }}
                      >
                        ▼
                      </span>
                    </button>

                    {/* 詳細（展開時） */}
                    {isExpanded && (
                      <div
                        className="border-t px-4 pb-4 pt-3"
                        style={{ borderColor: "#f3f4f6" }}
                      >
                        {/* スタッフ確認フラグ */}
                        {menu.allergens.includes(STAFF_CHECK) && (
                          <div
                            className="mb-3 rounded-xl px-3 py-2 text-xs font-medium"
                            style={{ backgroundColor: "#fef3c7", color: "#92400e" }}
                          >
                            ⚠️ アレルゲン情報はスタッフにお聞きください
                          </div>
                        )}

                        {/* 含むアレルゲン */}
                        {menu.allergens.filter((a) => a !== STAFF_CHECK).length > 0 && (
                          <div className="mb-3">
                            <p className="mb-1.5 text-xs font-semibold text-red-600">
                              含むアレルゲン
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {menu.allergens.filter((a) => a !== STAFF_CHECK).map((a) => (
                                <span
                                  key={a}
                                  className="rounded-full px-2 py-0.5 text-xs font-medium"
                                  style={{
                                    backgroundColor: selectedAllergens.includes(a)
                                      ? "#fee2e2"
                                      : "#fff1f2",
                                    color: selectedAllergens.includes(a) ? "#b91c1c" : "#be123c",
                                    borderWidth: selectedAllergens.includes(a) ? "1px" : "0",
                                    borderColor: "#fca5a5",
                                  }}
                                >
                                  {a}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 含まないアレルゲン（自動算出） */}
                        {notContained.length > 0 && (
                          <div className="mb-3">
                            <p
                              className="mb-1.5 text-xs font-semibold"
                              style={{ color: "var(--color-green)" }}
                            >
                              含まないアレルゲン（全{notContained.length}品目）
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {notContained.map((a) => (
                                <span
                                  key={a}
                                  className="rounded-full px-2 py-0.5 text-xs"
                                  style={{
                                    backgroundColor: "var(--color-green-50)",
                                    color: "var(--color-green)",
                                  }}
                                >
                                  {a}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 原材料テキスト */}
                        {menu.ingredients_text && (
                          <div className="mb-3">
                            <p
                              className="mb-1 text-xs font-semibold"
                              style={{ color: "var(--color-muted)" }}
                            >
                              原材料
                            </p>
                            <p
                              className="text-xs leading-relaxed"
                              style={{ color: "var(--color-text)" }}
                            >
                              {menu.ingredients_text}
                            </p>
                          </div>
                        )}

                        {/* 原材料画像 */}
                        {menu.ingredients_image_url && (
                          <div>
                            <p
                              className="mb-1 text-xs font-semibold"
                              style={{ color: "var(--color-muted)" }}
                            >
                              原材料表示
                            </p>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={menu.ingredients_image_url}
                              alt="原材料表示"
                              className="w-full rounded-xl object-contain"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
