import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Download } from "lucide-react";

export default async function AdminPaymentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirect=/admin/payments");

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) redirect("/dashboard");

  const { data: payments, error } = await supabase
    .from("payments")
    .select("*, bookings(reference), profiles(first_name, last_name)")
    .order("created_at", { ascending: false });

  if (error) console.error("Failed to fetch payments:", error);
  const safePayments = payments || [];

  const totalRevenue = safePayments.filter((p: any) => p.status === "completed").reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
  const pendingAmount = safePayments.filter((p: any) => p.status === "pending").reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

  const badgeMap: Record<string, "success" | "warning" | "error" | "info"> = {
    pending: "warning",
    processing: "info",
    completed: "success",
    failed: "error",
    refunded: "info",
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl mb-1">Manage Payments</h1>
          <p className="text-sm text-[#a09a95]">{safePayments.length} total payments</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-[#a09a95]">Total Revenue</p>
          <p className="text-2xl font-heading text-[#22c55e]">{formatCurrency(totalRevenue)}</p>
          {pendingAmount > 0 && (
            <p className="text-xs text-[#f59e0b]">Pending: {formatCurrency(pendingAmount)}</p>
          )}
        </div>
      </div>

      <div className="overflow-x-auto bg-[#1a1a1a] border border-[#2a2a2a] rounded-md">
        <table className="w-full">
          <thead>
            <tr>
              {["Date", "Reference", "Customer", "Booking", "Amount", "Method", "Status", "Invoice"].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left font-mono text-xs text-[#6b6560] uppercase tracking-wider bg-[#111] border-b border-[#2a2a2a]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {safePayments.map((p: any) => (
              <tr key={p.id} className="border-b border-[#2a2a2a] last:border-b-0 hover:bg-[#111]">
                <td className="px-5 py-3.5 text-sm text-[#a09a95]">{formatDate(p.created_at)}</td>
                <td className="px-5 py-3.5 font-mono text-sm text-[#a09a95]">{p.reference || "—"}</td>
                <td className="px-5 py-3.5 text-sm text-white">{p.profiles?.first_name || "N/A"} {p.profiles?.last_name || ""}</td>
                <td className="px-5 py-3.5 text-sm text-[#a09a95]">{p.bookings?.reference || "—"}</td>
                <td className="px-5 py-3.5 font-heading text-sm text-[#D4006A]">{formatCurrency(p.amount)}</td>
                <td className="px-5 py-3.5 text-sm text-[#a09a95]">{p.card_brand ? `${p.card_brand} ****${p.card_last_four}` : p.payment_method || "—"}</td>
                <td className="px-5 py-3.5"><Badge variant={badgeMap[p.status] || "info"}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</Badge></td>
                <td className="px-5 py-3.5">
                  <a href={`/api/payments/${p.id}/invoice`} className="btn btn--ghost btn--sm" title="Download Invoice" target="_blank">
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </td>
              </tr>
            ))}
            {safePayments.length === 0 && (
              <tr><td colSpan={8} className="text-center text-sm text-[#6b6560] py-8">No payments found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
