import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const DURATION_DISCOUNTS: Record<number, number> = { 1: 0, 3: 5, 6: 10, 12: 15 };
const VALID_DURATIONS = [1, 3, 6, 12];

function generateReference() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "NSS-";
  for (let i = 0; i < 8; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));
  return ref;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/auth/login", request.url));

  const formData = await request.formData();
  const unitId = formData.get("unitId") as string;
  const duration = parseInt(formData.get("duration") as string);
  const startDate = formData.get("startDate") as string;

  if (!unitId || !duration || !startDate || !VALID_DURATIONS.includes(duration)) {
    return NextResponse.redirect(new URL("/bookings/new?error=Invalid input", request.url));
  }

  const { data: unit } = await supabase.from("units").select("*").eq("id", unitId).single();
  if (!unit || unit.availability === "rented") {
    return NextResponse.redirect(new URL("/bookings/new?error=Unit unavailable", request.url));
  }

  const monthlyRate = parseFloat(unit.price_monthly);
  const discountPercent = DURATION_DISCOUNTS[duration] || 0;
  const subtotal = monthlyRate * duration;
  const discountAmount = Math.round(subtotal * discountPercent / 100);
  const totalAmount = subtotal - discountAmount;
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + duration);

  const reference = generateReference();

  const { data: booking, error: bookingError } = await supabase.from("bookings").insert({
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
  }).select().single();

  if (bookingError || !booking) {
    console.error("Booking creation error:", bookingError);
    return NextResponse.redirect(new URL("/bookings/new?error=Booking failed", request.url));
  }

  return NextResponse.redirect(new URL(`/payments/pay/${booking.id}`, request.url));
}
