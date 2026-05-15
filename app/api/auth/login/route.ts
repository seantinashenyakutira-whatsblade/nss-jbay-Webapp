import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, request.url));
  }

  const redirectTo = (formData.get("redirect") as string) || "/dashboard";
  const domain = (formData.get("domain") as string) || "hub";

  const hostname = request.headers.get("host") || "";
  const isLocalDev =
    hostname === "localhost" || hostname.startsWith("localhost:") || hostname === "127.0.0.1";
  const isVercelPreview = hostname.endsWith(".vercel.app");
  const isSingleOriginMode = isLocalDev || isVercelPreview;
  const hubOrigin = isSingleOriginMode
    ? `${request.nextUrl.protocol}//${hostname}`
    : `https://hub.${process.env.NEXT_PUBLIC_MAIN_DOMAIN || "example.com"}`;

  return NextResponse.redirect(new URL(redirectTo, domain === "hub" ? hubOrigin : request.nextUrl.origin));
}
