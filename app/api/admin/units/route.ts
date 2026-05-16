import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { sanitizeInput } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const name = sanitizeInput(body.name || "");
    const size = body.size;
    const sqm = parseInt(body.sqm);
    const dimensions = sanitizeInput(body.dimensions || "");
    const price_monthly = parseInt(body.price_monthly);
    const price_annual = body.price_annual ? parseInt(body.price_annual) : null;
    const description = sanitizeInput(body.description || "");
    const block_section = sanitizeInput(body.block_section || "");
    const availability = body.availability || "available";
    const features = Array.isArray(body.features) ? body.features : [];

    if (!name || !size || isNaN(sqm) || !dimensions || isNaN(price_monthly)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { error } = await supabase.from("units").insert({
      name,
      size,
      sqm,
      dimensions,
      price_monthly,
      price_annual,
      description,
      block_section,
      availability,
      features: features.length > 0 ? features : null,
      is_active: true,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Unit created" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
