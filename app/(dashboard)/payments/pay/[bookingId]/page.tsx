import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { PaymentForm } from "./PaymentForm";
import { AlertTriangle } from "lucide-react";

interface PayPageProps {
  params: { bookingId: string };
}

export default async function PayPage({ params }: PayPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { redirect("/auth/login?redirect=/payments/pay/__BOOKING_ID__"); return; }

  const { data: booking, error } = await supabase
    .from("bookings")
    .select("*, units(*)")
    .eq("id", params.bookingId)
    .single();

  if (error) {
    console.error("Failed to fetch booking:", error);
    return (
      <div>
        <div className="empty-state">
          <div className="empty-state__icon"><AlertTriangle className="w-16 h-16 mx-auto text-[#f59e0b]" /></div>
          <h3 className="empty-state__title">Unable to load payment details</h3>
          <p className="empty-state__text">Something went wrong. Please try again later.</p>
          <a href="/bookings" className="btn btn--primary">Back to Bookings</a>
        </div>
      </div>
    );
  }

  if (!booking || (booking.user_id !== user.id && !user.user_metadata?.is_admin)) {
    notFound();
  }

  return <PaymentForm booking={booking} />;
}
