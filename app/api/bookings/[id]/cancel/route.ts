import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/auth/login", request.url));

  const { data: booking } = await supabase.from("bookings").select("*").eq("id", params.id).single();
  if (!booking || (booking.user_id !== user.id && !user.user_metadata?.is_admin)) {
    return NextResponse.redirect(new URL("/bookings", request.url));
  }

  await supabase.from("bookings").update({ status: "cancelled", updated_at: new Date().toISOString() }).eq("id", params.id);

  const hubDomain = `https://hub.${process.env.NEXT_PUBLIC_MAIN_DOMAIN || "example.com"}`;
  return NextResponse.redirect(new URL("/bookings", hubDomain));
}
