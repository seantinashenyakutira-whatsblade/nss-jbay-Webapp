import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { sanitizeInput, validateEmail } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = sanitizeInput(body.email || "");
    const password = body.password || "";
    const firstName = sanitizeInput(body.firstName || "");
    const lastName = sanitizeInput(body.lastName || "");

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName, last_name: lastName } },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Check your email to confirm your account" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
