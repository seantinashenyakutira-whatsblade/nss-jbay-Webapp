import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/auth/login", request.url));

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) return NextResponse.redirect(new URL("/dashboard", request.url));

  const formData = await request.formData();
  const method = formData.get("_method") as string;

  if (method === "DELETE") {
    const { error } = await supabase.from("units").update({ is_active: false }).eq("id", params.id);
    if (error) {
      console.error("Failed to delete unit:", error);
      return NextResponse.redirect(new URL("/admin/units?error=Failed to delete unit", request.url));
    }
    return NextResponse.redirect(new URL("/admin/units?success=Unit deactivated", request.url));
  }

  return NextResponse.redirect(new URL("/admin/units?error=Invalid method", request.url));
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
  const availability = formData.get("availability") as string;
  const features = formData.getAll("features") as string[];

  const { error } = await supabase.from("units").update({
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
    updated_at: new Date().toISOString(),
  }).eq("id", params.id);

  if (error) {
    console.error("Failed to update unit:", error);
    return NextResponse.redirect(new URL(`/admin/units/${params.id}/edit?error=Failed to update unit`, request.url));
  }

  return NextResponse.redirect(new URL("/admin/units?success=Unit updated", request.url));
}
