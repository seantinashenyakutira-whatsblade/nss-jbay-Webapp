import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: booking } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", params.id)
      .single();

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (booking.user_id !== user.id && !profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error: updateError } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", params.id);

    if (updateError) {
      return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Booking cancelled" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
