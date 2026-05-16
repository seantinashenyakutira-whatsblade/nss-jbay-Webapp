import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Eye } from "lucide-react";

export default async function AdminBookingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirect=/admin/bookings");

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) redirect("/dashboard");

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*, units(name, size, sqm), profiles(first_name, last_name, email)")
    .order("created_at", { ascending: false });

  if (error) console.error("Failed to fetch bookings:", error);
  const safeBookings = bookings || [];

  const statusCounts = {
    all: safeBookings.length,
    active: safeBookings.filter((b: any) => b.status === "active").length,
    pending: safeBookings.filter((b: any) => b.status === "pending" || b.status === "pending_payment").length,
    completed: safeBookings.filter((b: any) => b.status === "completed").length,
    cancelled: safeBookings.filter((b: any) => b.status === "cancelled").length,
  };

  const badgeMap: Record<string, "success" | "warning" | "error" | "info"> = {
    pending: "warning",
    pending_payment: "warning",
    confirmed: "info",
    active: "success",
    completed: "info",
    cancelled: "error",
    expired: "error",
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl mb-1">Manage Bookings</h1>
          <p className="text-sm text-[#a09a95]">{safeBookings.length} total bookings</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-[#2a2a2a] pb-0 overflow-x-auto">
        {Object.entries(statusCounts).map(([tab, count]) => (
          <button
            key={tab}
            className={`tab-btn px-4 py-3 text-sm text-[#6b6560] border-b-2 border-transparent hover:text-[#a09a95] transition-colors whitespace-nowrap ${tab === "all" ? "!text-[#D4006A] !border-[#D4006A]" : ""}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace("_", " ")} ({count})
          </button>
        ))}
      </div>

      <div className="overflow-x-auto bg-[#1a1a1a] border border-[#2a2a2a] rounded-md">
        <table className="w-full">
          <thead>
            <tr>
              {["Reference", "Customer", "Unit", "Start Date", "Duration", "Amount", "Status", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left font-mono text-xs text-[#6b6560] uppercase tracking-wider bg-[#111] border-b border-[#2a2a2a]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {safeBookings.map((b: any) => (
              <tr key={b.id} className="border-b border-[#2a2a2a] last:border-b-0 hover:bg-[#111]">
                <td className="px-5 py-3.5 font-mono text-sm text-[#a09a95]">{b.reference}</td>
                <td className="px-5 py-3.5 text-sm text-white">{b.profiles?.first_name || "N/A"} {b.profiles?.last_name || ""}</td>
                <td className="px-5 py-3.5 text-sm text-[#a09a95]">{b.units?.name || "N/A"}</td>
                <td className="px-5 py-3.5 text-sm text-[#a09a95]">{formatDate(b.start_date)}</td>
                <td className="px-5 py-3.5 text-sm text-[#a09a95]">{b.duration_months} month{b.duration_months > 1 ? "s" : ""}</td>
                <td className="px-5 py-3.5 font-heading text-sm text-[#D4006A]">{formatCurrency(b.total_amount)}</td>
                <td className="px-5 py-3.5"><Badge variant={badgeMap[b.status] || "info"}>{b.status.replace("_", " ").charAt(0).toUpperCase() + b.status.slice(1).replace("_", " ")}</Badge></td>
                <td className="px-5 py-3.5">
                  <Button href={`/bookings/${b.id}`} variant="ghost" size="sm"><Eye className="w-3.5 h-3.5" /></Button>
                </td>
              </tr>
            ))}
            {safeBookings.length === 0 && (
              <tr><td colSpan={8} className="text-center text-sm text-[#6b6560] py-8">No bookings found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
