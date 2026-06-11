"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import AllergenSelector from "@/app/components/AllergenSelector";
import type { MenuItem, ShopWithMenus } from "@/types/database";

const DISCLAIMER =
  "アレルギー情報は出店者が登録したものです。必ずスタッフまたは原材料表示を直接ご確認ください。";

type ShopResult = ShopWithMenus & { safeMenus: MenuItem[] };

export default function HomePage() {
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [customRestrictions, setCustomRestrictions] = useState("");
  const [shops, setShops] = useState<ShopWithMenus[]>([]);
  const [loading, setLoading] = useState(true);

  // localStorage から復元
  useEffect(() => {
    try {
      const saved = localStorage.getItem("myshoku_allergens");
      if (saved) setSelectedAllergens(JSON.parse(saved));
      const savedCustom = localStorage.getItem("myshoku_custom");
      if (savedCustom) setCustomRestrictions(savedCustom);
    } catch {}
  }, []);

  // localStorage へ保存
  useEffect(() => {
    localStorage.setItem("myshoku_allergens", JSON.stringify(selectedAllergens));
  }, [selectedAllergens]);

  useEffect(() => {
    localStorage.setItem("myshoku_custom", customRestrictions);
  }, [customRestrictions]);

  // 全店舗＋メニュー取得
  useEffect(() => {
    const fetchShops = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("shops")
        .select("*, menu_items(*)")
        .order("created_at", { ascending: false });
      if (data) setShops(data as ShopWithMenus[]);
      setLoading(false);
    };
    fetchShops();
  }, []);

  const toggleAllergen = (allergen: string) => {
    setSelectedAllergens((prev) =>
      prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen]
    );
  };

  // 選択アレルゲンを含まないメニューを持つ店舗のみ表示
  const filteredShops: ShopResult[] = shops
    .map((shop) => {
      const safeMenus =
        selectedAllergens.length === 0
          ? shop.menu_items
          : shop.menu_items.filter(
              (menu) => !selectedAllergens.some((a) => menu.allergens.includes(a))
            );
      return { ...shop, safeMenus };
    })
    .filter((shop) => selectedAllergens.length === 0 || shop.safeMenus.length > 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-cream)" }}>
      {/* ヘッダー */}
      <header
        className="sticky top-0 z-50 px-4 py-3 shadow-md"
        style={{ backgroundColor: "var(--color-green)" }}
      >
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="text-white">
            <span className="font-black text-xl tracking-tight">MY</span>
            <span className="font-black text-xl" style={{ color: "#bbf7d0" }}>
              SHOKU
            </span>
            <span className="text-xs ml-2 opacity-75">マルシェ</span>
          </div>
          <Link
            href="/admin"
            className="text-xs text-white opacity-60 hover:opacity-100 transition-opacity"
          >
            出店者 →
          </Link>
        </div>
      </header>

      {/* 免責バナー */}
      <div className="border-b border-yellow-200 bg-yellow-50 px-4 py-2">
        <div className="max-w-lg mx-auto flex items-start gap-2">
          <span className="mt-0.5 text-yellow-500 text-sm">⚠️</span>
          <p className="text-xs leading-relaxed text-yellow-800">{DISCLAIMER}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5">
        {/* アレルゲン選択パネル */}
        <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <h1 className="mb-1 text-base font-bold" style={{ color: "var(--color-text)" }}>
            食べられない食材を選んでください
          </h1>
          <p className="mb-4 text-xs" style={{ color: "var(--color-muted)" }}>
            選択したアレルゲンを含まないメニューのある店舗を表示します
          </p>

          <AllergenSelector selected={selectedAllergens} onToggle={toggleAllergen} mode="exclude" />

          {/* フリーワード */}
          <div className="mt-4">
            <label className="mb-1 block text-xs font-medium" style={{ color: "var(--color-muted)" }}>
              その他（フリーワード追加）
            </label>
            <input
              type="text"
              placeholder="例：パクチー、ナッツ類"
              className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
              style={{ borderColor: "#e5e7eb" }}
              value={customRestrictions}
              onChange={(e) => setCustomRestrictions(e.target.value)}
            />
            {customRestrictions && (
              <p className="mt-1 text-xs" style={{ color: "var(--color-muted)" }}>
                ※ フリーワードは参考表示のみです。各店舗スタッフにご確認ください。
              </p>
            )}
          </div>

          {/* 選択中タグ */}
          {selectedAllergens.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {selectedAllergens.map((a) => (
                <button
                  key={a}
                  onClick={() => toggleAllergen(a)}
                  className="flex items-center gap-1 rounded-full px-2 py-1 text-xs text-white"
                  style={{ backgroundColor: "var(--color-green)" }}
                >
                  {a}
                  <span className="opacity-70">✕</span>
                </button>
              ))}
              <button
                onClick={() => setSelectedAllergens([])}
                className="rounded-full border px-2 py-1 text-xs"
                style={{ color: "var(--color-muted)", borderColor: "#e5e7eb" }}
              >
                全てクリア
              </button>
            </div>
          )}
        </section>

        {/* 検索結果 */}
        <section>
          <p className="mb-3 text-sm font-medium" style={{ color: "var(--color-text)" }}>
            {loading
              ? "読み込み中..."
              : selectedAllergens.length === 0
              ? `全店舗 (${filteredShops.length}件)`
              : `食べられるお店 (${filteredShops.length}件)`}
          </p>

          {loading ? (
            <div className="flex justify-center py-16">
              <div
                className="h-8 w-8 animate-spin rounded-full border-2"
                style={{ borderColor: "var(--color-green)", borderTopColor: "transparent" }}
              />
            </div>
          ) : filteredShops.length === 0 ? (
            <div className="py-16 text-center">
              <p className="mb-2 text-4xl">🥗</p>
              <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                条件に合うお店が見つかりませんでした
              </p>
              <p className="mt-1 text-xs" style={{ color: "var(--color-muted)" }}>
                アレルゲンの選択を減らして再度お試しください
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 pb-20">
              {filteredShops.map((shop) => (
                <ShopCard
                  key={shop.id}
                  shop={shop}
                  selectedAllergens={selectedAllergens}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ShopCard({
  shop,
  selectedAllergens,
}: {
  shop: ShopResult;
  selectedAllergens: string[];
}) {
  const displayMenus =
    selectedAllergens.length > 0 ? shop.safeMenus : shop.menu_items.slice(0, 3);

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      {/* 店舗写真 */}
      {shop.photo_url ? (
        <div className="h-40 w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shop.photo_url} alt={shop.name} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div
          className="flex h-28 w-full items-center justify-center"
          style={{ backgroundColor: "var(--color-green-50)" }}
        >
          {shop.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={shop.logo_url}
              alt={shop.name}
              className="h-14 w-14 rounded-full object-contain"
            />
          ) : (
            <span className="text-4xl">🏪</span>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h2 className="font-bold" style={{ color: "var(--color-text)" }}>
              {shop.name}
            </h2>
            {shop.category && (
              <span
                className="mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: "var(--color-green-50)",
                  color: "var(--color-green)",
                }}
              >
                {shop.category}
              </span>
            )}
          </div>
        </div>

        {shop.description && (
          <p className="mb-3 text-xs leading-relaxed" style={{ color: "var(--color-muted)" }}>
            {shop.description}
          </p>
        )}

        {/* メニューリスト */}
        {displayMenus.length > 0 && (
          <div className="mb-3">
            <p className="mb-2 text-xs font-semibold" style={{ color: "var(--color-green)" }}>
              {selectedAllergens.length > 0 ? "✅ 食べられるメニュー" : "メニュー"}
            </p>
            <div className="flex flex-col gap-1.5">
              {displayMenus.slice(0, 3).map((menu) => (
                <div key={menu.id} className="flex items-center gap-2 text-sm">
                  {menu.photo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={menu.photo_url}
                      alt={menu.name}
                      className="h-9 w-9 flex-shrink-0 rounded-lg object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <span
                      className="block truncate font-medium text-sm"
                      style={{ color: "var(--color-text)" }}
                    >
                      {menu.name}
                    </span>
                    {menu.price != null && (
                      <span className="text-xs" style={{ color: "var(--color-muted)" }}>
                        ¥{menu.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {displayMenus.length > 3 && (
                <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                  他 {displayMenus.length - 3} 品...
                </p>
              )}
            </div>
          </div>
        )}

        <Link
          href={`/shop/${shop.id}`}
          className="block w-full rounded-xl py-2.5 text-center text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--color-green)" }}
        >
          この店舗のメニューをすべて見る →
        </Link>
      </div>
    </div>
  );
}
