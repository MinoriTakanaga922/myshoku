"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import AllergenSelector from "@/app/components/AllergenSelector";
import { ALLERGENS } from "@/lib/allergens";
import type { MenuItem, Shop } from "@/types/database";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  ingredients_text: "",
};

type FormState = typeof EMPTY_FORM;

export default function AdminMenuPage() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 編集中のメニューID（null = 新規作成）
  const [editingId, setEditingId] = useState<string | null | "new">(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [menuPhotoFile, setMenuPhotoFile] = useState<File | null>(null);
  const [menuPhotoPreview, setMenuPhotoPreview] = useState("");
  const [ingredientsImageFile, setIngredientsImageFile] = useState<File | null>(null);
  const [ingredientsImagePreview, setIngredientsImagePreview] = useState("");

  const formRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const ingImageInputRef = useRef<HTMLInputElement>(null);

  const fetchMenus = useCallback(async (shopId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .eq("shop_id", shopId)
      .order("created_at", { ascending: false });
    if (data) setMenus(data);
  }, []);

  useEffect(() => {
    const init = async () => {
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
        await fetchMenus(shopData.id);
      }
      setLoading(false);
    };
    init();
  }, [fetchMenus]);

  const resetForm = (clearMsg = true) => {
    setForm(EMPTY_FORM);
    setSelectedAllergens([]);
    setMenuPhotoFile(null);
    setMenuPhotoPreview("");
    setIngredientsImageFile(null);
    setIngredientsImagePreview("");
    setEditingId(null);
    if (clearMsg) setMessage(null);
  };

  const openNew = () => {
    resetForm();
    setEditingId("new");
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const openEdit = (menu: MenuItem) => {
    setForm({
      name: menu.name,
      description: menu.description || "",
      price: menu.price != null ? String(menu.price) : "",
      ingredients_text: menu.ingredients_text || "",
    });
    setSelectedAllergens(menu.allergens);
    setMenuPhotoPreview(menu.photo_url || "");
    setIngredientsImagePreview(menu.ingredients_image_url || "");
    setMenuPhotoFile(null);
    setIngredientsImageFile(null);
    setEditingId(menu.id);
    setMessage(null);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const uploadImage = async (file: File, path: string): Promise<string | null> => {
    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from("shop-images")
      .upload(path, file, { upsert: true });
    if (error || !data) return null;
    const {
      data: { publicUrl },
    } = supabase.storage.from("shop-images").getPublicUrl(data.path);
    return publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop) return;
    if (!form.name.trim()) {
      setMessage({ type: "error", text: "メニュー名は必須です" });
      return;
    }
    setSaving(true);
    setMessage(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const existingMenu = editingId && editingId !== "new"
      ? menus.find((m) => m.id === editingId)
      : null;

    let photoUrl = existingMenu?.photo_url ?? null;
    let ingImageUrl = existingMenu?.ingredients_image_url ?? null;

    if (menuPhotoFile) {
      photoUrl = await uploadImage(
        menuPhotoFile,
        `${user.id}/menu-${Date.now()}`
      );
    }
    if (ingredientsImageFile) {
      ingImageUrl = await uploadImage(
        ingredientsImageFile,
        `${user.id}/ing-${Date.now()}`
      );
    }

    const menuData = {
      shop_id: shop.id,
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: form.price ? parseInt(form.price, 10) : null,
      ingredients_text: form.ingredients_text.trim() || null,
      ingredients_image_url: ingImageUrl,
      photo_url: photoUrl,
      allergens: selectedAllergens,
    };

    if (editingId && editingId !== "new") {
      const { error } = await supabase.from("menu_items").update(menuData).eq("id", editingId);
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        await fetchMenus(shop.id);
        setMessage({ type: "success", text: "メニューを更新しました" });
        resetForm(false);
      }
    } else {
      const { error } = await supabase.from("menu_items").insert(menuData);
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        await fetchMenus(shop.id);
        setMessage({ type: "success", text: "メニューを追加しました" });
        resetForm(false);
      }
    }
    setSaving(false);
  };

  const handleDelete = async (menuId: string) => {
    if (!confirm("このメニューを削除しますか？")) return;
    setDeleting(menuId);
    const supabase = createClient();
    await supabase.from("menu_items").delete().eq("id", menuId);
    if (shop) await fetchMenus(shop.id);
    if (editingId === menuId) resetForm();
    setDeleting(null);
  };

  const notContained = ALLERGENS.filter((a) => !selectedAllergens.includes(a));

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

  if (!shop) {
    return (
      <div className="py-16 text-center">
        <p className="mb-4 text-sm" style={{ color: "var(--color-muted)" }}>
          先に店舗情報を登録してください
        </p>
        <a
          href="/admin/shop"
          className="inline-block rounded-xl px-4 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: "var(--color-green)" }}
        >
          店舗を登録する
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
          メニュー管理
        </h1>
        <button
          onClick={openNew}
          className="rounded-xl px-4 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: "var(--color-green)" }}
        >
          + メニュー追加
        </button>
      </div>

      {/* 保存結果メッセージ（フォーム外） */}
      {message && editingId === null && (
        <div
          className="rounded-xl p-3 text-xs"
          style={{
            backgroundColor: message.type === "success" ? "#eff6ff" : "#fef2f2",
            color: message.type === "success" ? "#1d4ed8" : "#b91c1c",
          }}
        >
          {message.type === "success" ? "✅ " : "❌ "}
          {message.text}
        </div>
      )}

      {/* メニューリスト */}
      {menus.length === 0 ? (
        <div
          className="rounded-2xl border-2 border-dashed p-8 text-center"
          style={{ borderColor: "#e5e7eb" }}
        >
          <p className="mb-1 text-3xl">🍽</p>
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            メニューがまだありません
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm"
              style={
                editingId === menu.id
                  ? { outline: "2px solid var(--color-green)" }
                  : {}
              }
            >
              {menu.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={menu.photo_url}
                  alt={menu.name}
                  className="h-12 w-12 flex-shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-xl"
                  style={{ backgroundColor: "#f3f4f6" }}
                >
                  🍽
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-sm" style={{ color: "var(--color-text)" }}>
                  {menu.name}
                </p>
                <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                  {menu.price != null ? `¥${menu.price.toLocaleString()}` : "価格未設定"}
                  {" · "}
                  アレルゲン {menu.allergens.length}種
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(menu)}
                  className="rounded-lg border px-3 py-1.5 text-xs transition-colors hover:bg-gray-50"
                  style={{ borderColor: "#e5e7eb", color: "var(--color-muted)" }}
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(menu.id)}
                  disabled={deleting === menu.id}
                  className="rounded-lg border px-3 py-1.5 text-xs text-red-500 transition-colors hover:bg-red-50"
                  style={{ borderColor: "#fca5a5" }}
                >
                  {deleting === menu.id ? "..." : "削除"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* メニュー追加・編集フォーム */}
      {editingId !== null && (
        <div ref={formRef} className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-base" style={{ color: "var(--color-text)" }}>
              {editingId === "new" ? "メニューを追加" : "メニューを編集"}
            </h2>
            <button
              onClick={() => resetForm(true)}
              className="text-xs"
              style={{ color: "var(--color-muted)" }}
            >
              キャンセル
            </button>
          </div>

          {message && (
            <div
              className="mb-4 rounded-xl p-3 text-xs"
              style={{
                backgroundColor: message.type === "success" ? "#eff6ff" : "#fef2f2",
                color: message.type === "success" ? "#1d4ed8" : "#b91c1c",
              }}
            >
              {message.type === "success" ? "✅ " : "❌ "}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            {/* メニュー名 */}
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: "var(--color-muted)" }}>
                メニュー名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="例：いちごタルト"
                className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none"
                style={{ borderColor: "#e5e7eb" }}
              />
            </div>

            {/* 説明 */}
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: "var(--color-muted)" }}>
                説明文
              </label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="メニューの説明"
                className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none resize-none"
                style={{ borderColor: "#e5e7eb" }}
              />
            </div>

            {/* 料金 */}
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: "var(--color-muted)" }}>
                料金（円）
              </label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="例：500"
                className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none"
                style={{ borderColor: "#e5e7eb" }}
              />
            </div>

            {/* メニュー写真 */}
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: "var(--color-muted)" }}>
                メニュー写真
              </label>
              <div
                className="relative flex h-32 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors hover:border-blue-400"
                style={{ borderColor: menuPhotoPreview ? "var(--color-green)" : "#e5e7eb" }}
                onClick={() => photoInputRef.current?.click()}
              >
                {menuPhotoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={menuPhotoPreview} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl text-gray-300">📷</span>
                    <span className="text-xs" style={{ color: "var(--color-muted)" }}>
                      タップして選択
                    </span>
                  </div>
                )}
              </div>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setMenuPhotoFile(file);
                    setMenuPhotoPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </div>

            {/* 原材料テキスト */}
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: "var(--color-muted)" }}>
                原材料テキスト（カンマ区切り）
              </label>
              <textarea
                rows={2}
                value={form.ingredients_text}
                onChange={(e) => setForm((f) => ({ ...f, ingredients_text: e.target.value }))}
                placeholder="例：薄力粉、砂糖、バター、卵、いちご"
                className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none resize-none"
                style={{ borderColor: "#e5e7eb" }}
              />
            </div>

            {/* 原材料画像 */}
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: "var(--color-muted)" }}>
                原材料表示画像（パッケージ写真など）
              </label>
              <div
                className="relative flex h-28 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors"
                style={{ borderColor: ingredientsImagePreview ? "var(--color-green)" : "#e5e7eb" }}
                onClick={() => ingImageInputRef.current?.click()}
              >
                {ingredientsImagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ingredientsImagePreview}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl text-gray-300">🏷</span>
                    <span className="text-xs" style={{ color: "var(--color-muted)" }}>
                      原材料表示をアップロード
                    </span>
                  </div>
                )}
              </div>
              <input
                ref={ingImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setIngredientsImageFile(file);
                    setIngredientsImagePreview(URL.createObjectURL(file));
                  }
                }}
              />
            </div>

            {/* アレルゲン選択 */}
            <div>
              <p className="mb-2 text-xs font-medium" style={{ color: "var(--color-muted)" }}>
                このメニューに含まれるアレルゲン（複数選択可）
              </p>
              <AllergenSelector
                selected={selectedAllergens}
                onToggle={(a) =>
                  setSelectedAllergens((prev) =>
                    prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
                  )
                }
                mode="include"
              />
            </div>

            {/* 含まないアレルゲン（自動算出） */}
            <div
              className="rounded-xl p-3"
              style={{ backgroundColor: "var(--color-green-50)" }}
            >
              <p className="mb-2 text-xs font-semibold" style={{ color: "var(--color-green)" }}>
                このメニューに含まれないアレルゲン（自動算出）
              </p>
              {notContained.length === ALLERGENS.length ? (
                <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                  全29品目が含まれていません
                </p>
              ) : notContained.length === 0 ? (
                <p className="text-xs text-red-600">全アレルゲンを含みます</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {notContained.map((a) => (
                    <span
                      key={a}
                      className="rounded-full px-2 py-0.5 text-xs"
                      style={{
                        backgroundColor: "var(--color-green-100)",
                        color: "var(--color-green-dark)",
                      }}
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl py-3 text-sm font-medium text-white transition-opacity"
              style={{ backgroundColor: saving ? "#9ca3af" : "var(--color-green)" }}
            >
              {saving ? "保存中..." : editingId === "new" ? "メニューを追加する" : "変更を保存する"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
