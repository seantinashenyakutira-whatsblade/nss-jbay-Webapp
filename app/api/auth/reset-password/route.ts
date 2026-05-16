import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const formData = await request.formData();
  const email = formData.get("email") as string;

  if (!email) {
    return NextResponse.redirect(new URL("/auth/forgot-password?error=Email is required", request.url));
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${request.nextUrl.origin}/auth/reset-password`,
  });

  if (error) {
    console.error("Password reset error:", error);
    return NextResponse.redirect(new URL(`/auth/forgot-password?error=${encodeURIComponent(error.message)}`, request.url));
  }

  return NextResponse.redirect(new URL("/auth/forgot-password?success=Check your email for reset link", request.url));
}
