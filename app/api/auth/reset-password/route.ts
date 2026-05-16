import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { sanitizeInput, validateEmail } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = sanitizeInput(body.email || "");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${request.nextUrl.origin}/auth/reset-password`,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Check your email for the reset link" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
