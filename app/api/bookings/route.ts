import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { generateReference } from "@/lib/utils";

const DURATION_DISCOUNTS: Record<number, number> = { 1: 0, 3: 5, 6: 10, 12: 15 };
const VALID_DURATIONS = [1, 3, 6, 12];

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const unitId = body.unitId;
    const duration = parseInt(body.duration);
    const startDate = body.startDate;

    if (!unitId || !duration || !startDate || !VALID_DURATIONS.includes(duration)) {
      return NextResponse.json({ error: "Invalid booking details" }, { status: 400 });
    }

    const { data: unit } = await supabase.from("units").select("*").eq("id", unitId).single();
    if (!unit || unit.availability === "rented") {
      return NextResponse.json({ error: "Unit is not available" }, { status: 400 });
    }

    const monthlyRate = Number(unit.price_monthly);
    const discountPercent = DURATION_DISCOUNTS[duration] || 0;
    const subtotal = monthlyRate * duration;
    const discountAmount = Math.round(subtotal * discountPercent / 100);
    const totalAmount = subtotal - discountAmount;
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + duration);

    const reference = generateReference();

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        unit_id: unitId,
        reference,
        start_date: startDate,
        duration_months: duration,
        end_date: endDate.toISOString().split("T")[0],
        monthly_rate: monthlyRate,
        total_amount: totalAmount,
        discount_applied: discountAmount,
        status: "pending_payment",
      })
      .select()
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }

    return NextResponse.json({ success: true, booking });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
