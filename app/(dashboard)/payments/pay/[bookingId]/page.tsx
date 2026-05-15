import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { PaymentForm } from "./PaymentForm";

interface PayPageProps {
  params: { bookingId: string };
}

export default async function PayPage({ params }: PayPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { redirect("/auth/login?redirect=/payments/pay/__BOOKING_ID__&domain=hub"); return; }

  const { data: booking } = await supabase
    .from("bookings")
    .select("*, units(*)")
    .eq("id", params.bookingId)
    .single();

  if (!booking || (booking.user_id !== user.id && !user.user_metadata?.is_admin)) {
    notFound();
  }

  return <PaymentForm booking={booking} />;
}
