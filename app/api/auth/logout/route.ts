import { createClient } from "@/lib/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { supabase, response } = createClient(request);
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", request.url));
}
