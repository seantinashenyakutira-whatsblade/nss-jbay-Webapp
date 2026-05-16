import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { Mail, Phone, Shield, User } from "lucide-react";

export default async function AdminCustomersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirect=/admin/customers");

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) redirect("/dashboard");

  const { data: customers, error } = await supabase
    .from("profiles")
    .select("*, bookings(count)")
    .order("created_at", { ascending: false });

  if (error) console.error("Failed to fetch customers:", error);
  const safeCustomers = customers || [];

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl mb-1">Manage Customers</h1>
          <p className="text-sm text-[#a09a95]">{safeCustomers.length} registered users</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {safeCustomers.map((c: any) => (
          <div key={c.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D4006A]/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#D4006A]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">{c.first_name || "N/A"} {c.last_name || ""}</h4>
                  <p className="text-xs text-[#6b6560]">ID: {c.id.slice(0, 8)}...</p>
                </div>
              </div>
              {c.is_admin && (
                <Badge variant="success"><Shield className="w-3 h-3 mr-1" /> Admin</Badge>
              )}
            </div>

            <div className="space-y-2 text-sm text-[#a09a95]">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#6b6560]" />
                <span className="truncate">{c.email || "N/A"}</span>
              </div>
              {c.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#6b6560]" />
                  <span>{c.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#6b6560]" />
                <span>Joined {formatDate(c.created_at)}</span>
              </div>
            </div>
          </div>
        ))}
        {safeCustomers.length === 0 && (
          <div className="col-span-full text-center text-sm text-[#6b6560] py-8">No customers found</div>
        )}
      </div>
    </div>
  );
}
