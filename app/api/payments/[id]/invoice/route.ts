import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoiceDocument } from "@/lib/pdf/invoice";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: payment } = await supabase
    .from("payments")
    .select("*, bookings(reference, total_amount, duration_months, monthly_rate, discount_applied, start_date, end_date, units(name, size)), profiles(first_name, last_name, email)")
    .eq("id", params.id)
    .single();

  if (!payment || (payment.user_id !== user.id && !user.user_metadata?.is_admin)) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  const booking = payment.bookings;
  const profile = payment.profiles;

  const invoiceData = {
    reference: booking?.reference || "N/A",
    date: new Date(payment.created_at).toLocaleDateString("en-ZA"),
    customerName: `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() || "Customer",
    customerEmail: profile?.email || user.email || "",
    unitName: booking?.units?.name || "Storage Unit",
    unitSize: booking?.units?.size || "",
    startDate: booking?.start_date ? new Date(booking.start_date).toLocaleDateString("en-ZA") : "N/A",
    endDate: booking?.end_date ? new Date(booking.end_date).toLocaleDateString("en-ZA") : "N/A",
    duration: booking?.duration_months || 1,
    monthlyRate: booking?.monthly_rate || 0,
    discount: booking?.discount_applied || 0,
    total: booking?.total_amount || payment.amount || 0,
    paymentReference: payment.reference || "N/A",
    paymentDate: new Date(payment.created_at).toLocaleDateString("en-ZA"),
    paymentMethod: payment.card_brand ? `${payment.card_brand} ****${payment.card_last_four}` : payment.payment_method || "Card",
  };

  try {
    const pdfBuffer = await renderToBuffer(React.createElement(InvoiceDocument, { data: invoiceData }));
    return new NextResponse(Buffer.from(pdfBuffer) as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${payment.reference || params.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 });
  }
}
