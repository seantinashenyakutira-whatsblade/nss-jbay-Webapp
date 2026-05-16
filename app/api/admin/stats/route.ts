import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: bookings } = await supabase.from("bookings").select("status, total_amount");
    const { data: units } = await supabase.from("units").select("availability, is_active");
    const { data: payments } = await supabase.from("payments").select("amount, status");

    const totalBookings = bookings?.length || 0;
    const activeBookings = bookings?.filter((b) => b.status === "active").length || 0;
    const pendingPayments = payments?.filter((p) => p.status === "pending").length || 0;
    const monthlyRevenue = payments?.filter((p) => p.status === "completed").reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
    const totalUnits = units?.filter((u) => u.is_active).length || 0;
    const availableUnits = units?.filter((u) => u.is_active && u.availability === "available").length || 0;
    const occupancyRate = totalUnits > 0 ? Math.round(((totalUnits - availableUnits) / totalUnits) * 100) : 0;

    return NextResponse.json({
      totalBookings,
      activeBookings,
      pendingPayments,
      monthlyRevenue,
      totalUnits,
      availableUnits,
      occupancyRate,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
