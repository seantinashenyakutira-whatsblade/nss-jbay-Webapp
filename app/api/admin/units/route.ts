import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/auth/login", request.url));

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) return NextResponse.redirect(new URL("/dashboard", request.url));

  const formData = await request.formData();
  const name = formData.get("name") as string;
  const size = formData.get("size") as string;
  const sqm = parseInt(formData.get("sqm") as string);
  const dimensions = formData.get("dimensions") as string;
  const price_monthly = parseInt(formData.get("price_monthly") as string);
  const price_annual = formData.get("price_annual") ? parseInt(formData.get("price_annual") as string) : null;
  const description = formData.get("description") as string;
  const block_section = formData.get("block_section") as string;
  const availability = formData.get("availability") as string || "available";
  const features = formData.getAll("features") as string[];

  if (!name || !size || !sqm || !dimensions || !price_monthly) {
    return NextResponse.redirect(new URL("/admin/units/new?error=Missing required fields", request.url));
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
    console.error("Failed to create unit:", error);
    return NextResponse.redirect(new URL("/admin/units/new?error=Failed to create unit", request.url));
  }

  return NextResponse.redirect(new URL("/admin/units?success=Unit created", request.url));
}
