import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

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
  if (!unit || unit.availability === "unavailable") {
    return NextResponse.redirect(new URL("/bookings/new?error=Unit unavailable", request.url));
  }

  const monthlyRate = parseFloat(unit.price_monthly);
  const discountPercent = DURATION_DISCOUNTS[duration] || 0;
  const subtotal = monthlyRate * duration;
  const discountAmount = Math.round(subtotal * discountPercent / 100);
  const totalAmount = subtotal - discountAmount;
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + duration);

  const { data: booking } = await supabase.from("bookings").insert({
    user_id: user.id,
    unit_id: unitId,
    reference: generateReference(),
    start_date: startDate,
    duration_months: duration,
    end_date: endDate.toISOString().split("T")[0],
    monthly_rate: monthlyRate,
    total_amount: totalAmount,
    discount_applied: discountAmount,
    status: "active",
  }).select().single();

  if (!booking) return NextResponse.redirect(new URL("/bookings/new?error=Booking failed", request.url));

  const hostname = request.headers.get("host") || "";
  const isSingleOriginMode = hostname === "localhost" || hostname.startsWith("localhost:") || hostname === "127.0.0.1" || hostname.endsWith(".vercel.app");
  const hubOrigin = isSingleOriginMode ? `${request.nextUrl.protocol}//${hostname}` : `https://hub.${process.env.NEXT_PUBLIC_MAIN_DOMAIN || "example.com"}`;
  return NextResponse.redirect(new URL(`/payments/pay/${booking.id}`, hubOrigin));
}
