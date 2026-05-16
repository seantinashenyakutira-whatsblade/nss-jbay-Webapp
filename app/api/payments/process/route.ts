import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { bookingId, cardLastFour, cardBrand, amount } = body;

    if (!bookingId || !cardLastFour || !cardBrand || !/^\d{4}$/.test(cardLastFour)) {
      return NextResponse.json({ error: "Invalid payment details" }, { status: 400 });
    }

    const { data: booking } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (!booking || booking.user_id !== user.id) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const isSuccessful = Math.random() < 0.85;
    const reference = "PAY-" + uuidv4().toUpperCase().slice(0, 8);

    if (!isSuccessful) {
      await supabase.from("payments").insert({
        booking_id: bookingId,
        user_id: user.id,
        amount: Number(amount),
        payment_method: "card",
        card_last_four: cardLastFour,
        card_brand: cardBrand,
        status: "failed",
        reference: `FAIL-${uuidv4().toUpperCase().slice(0, 8)}`,
      });
      return NextResponse.json({ success: false, message: "Card declined. This is a simulated payment for demo purposes." });
    }

    await supabase.from("payments").insert({
      booking_id: bookingId,
      user_id: user.id,
      amount: Number(amount),
      payment_method: "card",
      card_last_four: cardLastFour,
      card_brand: cardBrand,
      status: "completed",
      reference,
    });

    await supabase.from("bookings").update({ status: "active" }).eq("id", bookingId);
    await supabase.from("units").update({ availability: "rented" }).eq("id", booking.unit_id);

    return NextResponse.json({
      success: true,
      reference,
      message: `Payment of R${amount} processed successfully. This is a simulated payment for demo purposes.`,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
