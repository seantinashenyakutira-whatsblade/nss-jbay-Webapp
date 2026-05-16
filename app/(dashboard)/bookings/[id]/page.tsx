import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import { formatDate, formatCurrency, formatDateLong } from "@/lib/utils";

interface BookingDetailPageProps {
  params: { id: string };
}

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { redirect("/auth/login?redirect=/bookings&domain=hub"); return; }

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("*, units(*)")
    .eq("id", params.id)
    .single();

  if (bookingError) {
    console.error("Failed to fetch booking:", bookingError);
    return (
      <div>
        <a href="/bookings" className="inline-flex items-center gap-1.5 text-sm text-[#a09a95] hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to My Bookings
        </a>
        <div className="empty-state">
          <div className="empty-state__icon"><AlertTriangle className="w-16 h-16 mx-auto text-[#f59e0b]" /></div>
          <h3 className="empty-state__title">Unable to load booking details</h3>
          <p className="empty-state__text">Something went wrong. Please try again later.</p>
          <a href="/bookings" className="btn btn--primary">Back to Bookings</a>
        </div>
      </div>
    );
  }

  if (!booking || (booking.user_id !== user.id && !user.user_metadata?.is_admin)) {
    notFound();
  }

  const { data: payments, error: paymentsError } = await supabase
    .from("payments")
    .select("*")
    .eq("booking_id", params.id)
    .order("created_at", { ascending: false });

  if (paymentsError) console.error("Failed to fetch payments:", paymentsError);
  const safePayments = payments || [];

  const badgeMap: Record<string, "success" | "info" | "error"> = {
    active: "success", completed: "info", cancelled: "error", expired: "error",
  };

  return (
    <div>
      <a href="/bookings" className="inline-flex items-center gap-1.5 text-sm text-[#a09a95] hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to My Bookings
      </a>

      <div className="flex justify-between items-start flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-4xl mb-1">Booking Details</h1>
          <p className="font-mono text-sm text-[#6b6560]">Reference: {booking.reference}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={badgeMap[booking.status] || "info"}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="grid grid--2 gap-6 mb-8">
        <div className="card card--static rounded-md">
          <div className="card__body">
            <h4 className="text-lg mb-3">Unit Information</h4>
            <div className="space-y-2 text-sm text-[#a09a95]">
              <p><strong className="text-white">Unit:</strong> {booking.units?.name || "N/A"}</p>
              <p><strong className="text-white">Size:</strong> {booking.units?.sqm ? `${booking.units.sqm} m² (${booking.units.dimensions})` : "N/A"}</p>
              {booking.units?.block_section && <p><strong className="text-white">Block:</strong> {booking.units.block_section}</p>}
              <p><strong className="text-white">Monthly Rate:</strong> {formatCurrency(booking.monthly_rate)}</p>
            </div>
          </div>
        </div>

        <div className="card card--static rounded-md">
          <div className="card__body">
            <h4 className="text-lg mb-3">Rental Period</h4>
            <div className="space-y-2 text-sm text-[#a09a95]">
              <p><strong className="text-white">Start:</strong> {formatDateLong(booking.start_date)}</p>
              <p><strong className="text-white">End:</strong> {formatDateLong(booking.end_date)}</p>
              <p><strong className="text-white">Duration:</strong> {booking.duration_months} Month{booking.duration_months > 1 ? "s" : ""}</p>
              <p><strong className="text-white">Created:</strong> {formatDateLong(booking.created_at)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card card--static rounded-md mb-6">
        <div className="card__body">
          <h4 className="text-lg mb-3">Payment Summary</h4>
          <div className="space-y-2 text-sm text-[#a09a95]">
            <div className="flex justify-between"><span>Monthly Rate (&times;{booking.duration_months})</span><span>{formatCurrency(booking.monthly_rate * booking.duration_months)}</span></div>
            {booking.discount_applied > 0 && (
              <div className="flex justify-between"><span>Discount</span><span className="text-[#22c55e]">&minus;{formatCurrency(booking.discount_applied)}</span></div>
            )}
            <div className="flex justify-between text-lg font-medium border-t border-[#2a2a2a] pt-3 mt-3">
              <span className="text-white">Total</span>
              <span className="text-[#D4006A]">{formatCurrency(booking.total_amount)}</span>
            </div>
          </div>
        </div>
      </div>

      {safePayments.length > 0 && (
        <div className="card card--static rounded-md mb-6">
          <div className="card__body">
            <h4 className="text-lg mb-3">Payment History</h4>
            {safePayments.map((p: any) => {
              const pMap: Record<string, "success" | "warning" | "error" | "info"> = {
                pending: "warning", completed: "success", failed: "error", refunded: "info",
              };
              return (
                <div key={p.id} className="flex justify-between items-center py-3 border-b border-[#2a2a2a] last:border-b-0">
                  <div>
                    <p className="font-mono text-sm">{p.reference}</p>
                    <p className="text-xs text-[#6b6560]">{formatDate(p.created_at)}</p>
                    {p.card_brand && <p className="text-xs text-[#6b6560] mt-0.5">{p.card_brand.charAt(0).toUpperCase() + p.card_brand.slice(1)} ****{p.card_last_four}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-[#D4006A] font-heading">{formatCurrency(p.amount)}</p>
                    <Badge variant={pMap[p.status] || "info"}>{p.status}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <Button href="/bookings" variant="outline">Back to Bookings</Button>
        {booking.status === "active" && (
          <>
            <Button href={`/payments/pay/${booking.id}`} variant="primary">Make Payment</Button>
            <form action={`/api/bookings/${booking.id}/cancel`} method="POST" className="inline">
              <Button type="submit" variant="ghost" className="text-[#ef4444]">Cancel Booking</Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
