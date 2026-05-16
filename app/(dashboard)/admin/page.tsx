import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/Button";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirect=/admin&domain=hub");

  const { data: profile, error: profileError } = await supabase.from("profiles").select("is_admin").eq("id", user!.id).single();
  if (profileError) console.error("Failed to fetch profile:", profileError);
  if (!profile?.is_admin) redirect("/dashboard");

  const { data: bookings, error: bookingsError } = await supabase.from("bookings").select("*");
  if (bookingsError) console.error("Failed to fetch bookings:", bookingsError);

  const { data: pendingPayments, error: paymentsError } = await supabase.from("payments").select("amount").eq("status", "pending");
  if (paymentsError) console.error("Failed to fetch payments:", paymentsError);

  const safeBookings = bookings || [];
  const safePendingPayments = pendingPayments || [];
  const totalBookings = safeBookings.length;
  const monthlyRevenue = safePendingPayments.reduce((s: number, p: any) => s + (parseFloat(p.amount) || 0), 0);

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
        <StatsCard value={`R ${monthlyRevenue.toLocaleString("en-ZA")}`} label="Monthly Revenue" />
        <StatsCard value="0%" label="Occupancy Rate" />
        <StatsCard value="0" label="Pending" color="#f59e0b" />
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
      </div>
    </div>
  );
}
