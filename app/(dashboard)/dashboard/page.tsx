import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { formatCurrency } from "@/lib/utils";
import { Package, Calendar, CreditCard } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard");
    return;
  }

  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select("*, units(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  if (bookingsError) console.error("Failed to fetch bookings:", bookingsError);

  const { data: payments, error: paymentsError } = await supabase
    .from("payments")
    .select("amount")
    .eq("user_id", user.id)
    .eq("status", "completed");

  if (paymentsError) console.error("Failed to fetch payments:", paymentsError);

  const safeBookings = bookings || [];
  const safePayments = payments || [];
  const activeRentals = safeBookings.filter((b: any) => b.status === "active").length;
  const totalSpent = safePayments.reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0);

  const nextPaymentBooking = safeBookings.find((b: any) => b.status === "active");
  const nextPayment = nextPaymentBooking ? parseFloat(nextPaymentBooking.total_amount || 0) : 0;

  const recentActivity = safeBookings.slice(0, 5).map((b: any) => ({
    date: b.created_at,
    description: `${b.status === "cancelled" ? "Cancelled" : "Booked"} ${b.units?.name || "Unit"} (${b.reference || "N/A"})`,
    status: b.status,
  }));

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl mb-1">Welcome back, {user.user_metadata?.first_name || user.email?.split("@")[0] || "Guest"}</h1>
          <p className="text-[#a09a95]">Here&apos;s an overview of your account</p>
        </div>
        <a href="/units" className="btn btn--primary">Rent New Unit</a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard value={activeRentals} label="Active Rentals" />
        <StatsCard value={formatCurrency(nextPayment)} label="Next Payment Due" />
        <StatsCard value={formatCurrency(totalSpent)} label="Total Spent" />
        <StatsCard value="Active" label="Account Status" color="#22c55e" />
      </div>

      <div className="grid grid--2 gap-6 mt-8">
        <div className="card card--static rounded-md">
          <div className="card__body">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg">Recent Activity</h4>
              <a href="/bookings" className="btn btn--ghost btn--sm">View All</a>
            </div>
            <ActivityFeed activities={recentActivity} />
          </div>
        </div>

        <div className="card card--static rounded-md">
          <div className="card__body">
            <h4 className="text-lg mb-4">Quick Actions</h4>
            <QuickActions />
          </div>
        </div>
      </div>

      <div className="card card--static rounded-md mt-6">
        <div className="card__body">
          <h4 className="text-lg mb-4">Account Info</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="font-mono text-xs text-[#6b6560] uppercase">Name</span>
              <p className="text-sm text-white mt-1">{user.user_metadata?.first_name || ""} {user.user_metadata?.last_name || ""}</p>
            </div>
            <div>
              <span className="font-mono text-xs text-[#6b6560] uppercase">Email</span>
              <p className="text-sm text-white mt-1">{user.email}</p>
            </div>
            <div>
              <span className="font-mono text-xs text-[#6b6560] uppercase">Phone</span>
              <p className="text-sm text-white mt-1">{user.user_metadata?.phone || "Not set"}</p>
            </div>
            <div>
              <span className="font-mono text-xs text-[#6b6560] uppercase">Member Since</span>
              <p className="text-sm text-white mt-1">{user.created_at ? new Date(user.created_at).toLocaleDateString("en-ZA", { month: "long", year: "numeric" }) : "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
