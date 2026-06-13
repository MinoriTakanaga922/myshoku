import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// PowerShell経由でenv varが登録された場合にBOM(U+FEFF)が混入するため除去
function cleanEnv(key: string | undefined): string {
  return (key ?? "").replace(/^﻿/, "").trim();
}

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: "メールアドレスが必要です" }, { status: 400 });
  }

  const supabaseUrl = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceKey  = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const anonKey     = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!supabaseUrl || !serviceKey || !anonKey) {
    return NextResponse.json({ error: "サーバー設定エラー: 環境変数が未設定" }, { status: 500 });
  }

  const admin = createAdminClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // ユーザーが存在しない場合は作成（既存の場合はエラーを無視）
  await admin.auth.admin.createUser({ email, email_confirm: true });

  // メールを送らずリンクトークンをサーバー側で生成
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  if (linkError || !linkData?.properties?.hashed_token) {
    return NextResponse.json(
      { error: linkError?.message ?? "トークン生成失敗" },
      { status: 400 }
    );
  }

  // トークンをサーバー側で検証してセッションCookieをセット
  const response = NextResponse.json({ success: true });

  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll: () => [],
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error: verifyError } = await supabase.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: "magiclink",
  });

  if (verifyError) {
    return NextResponse.json({ error: verifyError.message }, { status: 400 });
  }

  return response;
}
