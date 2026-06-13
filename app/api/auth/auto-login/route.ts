import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: "メールアドレスが必要です" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // ユーザーが存在しない場合は作成（既存の場合はエラーを無視）
  await supabase.auth.admin.createUser({ email, email_confirm: true });

  // メールを送らずにログインリンクをサーバー側で生成
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: "https://myshoku.vercel.app/auth/callback" },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ url: data.properties.action_link });
}
