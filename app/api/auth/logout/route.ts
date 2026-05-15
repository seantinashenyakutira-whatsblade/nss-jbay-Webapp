import { createClient } from "@/lib/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { supabase, response } = createClient(request);
  await supabase.auth.signOut();
  const mainDomain = `https://${process.env.NEXT_PUBLIC_MAIN_DOMAIN || "example.com"}`;
  return NextResponse.redirect(new URL("/", mainDomain));
}
