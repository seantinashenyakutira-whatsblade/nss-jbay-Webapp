import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirect=/admin");

  const { data: profile, error: profileError } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (profileError) console.error("Failed to fetch profile:", profileError);
  if (!profile?.is_admin) redirect("/dashboard");

  const { data: bookings, error: bookingsError } = await supabase.from("bookings").select("status, total_amount");
  if (bookingsError) console.error("Failed to fetch bookings:", bookingsError);

  const { data: units, error: unitsError } = await supabase.from("units").select("availability, is_active");
  if (unitsError) console.error("Failed to fetch units:", unitsError);

  const { data: payments, error: paymentsError } = await supabase.from("payments").select("amount, status");
  if (paymentsError) console.error("Failed to fetch payments:", paymentsError);

  const safeBookings = bookings || [];
  const safeUnits = units || [];
  const safePayments = payments || [];

  const totalBookings = safeBookings.length;
  const activeBookings = safeBookings.filter((b: any) => b.status === "active").length;
  const pendingPayments = safePayments.filter((p: any) => p.status === "pending").length;
  const monthlyRevenue = safePayments.filter((p: any) => p.status === "completed").reduce((s: number, p: any) => s + (p.amount || 0), 0);
  const totalUnits = safeUnits.filter((u: any) => u.is_active).length;
  const availableUnits = safeUnits.filter((u: any) => u.is_active && u.availability === "available").length;
  const occupancyRate = totalUnits > 0 ? Math.round(((totalUnits - availableUnits) / totalUnits) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl mb-1">Dashboard</h1>
          <p className="text-sm text-[#a09a95]">Facility overview</p>
        </div>
        <span className="font-mono text-xs text-[#6b6560]">{new Date().toLocaleDateString("en-ZA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard value={totalBookings} label="Total Bookings" />
        <StatsCard value={activeBookings} label="Active Rentals" />
        <StatsCard value={`${occupancyRate}%`} label="Occupancy Rate" />
        <StatsCard value={formatCurrency(monthlyRevenue)} label="Monthly Revenue" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <StatsCard value={totalUnits} label="Total Units" />
        <StatsCard value={availableUnits} label="Available Units" color="#22c55e" />
        <StatsCard value={pendingPayments} label="Pending Payments" color="#f59e0b" />
        <StatsCard value={totalUnits - availableUnits} label="Rented Units" color="#D4006A" />
      </div>

      <div className="grid grid--2 gap-6 mt-8">
        <div className="card card--static rounded-md">
          <div className="card__body">
            <h4 className="text-lg mb-4">Quick Actions</h4>
            <div className="flex flex-col gap-3">
              <Button href="/admin/units/new" variant="outline" size="sm">Add New Unit</Button>
              <Button href="/admin/bookings" variant="outline" size="sm">View All Bookings</Button>
              <Button href="/admin/settings" variant="outline" size="sm">Update Settings</Button>
            </div>
          </div>
        </div>

        <div className="card card--static rounded-md">
          <div className="card__body">
            <h4 className="text-lg mb-4">Recent Activity</h4>
            <div className="space-y-3">
              {safeBookings.slice(0, 5).map((b: any) => (
                <div key={b.id} className="flex justify-between items-center py-2 border-b border-[#2a2a2a] last:border-b-0">
                  <div>
                    <p className="text-sm text-white">{b.reference}</p>
                    <p className="text-xs text-[#6b6560]">{b.status}</p>
                  </div>
                  <span className="text-sm text-[#D4006A] font-heading">{formatCurrency(b.total_amount)}</span>
                </div>
              ))}
              {safeBookings.length === 0 && (
                <p className="text-sm text-[#6b6560] text-center py-4">No recent bookings</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
