import { createClient } from "@/lib/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { supabase, response } = createClient(request);
  await supabase.auth.signOut();
  const hostname = request.headers.get("host") || "";
  const isSingleOriginMode = hostname === "localhost" || hostname.startsWith("localhost:") || hostname === "127.0.0.1" || hostname.endsWith(".vercel.app");
  const mainOrigin = isSingleOriginMode ? `${request.nextUrl.protocol}//${hostname}` : `https://${process.env.NEXT_PUBLIC_MAIN_DOMAIN || "example.com"}`;
  return NextResponse.redirect(new URL("/", mainOrigin));
}
