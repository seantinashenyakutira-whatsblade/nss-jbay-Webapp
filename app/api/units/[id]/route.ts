import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const DURATION_DISCOUNTS: Record<number, number> = { 1: 0, 3: 5, 6: 10, 12: 15 };

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const { data: unit } = await supabase
      .from("units")
      .select("*")
      .eq("id", params.id)
      .single();

    if (!unit) {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    const pricing = Object.entries(DURATION_DISCOUNTS).map(([months, discount]) => {
      const monthlyRate = Number(unit.price_monthly);
      const subtotal = monthlyRate * parseInt(months);
      const discountAmount = Math.round(subtotal * discount / 100);
      return {
        months: parseInt(months),
        discount,
        monthlyRate,
        subtotal,
        discountAmount,
        total: subtotal - discountAmount,
      };
    });

    return NextResponse.json({ unit, pricing });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
