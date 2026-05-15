import { createClient } from "@/lib/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const { supabase, response } = createClient(request);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const hubDomain = `https://hub.${process.env.NEXT_PUBLIC_MAIN_DOMAIN || "example.com"}`;
      return NextResponse.redirect(new URL(next, hubDomain));
    }
  }

  return NextResponse.redirect(new URL("/auth/login?error=Auth failed", origin));
}
