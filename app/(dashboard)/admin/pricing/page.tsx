import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

const SIZE_LABELS: Record<string, string> = {
  "extra-small": "Extra Small",
  "small": "Small",
  "medium": "Medium",
  "large": "Large",
};

export default async function AdminPricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirect=/admin/pricing&domain=hub");

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) redirect("/dashboard");

  const { data: units, error } = await supabase
    .from("units")
    .select("size, price_monthly, price_annual, sqm")
    .eq("is_active", true)
    .order("sqm", { ascending: true });

  if (error) console.error("Failed to fetch units:", error);
  const safeUnits = units || [];

  const pricingBySize = safeUnits.reduce((acc: any, u: any) => {
    if (!acc[u.size]) {
      acc[u.size] = { monthly: u.price_monthly, annual: u.price_annual, sqm: u.sqm, count: 0 };
    }
    acc[u.size].count++;
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl mb-1">Pricing Management</h1>
          <p className="text-sm text-[#a09a95]">Current pricing by unit size</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(pricingBySize).map(([size, data]: [string, any]) => (
          <div key={size} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-6">
            <h4 className="text-lg font-heading text-white mb-1">{SIZE_LABELS[size] || size}</h4>
            <p className="text-sm text-[#6b6560] mb-4">{data.sqm} m² · {data.count} unit{data.count > 1 ? "s" : ""}</p>
            
            <div className="space-y-3">
              <div>
                <span className="text-xs text-[#6b6560] uppercase tracking-wider">Monthly</span>
                <p className="text-2xl font-heading text-[#D4006A]">{formatCurrency(data.monthly)}</p>
              </div>
              {data.annual && (
                <div>
                  <span className="text-xs text-[#6b6560] uppercase tracking-wider">Annual</span>
                  <p className="text-xl font-heading text-[#a09a95]">{formatCurrency(data.annual)}</p>
                  <p className="text-xs text-[#22c55e]">Save {Math.round((1 - data.annual / (data.monthly * 12)) * 100)}%</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-6">
        <h4 className="text-lg mb-4">Pricing Notes</h4>
        <ul className="space-y-2 text-sm text-[#a09a95]">
          <li>• 3-month bookings: 5% discount</li>
          <li>• 6-month bookings: 10% discount</li>
          <li>• 12-month bookings: 15% discount</li>
          <li>• All prices include VAT</li>
          <li>• Prices subject to change with 30 days notice</li>
        </ul>
      </div>
    </div>
  );
}
