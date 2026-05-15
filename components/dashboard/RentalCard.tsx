import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, formatCurrency } from "@/lib/utils";

interface RentalCardProps {
  booking: {
    id: string;
    reference: string;
    status: string;
    start_date: string;
    end_date: string;
    duration_months: number;
    total_amount: number;
    units?: { name?: string; sqm?: number } | null;
  };
}

export function RentalCard({ booking }: RentalCardProps) {
  const badgeMap: Record<string, "success" | "info" | "error"> = {
    active: "success",
    completed: "info",
    cancelled: "error",
    expired: "error",
  };

  return (
    <div className="card card--static rounded-md mb-4" data-status={booking.status}>
      <div className="card__body">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h4 className="text-lg font-medium text-white">{booking.units?.name || "Storage Unit"}</h4>
            <p className="text-sm text-[#a09a95] mt-1">
              <span className="font-mono">{booking.reference}</span> &middot; {booking.units?.sqm ? `${booking.units.sqm} m²` : ""}
            </p>
          </div>
          <Badge variant={badgeMap[booking.status] || "info"}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-[#2a2a2a] mb-4">
          <div>
            <span className="font-mono text-xs text-[#6b6560] uppercase">Start Date</span>
            <p className="text-sm text-white mt-1">{formatDate(booking.start_date)}</p>
          </div>
          <div>
            <span className="font-mono text-xs text-[#6b6560] uppercase">End Date</span>
            <p className="text-sm text-white mt-1">{formatDate(booking.end_date)}</p>
          </div>
          <div>
            <span className="font-mono text-xs text-[#6b6560] uppercase">Duration</span>
            <p className="text-sm text-white mt-1">{booking.duration_months} Month{booking.duration_months > 1 ? "s" : ""}</p>
          </div>
          <div>
            <span className="font-mono text-xs text-[#6b6560] uppercase">Total</span>
            <p className="text-sm text-[#D4006A] mt-1">{formatCurrency(booking.total_amount)}</p>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button href={`/bookings/${booking.id}`} variant="outline" size="sm">View Details</Button>
          {booking.status === "active" && (
            <>
              <Button href={`/payments/pay/${booking.id}`} variant="primary" size="sm">Pay Now</Button>
              <form action={`/api/bookings/${booking.id}/cancel`} method="POST" className="inline">
                <Button type="submit" variant="ghost" size="sm" className="text-[#ef4444]">Cancel</Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
