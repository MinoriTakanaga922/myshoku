/**
 * MYSHOKU マルシェ セットアップスクリプト
 * 実行: node scripts/setup-db.mjs
 *
 * 必要: .env.local に SUPABASE_SERVICE_ROLE_KEY=xxx を追加しておくこと
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// .env.local を手動パース
function loadEnv() {
  const envPath = resolve(__dirname, "../.env.local");
  const content = readFileSync(envPath, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx > 0) {
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim();
        env[key] = value;
      }
    }
  }
  return env;
}

const env = loadEnv();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ エラー: .env.local に以下を追加してください:");
  console.error("   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Supabase Management API でSQL実行 ──────────────────────────
const PROJECT_REF = SUPABASE_URL.replace("https://", "").replace(".supabase.co", "");

async function execSQL(sql, description) {
  process.stdout.write(`  ${description}... `);
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Management APIには Personal Access Token が必要
        // service_role キーでは動かないため、PAT方式を試みる
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ query: sql }),
    }
  );
  if (res.ok) {
    console.log("✅");
    return true;
  }
  // フォールバック: PostgreSQL直接接続（supabase-jsのrpc経由）
  console.log("⚠️ 管理API不可（service_role経由で続行）");
  return false;
}

// ── Storage バケット作成 ─────────────────────────────────────
async function createStorageBucket() {
  process.stdout.write("  Storage バケット 'shop-images' 作成... ");
  const { data, error } = await supabase.storage.createBucket("shop-images", {
    public: true,
    fileSizeLimit: 10485760, // 10MB
  });
  if (error && !error.message.includes("already exists") && !error.message.includes("Duplicate")) {
    console.log(`❌ ${error.message}`);
    return false;
  }
  console.log("✅");
  return true;
}

// ── Storage ポリシー設定 ──────────────────────────────────────
async function setupStoragePolicies() {
  // supabase-js でポリシーを確認
  process.stdout.write("  Storage ポリシー確認... ");
  const { data } = await supabase.storage.getBucket("shop-images");
  if (data?.public) {
    console.log("✅ (パブリックバケット確認)");
  } else {
    console.log("⚠️ バケットが非公開です");
  }
}

// ── Auth ユーザー作成 ─────────────────────────────────────────
async function createVendorAccount(email, password, shopName) {
  process.stdout.write(`  出店者アカウント作成 [${email}]... `);
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { shop_name: shopName },
  });
  if (error) {
    if (error.message.includes("already been registered") || error.message.includes("already exists")) {
      console.log("✅ (既存)");
    } else {
      console.log(`❌ ${error.message}`);
    }
    return null;
  }
  console.log("✅");
  return data.user;
}

// ── テーブル存在確認 ─────────────────────────────────────────
async function checkTablesExist() {
  const { error } = await supabase.from("shops").select("id").limit(1);
  return !error || !error.message.includes("does not exist");
}

// ── メイン処理 ───────────────────────────────────────────────
console.log("\n🚀 MYSHOKU マルシェ セットアップ開始\n");
console.log(`📡 プロジェクト: ${PROJECT_REF}\n`);

// 1. テーブル確認
process.stdout.write("📋 テーブル確認... ");
const tablesExist = await checkTablesExist();
if (tablesExist) {
  console.log("✅ shops/menu_items テーブルが存在します");
} else {
  console.log("❌ テーブルが存在しません");
  console.log("\n⚠️  テーブルはSupabase SQL Editorから作成が必要です。");
  console.log("   以下のURLでSQL Editorを開いてください:");
  console.log(`   https://supabase.com/dashboard/project/${PROJECT_REF}/sql`);
  console.log("\n   以下のSQLを実行してください (supabase/schema.sql の内容):");
  console.log("─".repeat(60));
  const schema = readFileSync(resolve(__dirname, "../supabase/schema.sql"), "utf-8");
  // テーブル部分のみ表示（Storageコメント以前）
  const tablePart = schema.split("-- =============================================\n-- Storage")[0];
  console.log(tablePart);
  console.log("─".repeat(60));
}

// 2. Storage バケット作成
console.log("\n📦 Storage セットアップ:");
await createStorageBucket();
await setupStoragePolicies();

// 3. 出店者アカウント作成
console.log("\n👤 出店者アカウント:");

// デフォルトのテストアカウントを作成
// 実際の出店者はここに追加してください
const vendors = [
  { email: "vendor1@myshoku-marche.local", password: "MyShoku2026!", shopName: "テスト出店者1" },
];

for (const vendor of vendors) {
  await createVendorAccount(vendor.email, vendor.password, vendor.shopName);
}

console.log("\n────────────────────────────────────────");
console.log("✅ セットアップ完了!\n");
if (tablesExist) {
  console.log("📝 次のステップ:");
  console.log("   1. https://myshoku.vercel.app/admin/login にアクセス");
  console.log("   2. Email: vendor1@myshoku-marche.local");
  console.log("   3. Password: MyShoku2026!");
  console.log("   4. 店舗情報・メニューを登録してください\n");
} else {
  console.log("📝 次のステップ:");
  console.log("   1. 上記のSQLをSQL Editorで実行してください");
  console.log("   2. その後、このスクリプトを再度実行してください\n");
}
