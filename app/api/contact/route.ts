import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { sanitizeInput, validateEmail, validatePhone } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = sanitizeInput(body.name || "");
    const email = sanitizeInput(body.email || "");
    const phone = body.phone ? sanitizeInput(body.phone) : null;
    const message = sanitizeInput(body.message || "");

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (phone && !validatePhone(phone)) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("contact_messages")
      .insert({ name, email, phone, message });

    if (error) {
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Thank you! We will get back to you soon." });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
