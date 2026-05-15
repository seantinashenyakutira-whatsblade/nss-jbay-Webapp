import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return NextResponse.redirect(new URL("/contact?error=Please fill in all required fields", request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({ name, email, phone: phone || null, message });

  if (error) {
    console.error("Contact form error:", error);
    return NextResponse.redirect(new URL("/contact?error=Failed to send message", request.url));
  }

  return NextResponse.redirect(new URL("/contact?success=Thank you! We will get back to you soon.", request.url));
}
