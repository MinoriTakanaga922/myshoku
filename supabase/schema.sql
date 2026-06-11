-- =============================================
-- MYSHOKU マルシェ アレルギー対応ツール DB スキーマ
-- =============================================

-- 店舗テーブル
create table if not exists shops (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  logo_url text,
  photo_url text,
  category text,
  contact text,
  created_at timestamptz default now()
);

-- メニューテーブル
create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id) on delete cascade not null,
  name text not null,
  description text,
  price integer,
  photo_url text,
  ingredients_text text,
  ingredients_image_url text,
  allergens text[] default '{}',  -- 含むアレルゲン (ALLERGENS 配列の値を使用)
  created_at timestamptz default now()
);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

alter table shops enable row level security;
alter table menu_items enable row level security;

-- 来場者: 全店舗の閲覧可能
create policy "shops: public read" on shops
  for select using (true);

-- 出店者: 自分の店舗のみ操作可能
create policy "shops: owner insert" on shops
  for insert with check (auth.uid() = user_id);

create policy "shops: owner update" on shops
  for update using (auth.uid() = user_id);

create policy "shops: owner delete" on shops
  for delete using (auth.uid() = user_id);

-- 来場者: 全メニューの閲覧可能
create policy "menu_items: public read" on menu_items
  for select using (true);

-- 出店者: 自分の店舗のメニューのみ操作可能
create policy "menu_items: owner insert" on menu_items
  for insert with check (
    shop_id in (select id from shops where user_id = auth.uid())
  );

create policy "menu_items: owner update" on menu_items
  for update using (
    shop_id in (select id from shops where user_id = auth.uid())
  );

create policy "menu_items: owner delete" on menu_items
  for delete using (
    shop_id in (select id from shops where user_id = auth.uid())
  );

-- =============================================
-- Storage バケット設定
-- =============================================
-- Supabase ダッシュボードで以下を手動設定してください:
--
-- 1. Storage > New bucket
--    - Name: shop-images
--    - Public bucket: ✅ ON
--
-- 2. Storage Policies (shop-images バケット):
--    - 認証済みユーザーはアップロード可能
--    - 全員が閲覧可能（パブリックバケット）
--
-- ダッシュボードで Storage > shop-images > Policies から
-- 以下ポリシーを追加してください:
--
-- INSERT policy:
--   Name: "Authenticated users can upload"
--   Target roles: authenticated
--   WITH CHECK: true
--
-- UPDATE policy:
--   Name: "Authenticated users can update their files"
--   Target roles: authenticated
--   USING: (storage.foldername(name))[1] = auth.uid()::text
--
-- DELETE policy:
--   Name: "Authenticated users can delete their files"
--   Target roles: authenticated
--   USING: (storage.foldername(name))[1] = auth.uid()::text
