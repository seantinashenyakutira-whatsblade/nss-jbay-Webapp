import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { sanitizeInput } from "@/lib/sanitize";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: settings } = await supabase
      .from("settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (!settings) {
      return NextResponse.json({ error: "Settings not found" }, { status: 404 });
    }

    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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
    const settings = {
      business_name: sanitizeInput(body.business_name || ""),
      location: sanitizeInput(body.location || ""),
      address: sanitizeInput(body.address || ""),
      phone_primary: sanitizeInput(body.phone_primary || ""),
      phone_secondary: sanitizeInput(body.phone_secondary || ""),
      email: sanitizeInput(body.email || ""),
      facebook_url: sanitizeInput(body.facebook_url || ""),
      operating_hours: body.operating_hours,
    };

    const { error } = await supabase
      .from("settings")
      .update(settings)
      .eq("id", 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Settings updated" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
