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
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocal = process.env.NODE_ENV === "development";
      const redirectUrl = isLocal
        ? `${origin}${next}`
        : `https://${forwardedHost}${next}`;
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.redirect(new URL("/auth/login?error=Auth+failed", origin));
}
