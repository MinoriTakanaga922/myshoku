"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Shop } from "@/types/database";

const CATEGORIES = ["スイーツ", "惣菜", "ドリンク", "パン", "農産物", "弁当", "その他"];

function ImageUpload({
  label,
  preview,
  onFileSelect,
  aspect = "landscape",
}: {
  label: string;
  preview: string;
  onFileSelect: (file: File) => void;
  aspect?: "landscape" | "square";
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label className="mb-1 block text-xs font-medium" style={{ color: "var(--color-muted)" }}>
        {label}
      </label>
      <div
        className={`relative overflow-hidden rounded-xl border-2 border-dashed cursor-pointer transition-colors hover:border-blue-400 ${
          aspect === "square" ? "h-24 w-24" : "h-36 w-full"
        }`}
        style={{ borderColor: preview ? "var(--color-green)" : "#e5e7eb" }}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1">
            <span className="text-2xl text-gray-300">📷</span>
            <span className="text-xs" style={{ color: "var(--color-muted)" }}>
              タップして選択
            </span>
          </div>
        )}
        {preview && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-white text-xs">変更</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
        }}
      />
    </div>
  );
}

export default function AdminShopPage() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [contact, setContact] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    const fetchShop = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("shops")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setShop(data);
        setName(data.name);
        setDescription(data.description || "");
        setCategory(data.category || "");
        setContact(data.contact || "");
        if (data.logo_url) setLogoPreview(data.logo_url);
        if (data.photo_url) setPhotoPreview(data.photo_url);
      }
      setLoading(false);
    };
    fetchShop();
  }, []);

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
    if (!name.trim()) {
      setMessage({ type: "error", text: "店舗名は必須です" });
      return;
    }
    setSaving(true);
    setMessage(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    let logoUrl = shop?.logo_url ?? null;
    let photoUrl = shop?.photo_url ?? null;

    if (logoFile) {
      logoUrl = await uploadImage(logoFile, `${user.id}/logo-${Date.now()}`);
    }
    if (photoFile) {
      photoUrl = await uploadImage(photoFile, `${user.id}/photo-${Date.now()}`);
    }

    const shopData = {
      name: name.trim(),
      description: description.trim() || null,
      category: category || null,
      contact: contact.trim() || null,
      logo_url: logoUrl,
      photo_url: photoUrl,
      user_id: user.id,
    };

    if (shop) {
      const { error } = await supabase.from("shops").update(shopData).eq("id", shop.id);
      setMessage(error ? { type: "error", text: error.message } : { type: "success", text: "更新しました" });
    } else {
      const { data, error } = await supabase
        .from("shops")
        .insert(shopData)
        .select()
        .single();
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setShop(data);
        setMessage({ type: "success", text: "店舗を登録しました" });
      }
    }
    setSaving(false);
  };

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
    <form onSubmit={handleSave} className="space-y-5">
      <h1 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
        {shop ? "店舗情報の編集" : "店舗を登録する"}
      </h1>

      {message && (
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

      {/* 基本情報 */}
      <div className="rounded-2xl bg-white p-5 shadow-sm space-y-4">
        <h2 className="font-bold text-sm" style={{ color: "var(--color-text)" }}>
          基本情報
        </h2>

        <div>
          <label className="mb-1 block text-xs font-medium" style={{ color: "var(--color-muted)" }}>
            店舗名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：さくらスイーツ"
            className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium" style={{ color: "var(--color-muted)" }}>
            説明文
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="店舗のアピールポイントを入力してください"
            className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none resize-none"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium" style={{ color: "var(--color-muted)" }}>
            カテゴリ
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat === category ? "" : cat)}
                className="rounded-full border px-3 py-1.5 text-xs font-medium transition-all"
                style={
                  category === cat
                    ? { backgroundColor: "var(--color-green)", borderColor: "var(--color-green)", color: "white" }
                    : { borderColor: "#e5e7eb", color: "var(--color-muted)" }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium" style={{ color: "var(--color-muted)" }}>
            連絡先・SNSリンク（任意）
          </label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="例：Instagram: @myshoku / 090-xxxx-xxxx"
            className="w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none"
            style={{ borderColor: "#e5e7eb" }}
          />
        </div>
      </div>

      {/* 画像 */}
      <div className="rounded-2xl bg-white p-5 shadow-sm space-y-4">
        <h2 className="font-bold text-sm" style={{ color: "var(--color-text)" }}>
          画像
        </h2>

        <div className="flex gap-4">
          <ImageUpload
            label="ロゴ画像"
            preview={logoPreview}
            aspect="square"
            onFileSelect={(file) => {
              setLogoFile(file);
              setLogoPreview(URL.createObjectURL(file));
            }}
          />
          <div className="flex-1">
            <ImageUpload
              label="店舗外観写真"
              preview={photoPreview}
              aspect="landscape"
              onFileSelect={(file) => {
                setPhotoFile(file);
                setPhotoPreview(URL.createObjectURL(file));
              }}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl py-3 text-sm font-medium text-white transition-opacity"
        style={{ backgroundColor: saving ? "#9ca3af" : "var(--color-green)" }}
      >
        {saving ? "保存中..." : shop ? "変更を保存する" : "店舗を登録する"}
      </button>
    </form>
  );
}
