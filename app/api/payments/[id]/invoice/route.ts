import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: payment } = await supabase
    .from("payments")
    .select("*, bookings(reference, total_amount, units(name))")
    .eq("id", params.id)
    .single();

  if (!payment || (payment.user_id !== user.id && !user.user_metadata?.is_admin)) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, payment });
}
