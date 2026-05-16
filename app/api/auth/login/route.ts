import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { sanitizeInput, validateEmail } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = sanitizeInput(body.email || "");
    const password = body.password || "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ success: true, user: data.user });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
