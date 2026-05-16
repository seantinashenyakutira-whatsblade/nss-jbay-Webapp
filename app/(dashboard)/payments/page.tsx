import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { CreditCard, Download } from "lucide-react";

export default async function PaymentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { redirect("/auth/login?redirect=/payments&domain=hub"); return; }

  const { data: payments } = await supabase
    .from("payments")
    .select("*, bookings(reference, units(name))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: allPayments } = await supabase
    .from("payments")
    .select("amount")
    .eq("user_id", user.id)
    .eq("status", "completed");

  const totalSpent = (allPayments || []).reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0);

  const badgeMap: Record<string, "success" | "warning" | "error" | "info"> = {
    pending: "warning", completed: "success", failed: "error", refunded: "info",
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl mb-1">Payment History</h1>
          <p className="text-[#a09a95]">View all your past payments</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-[#a09a95]">Total Spent</p>
          <p className="text-2xl font-heading text-[#D4006A]">{formatCurrency(totalSpent)}</p>
        </div>
      </div>

      {payments && payments.length > 0 ? (
        <div className="overflow-x-auto bg-[#1a1a1a] border border-[#2a2a2a] rounded-md">
          <table className="w-full">
            <thead>
              <tr>
                {["Date", "Reference", "Booking", "Amount", "Status", "Card", "Invoice"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left font-mono text-xs text-[#6b6560] uppercase tracking-wider bg-[#111] border-b border-[#2a2a2a]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p: any) => (
                <tr key={p.id} className="border-b border-[#2a2a2a] last:border-b-0 hover:bg-[#111]">
                  <td className="px-5 py-3.5 text-sm text-[#a09a95]">{formatDate(p.created_at)}</td>
                  <td className="px-5 py-3.5 font-mono text-sm text-[#a09a95]">{p.reference}</td>
                  <td className="px-5 py-3.5 text-sm text-[#a09a95]">{p.bookings?.reference || "Storage Rental"}</td>
                  <td className="px-5 py-3.5 font-heading text-sm text-[#D4006A]">{formatCurrency(p.amount)}</td>
                  <td className="px-5 py-3.5"><Badge variant={badgeMap[p.status] || "info"}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</Badge></td>
                  <td className="px-5 py-3.5 text-sm text-[#a09a95]">{p.card_brand ? `${p.card_brand.charAt(0).toUpperCase() + p.card_brand.slice(1)} ****${p.card_last_four || ""}` : "—"}</td>
                  <td className="px-5 py-3.5">
                    <a href={`/api/payments/${p.id}/invoice`} className="btn btn--ghost btn--sm" title="Download Invoice" target="_blank">
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state__icon"><CreditCard className="w-16 h-16 mx-auto text-[#6b6560]" /></div>
          <h3 className="empty-state__title">No payments yet</h3>
          <p className="empty-state__text">Payment records will appear here once you rent a storage unit.</p>
          <a href="/units" className="btn btn--primary">Browse Units</a>
        </div>
      )}
    </div>
  );
}
